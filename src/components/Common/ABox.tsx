import { Box, BoxProps, SxProps } from "@mui/material";
import React from "react";

interface CommonBoxProps extends Omit<BoxProps, 'sx'> {
  children: React.ReactNode;
  sxProps?: SxProps;
  minHeight?: number | string;
  height?: number | string;
  mb?:number
  props?: BoxProps
}

interface FlexBoxProps extends Omit<BoxProps, 'sx'> {
  children: React.ReactNode;
  direction?: 'row' | 'column';
  gap?: number | string;
  sxProps?: SxProps;
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
export const MainFormBox = ({ children, sxProps, ...props }: CommonBoxProps) => (
  <Box sx={{ display: "flex",
    flexDirection: "column",
    height: "100%",  // 부모 높이를 100%로
    position: "absolute",
    padding: "16px 16px 0 16px",
    minHeight: 300, 
    overflowX: 'hidden',
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

// Flex 컨테이너 Box
export const FlexBox = ({ children, direction = 'row', gap = 2, sxProps, ...props }: FlexBoxProps) => (
  <Box sx={{ display: 'flex', flexDirection: direction, gap, ...sxProps }} {...props}>
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
    <Box sx={{ display: 'flex', flexDirection: direction, gap, ...sxProps }} {...props}>
      {childArray.map((child, index) => {
        let flex = 1;
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
        }

        return (
          <Box
            key={index}
            sx={{
              flex,
              width,
              height,
              minWidth: 0, // flex item overflow 방지
              minHeight: 0,
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
