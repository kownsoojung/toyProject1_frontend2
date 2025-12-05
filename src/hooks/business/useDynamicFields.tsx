import { useAutoQuery } from "../api/useAutoQuery";
import { useMemo } from "react";
import z from "zod";

export interface DynamicFieldConfig {
  index: number;
  key: string;
  name: string;
  type: "radio" | "check" | "select" | "date" | "number" | "text";
  searchFlag: number;
  detail: string;
  options?: { label: string; value: string }[];
}

interface UseDynamicFieldsProps {
  filterSearchFlag?: boolean; // searchFlag=1만 필터링할지
}

/**
 * 동적 필드 정보를 가져오는 Hook
 * - API로부터 부가정보 캡션 설정을 가져옴
 * - searchFlag=1인 항목만 필터링 (선택적)
 * - Zod 스키마 및 defaultValues 자동 생성
 */
export const useDynamicFields = ({ 
  filterSearchFlag = true,
}: UseDynamicFieldsProps = {}) => {
  
  // API 호출
  const { data: captionData, isLoading, error } = useAutoQuery<any>({
    queryKey: ["counselingCaptions"],
    url: "/api/common/counseling/getCaptions",
  });

  // detail 문자열 파싱 ("값1|값2|값3" → [{label: "값1", value: "값1"}, ...])
  const parseDetailOptions = (detail: string): { label: string; value: string }[] => {
    if (!detail) return [];
    return detail.split("|")
      .filter(item => item.trim())
      .map(item => ({
        label: item.trim(),
        value: item.trim()
      }));
  };

  // config 파싱 (기존 fn_GetAddInfoConfigTicket 대체)
  const parseAddInfoConfig = (configStr: string) => {
    try {
      // JSON 형식인 경우
      if (configStr.startsWith("{")) {
        return JSON.parse(configStr);
      }
      
      // 커스텀 형식인 경우 (예: "name:이름|type:text|searchFlag:1|detail:값1|값2")
      const config: any = {
        name: "",
        type: "text",
        searchFlag: 0,
        detail: "",
      };
      
      const parts = configStr.split("|");
      parts.forEach(part => {
        const [key, value] = part.split(":");
        if (key && value) {
          config[key.trim()] = isNaN(Number(value)) ? value.trim() : Number(value);
        }
      });
      
      return config;
    } catch (e) {
      console.warn("Failed to parse config:", configStr, e);
      return {
        name: "",
        type: "text",
        searchFlag: 0,
        detail: "",
      };
    }
  };

  // 필드 파싱 및 필터링
  const fields = useMemo<DynamicFieldConfig[]>(() => {
    if (!captionData) return [];

    const captions = captionData.captions || {};
    const captionFlags = captionData.captionFlags || {};

    return Object.entries(captions)
      .filter(([key]) => key.startsWith("caption_"))
      .map(([key, value]: [string, any]) => {
        const index = Number(key.replace("caption_", ""));
        const config = parseAddInfoConfig(String(value));
        
        return {
          index,
          key: `addInfo_${index}`,
          name: config.name || `필드 ${index}`,
          type: config.type || "text",
          searchFlag: config.searchFlag || 0,
          detail: config.detail || "",
          options: parseDetailOptions(config.detail || ""),
        } as DynamicFieldConfig;
      })
      .filter(field => 
        captionFlags[`caption_${field.index}`] && 
        (!filterSearchFlag || field.searchFlag === 1)
      );
  }, [captionData, filterSearchFlag]);

  // defaultValues 생성
  const getDefaultValues = useMemo(() => {
    return fields.reduce((acc, field) => {
      acc[field.key] = field.type === "check" ? [] : "";
      return acc;
    }, {} as Record<string, any>);
  }, [fields]);

  // Zod 스키마 동적 생성
  const getDynamicSchema = useMemo(() => {
    const schema: Record<string, any> = {};
    
    fields.forEach(field => {
      switch (field.type) {
        case "number":
          schema[field.key] = z.number().optional();
          break;
        case "date":
          schema[field.key] = z.string().optional();
          break;
        case "check":
          schema[field.key] = z.array(z.string()).optional();
          break;
        default:
          schema[field.key] = z.string().optional();
      }
    });
    
    return schema;
  }, [fields]);

  return {
    fields,
    isLoading,
    error,
    getDefaultValues,
    getDynamicSchema,
  };
};

