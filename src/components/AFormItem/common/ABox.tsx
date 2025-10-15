import { Box, BoxProps, SxProps } from "@mui/material";

interface CommonBoxProps extends Omit<BoxProps, 'sx'> {
  children: React.ReactNode;
  sxProps?: SxProps;
  minHeight?: number | string;
  height?: number | string;
  mb?:number
}

// 메인 폼 Box - 100% 높이 차지
export const MainFormBox = ({ children, sxProps, ...props }: CommonBoxProps) => (
  <Box sx={{ display: "flex",
    flexDirection: "column",
    height: "100%",  // 부모 높이를 100%로
    position: "absolute",
    padding: "16px 16px 0 16px",
    minHeight: 600, 
    ...sxProps }} 
    {...props}
  >
    {children}
  </Box>
);

// 자동 높이 Box - 남은 공간 채우기 (flex: 1)
export const AutoBox = ({ children, minHeight = 300, sxProps, ...props }: CommonBoxProps) => (
  <Box sx={{ flex: 1, minHeight: minHeight, display: "flex", flexDirection: "column", ...sxProps }} {...props}>
    {children}
  </Box>
);

// 자동 높이 Box - 남은 공간 채우기 (flex: 1)
export const ABox = ({ children, minHeight = 200, height=50, mb=1, sxProps, ...props }: CommonBoxProps) => (
  <Box sx={{height: 40, flexShrink: 0, minHeight: minHeight ,mb: mb,...sxProps}}{...props}>
      {children}
  </Box>
);
  
