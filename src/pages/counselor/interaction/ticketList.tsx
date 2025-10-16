import { MainFormBox } from "@/components/AFormItem/common/ABox";
import { FormHeader } from "@/styles/theme";
import { Box } from "@mui/material";

const ticketList = () => {
  return (
    <MainFormBox>
        <FormHeader>
            <Box component="span" sx={{ fontWeight: 600 }}>티켓 목록</Box>
        </FormHeader> 
    </MainFormBox>
  )
}

export default ticketList;
