import { Box, BoxProps, SxProps } from "@mui/material";
import React from "react";
import { useTheme } from "@mui/material/styles";

interface CommonBoxProps extends Omit<BoxProps, 'sx'> {
  children: React.ReactNode;
  sxProps?: SxProps;
  minHeight?: number | string;
  height?: number | string;
  mb?:number
  props?: BoxProps
  popup?: boolean;
}

interface FlexBoxProps extends Omit<BoxProps, 'sx'> {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: number | string;
  sxProps?: SxProps;
  isTable?: boolean;
}

interface RatioBoxProps extends Omit<BoxProps, 'sx'> {
  ratios?: number[];  // [1, 2, 3] = 1:2:3 비율
  sizes?: (number | string)[];  // ['100px', '200px', 'auto']
  direction?: 'row' | 'column';
  gap?: number | string;
  children: React.ReactNode;
  sxProps?: SxProps;
}

// 메인 폼 Box - 100% 높이 차지
export const MainFormBox = ({ children, sxProps, popup=false, ...props }: CommonBoxProps) => (
  <Box sx={{ display: "flex",
    flexDirection: "column",
    height: "100%",  // 부모 높이를 100%로
    width: "100%",
    position: "absolute",
    padding: "16px 16px 0 16px",
    minHeight: 300, 
    overflowX: 'hidden',
    ...(popup && {
      flex: 1, 
      position: "relative", 
      minHeight: 0, 
    }),
    ...sxProps }} 
    {...props}
  >
    {children}
  </Box>
);

// 메인 팝업 폼 Box - 100% 높이 차지
export const PopupBox = ({ children, sxProps, ...props }: CommonBoxProps) => (
  <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }} {...props}>
    
    {children}
    
  </Box>
);
export const PopupFooterBox = ({ children, sxProps, ...props }: CommonBoxProps) => (
  <Box sx={{ 
    p: 1, 
    marginTop: 1,
    borderTop: "1px solid #ccc", 
    paddingLeft: 3,
    flexShrink: 0,  // 이미 설정되어 있음
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "background.paper",  // 배경색 추가로 더 명확하게 구분
    ...sxProps
  }}
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

// Flex 컨테이너 Box
export const FlexBox = ({ children, direction = 'row', gap = 0.5, alignItems = 'center', isTable = false, sxProps, ...props }: FlexBoxProps) => (
  <Box sx={{ display: 'flex', flexDirection: direction, gap, alignItems, ...(isTable && { width: '100%', '& > span' :{flex: 1, minWidth: 0, display: "flex"}}), ...sxProps }} {...props}>
    {children}
  </Box>
);

// 비율/크기로 나누는 Box
export const RatioBox = ({ 
  ratios, 
  sizes, 
  direction = 'row', 
  gap = 2, 
  children, 
  sxProps, 
  ...props 
}: RatioBoxProps) => {
  const childArray = React.Children.toArray(children);

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: direction, 
      gap, 
      width: '100%', // ⭐ 컨테이너 전체 너비 차지
      ...sxProps 
    }} {...props}>
      {childArray.map((child, index) => {
        let flex: number | undefined;
        let width: string | number | undefined;
        let height: string | number | undefined;

        // sizes가 있으면 우선 사용 (px, %, auto 등)
        if (sizes && sizes[index] !== undefined) {
          if (direction === 'row') {
            width = sizes[index];
            flex = sizes[index] === 'auto' ? 1 : 0;
          } else {
            height = sizes[index];
            flex = sizes[index] === 'auto' ? 1 : 0;
          }
        }
        // ratios가 있으면 비율 사용 (1:2:3)
        else if (ratios && ratios[index] !== undefined) {
          flex = ratios[index];
          // ratios 사용 시 width/height는 명시적으로 undefined로 설정 (flex만 사용)
          width = undefined;
          height = undefined;
        }
        // ratios나 sizes가 없으면 기본값 1
        else {
          flex = 1;
        }

        return (
          <Box
            key={index}
            sx={{
              flex: flex ?? 1, // ⭐ flex가 없으면 기본값 1
              ...(width !== undefined && { width }), // ⭐ width가 있을 때만 설정
              ...(height !== undefined && { height }), // ⭐ height가 있을 때만 설정
              minWidth: 0, // flex item overflow 방지
              minHeight: 0,
              overflow: 'hidden', // 넘치는 내용 처리
              wordBreak: 'break-word', // 긴 텍스트 줄바꿈
              boxSizing: 'border-box', // ⭐ 패딩/보더 포함 계산
            }}
          >
            {child}
          </Box>
        );
      })}
    </Box>
  );
};
  
export const AGridToolBarBox = ({ children, sxProps, props }: CommonBoxProps) => {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", ...sxProps }} {...props}>
      {children}
    </Box>
  );
};

// Form 헤더 컴포넌트
export const FormHeader = ({ children, sxProps, ...props }: CommonBoxProps) => {
  const theme = useTheme();
  return (
    <Box 
      sx={{ 
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: theme.spacing(1),
        ...sxProps 
      }} 
      {...props}
    >
      {children}
    </Box>
  );
};

// Form 버튼 컴포넌트
export const FormButtons = ({ children, sxProps, ...props }: CommonBoxProps) => {
  return (
    <Box 
      sx={{ 
        display: "flex",
        gap: 0.5,
        alignItems: "center",
        ...sxProps 
      }} 
      {...props}
    >
      {children}
    </Box>
  );
};
