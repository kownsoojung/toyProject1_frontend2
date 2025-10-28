import { Stack } from "@mui/material";
import { AFormSelect } from "../Form";
import { useFormContext, useWatch } from "react-hook-form";
import { useEffect, useRef } from "react";

interface counselCategoryProps {
  category1: string;
  category2: string;
  category3: string;
  category4?: string;
}

export const AFormCounselCategory: React.FC<counselCategoryProps> = ({
  category1,
  category2,
  category3,
  category4
}) => {

  const { control, setValue } = useFormContext(); 
  const category1Value = useWatch({ control, name: category1 });
  const category2Value = useWatch({ control, name: category2 });
  const category3Value = useWatch({ control, name: category3 });
  
  // 초기 렌더링 여부 추적
  const isFirstRender = useRef(true);
  
  // category1이 바뀌면 하위 카테고리 모두 초기화
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue(category2, "");
    setValue(category3, "");
    if (category4) setValue(category4, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category1Value]);
  
  // category2가 바뀌면 하위 카테고리 초기화
  useEffect(() => {
    if (isFirstRender.current) return;
    setValue(category3, "");
    if (category4) setValue(category4, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category2Value]);
  
  // category3이 바뀌면 category4 초기화
  useEffect(() => {
    if (isFirstRender.current) return;
    if (category4) setValue(category4, "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category3Value]);
  
  return (
    <Stack direction="row" spacing={2}>
      <AFormSelect 
        name={category1} 
        selectCode={{depth:0}} 
        codeType="counselCategory" 
      />
      <AFormSelect 
        name={category2} 
        selectCode={{depth:1}} 
        codeType="counselCategory" 
        parent={category1Value}
      />
      <AFormSelect 
        name={category3} 
        selectCode={{depth:2}} 
        codeType="counselCategory" 
        parent={category2Value}
      />
      {category4 && (
        <AFormSelect 
          name={category4} 
          selectCode={{depth:3}} 
          codeType="counselCategory" 
          parent={category3Value}
        />
      )}
    </Stack>
  )
}