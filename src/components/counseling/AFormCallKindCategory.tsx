import { useAutoQuery } from "@/hooks";
import { Stack } from "@mui/material";
import { useEffect, useMemo } from "react";
import { ASelect } from "../Form";
import { useFormContext } from "react-hook-form";
import { AFormBaseItemProps } from "../Form/AFormBaseItem";

interface counselCategoryProps {
  category1: string;
  category2: string;
  category3: string;
  findCategory?: number[];
  base?: Omit<AFormBaseItemProps, "name" | "children">;
}

export const AFormCallKindCategory: React.FC<counselCategoryProps> = ({
  category1,
  category2,
  category3,  
  findCategory,
  base
}) => {
  const {data: callKindList } = useAutoQuery<any[]>({
    queryKey: ["callKind"], 
    url: "/api/common/callkind/getCallKindList",
    isGlobal: true,
  });
  
  const { watch, setValue } = useFormContext();
  const category1Value = watch(category1);
  const category2Value = watch(category2);
  const category3Value = watch(category3);

  // category1: typeName 기준 중복 제거 (findCategory로 필터링)
  const categoryList1 = callKindList
    ?.filter((item: any) => {
      // findCategory가 있으면 해당하는 callType만 필터링
      if (findCategory && findCategory.length > 0) {
        return findCategory.includes(item.callType);
      }
      return true;
    })
    .filter((item: any, index: number, self: any[]) => 
      index === self.findIndex((t) => t.callType === item.callType)
    )
    .map((item: any) => ({
      
      label: item.typeName,
      value: item.callType
    }));

  // category2: category1의 callType에 해당하는 kindName 그룹핑
  const categoryList2 = useMemo(() => {
    if (!category1Value || !callKindList) return [];
    
    return Array.from(
      callKindList
        .filter((item: any) => item.callType === category1Value) // category1의 callType으로 필터링
        .reduce((map: Map<string, any>, item: any) => {
          // kindName으로 키 생성
          const key = item.kindName;
          if (!map.has(key)) {
            map.set(key, { 
              label: item.kindName, 
              kindName: item.kindName, 
              callType: item.callType, 
              callKinds: [] 
            });
          }
          map.get(key).callKinds.push(item.callKind);
          return map;
        }, new Map())
        .values()
    ).map((item: any) => ({
      label: item.label, // 표시용
      value: item.callKinds.join(','), // callKinds를 콤마로 구분한 문자열
      parentValue: item.callType, // callType을 parentValue로 (category1과 연결)
      kindName: item.kindName, // kindName 보관
      callKinds: item.callKinds // 내부적으로 callKinds 보관
    }));
  }, [category1Value, callKindList]);

  // category3: category1의 callType과 category2의 callKinds에 해당하는 항목들
  const categoryList3 = useMemo(() => {
    if (!category1Value || !category2Value || !callKindList) return [];
    
    // category2Value가 문자열이 아니면 문자열로 변환하고, 빈 문자열이면 빈 배열 반환
    const category2ValueStr = category2Value ? String(category2Value) : "";
    if (!category2ValueStr || category2ValueStr.trim() === "") return [];
    
    // category2Value를 배열로 변환 (예: "11,15" → [11, 15])
    const selectedCallKinds = category2ValueStr
      .split(',')
      .map((ck: string) => parseInt(ck.trim(), 10))
      .filter((ck: number) => !isNaN(ck));
    
    // category1의 callType과 category2의 callKind 둘 다 일치하는 항목만 필터링
    return callKindList
      .filter((item: any) => 
        item.callType === category1Value && selectedCallKinds.includes(item.callKind)
      )
      .map((item: any) => ({
        label: item.codeName,
        value: item.callType + ',' + item.interactionType,
        parentValue: category2ValueStr
      }));
  }, [category1Value, category2Value, callKindList]);


  return (
    <Stack direction="row" spacing={1} sx={{ width: '100%', '& > *': { flex: 1, minWidth: 0 } }}>
      <ASelect.Form name={category1} list={categoryList1} base={base} isPlaceholder={base?.disabled ? false : true}/>
      <ASelect.Form name={category2} list={categoryList2} parent={category1} base={base} isPlaceholder={base?.disabled ? false : true}  />
      <ASelect.Form name={category3} list={categoryList3} parent={category2} base={base} isPlaceholder={base?.disabled ? false : true} />
    </Stack>
  )
}