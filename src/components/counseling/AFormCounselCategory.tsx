import { Stack } from "@mui/material";
import { AFormSelect } from "../Form";

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

  
  
  return (
    <Stack direction="row" spacing={1} sx={{ width: '100%', '& > *': { flex: 1, minWidth: 0 } }}>
      <AFormSelect 
        name={category1} 
        selectCode={{depth:0, transferKind: 0}} 
        codeType="counselCategory" 
        msize={0}
      />
      <AFormSelect 
        name={category2} 
        selectCode={{depth:1, transferKind: 0}} 
        codeType="counselCategory" 
        parent={category1}
        msize={0}
      />
      <AFormSelect 
        name={category3} 
        selectCode={{depth:2, transferKind: 0}} 
        codeType="counselCategory" 
        parent={category2}
        msize={0}
      />
      {category4 && (
        <AFormSelect 
          name={category4} 
          selectCode={{depth:3, transferKind: 0}} 
          codeType="counselCategory" 
          parent={category3}
          msize={0}
        />
      )}
    </Stack>
  )
}