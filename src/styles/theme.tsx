// src/theme.ts
import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { Box, Table } from "@mui/material";
import "@mui/x-date-pickers/themeAugmentation";

// ✅ Table 스타일 (기존 그대로)
export const StyledTable = styled(Table)<{ type: "search" | "register" | "form" }>(({ type }) => ({
  tableLayout: "fixed",
  width: "100%",
  borderCollapse: "collapse",
  userSelect: "none",      // 텍스트 선택 방지
  outline: "none",         // 포커스 아웃라인 제거
  cursor: "default", 
  paddingRight: 12,
  
  ...(type === "search"
    ? {
        backgroundColor: "#f9fafb",
        border: "1px solid #ddd",
        "& tr:first-of-type td": { paddingTop: 12 },
        "& tr:last-of-type td": { paddingBottom: 12 },
        "& tr:first-of-type th": { paddingTop: 12 },
        "& tr:last-of-type th": { paddingBottom: 12 },
        "& tr": { border: "none" },
        "& th": {
          border: "none !important",
          textAlign: "right",
          verticalAlign: "middle",
          fontSize: 13,
        },
        "& td": {
          border: "none !important",
          textAlign: "left",
          verticalAlign: "middle",
        },
      }
    : type === "register"
    ? {
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        "& tr": {
          borderBottom: "1px solid #ddd",
        },
        "& tr:last-child": {
          borderBottom: "none",
        },
        "& th, & td": {
          
          verticalAlign: "middle",
          borderBottom: "1px solid #ddd",
          textAlign: "left",
        },
        "& tr:last-child th, & tr:last-child td": {
          borderBottom: "none",
        },
        "& th": {
          borderRight: "1px solid #ddd",
          backgroundColor: "#f5f5f5",
        },
        "& th:last-child": {
          borderRight: "none",
        },
        "& td": {
          borderRight: "1px solid #ddd",
        },
        "& td:last-child": {
          borderRight: "none",
        },
      }
    : type === "form"
    ? {
        backgroundColor: "#fdfdfd",
        border: "1px solid #ccc",
        "& tr": { border: "none" },
        "& th": {
          border: "none !important",
          textAlign: "right",
          verticalAlign: "middle",
          padding: "10px 12px",
        },
        "& td": {
          border: "none !important",
          textAlign: "left",
          verticalAlign: "middle",
          padding: "10px 10px",
        },
       "& .MuiInputBase-root": {
          minHeight: 40,
          "&:not(.MuiInputBase-multiline)": {
            height: 40, // multiline이 아닐 때만 고정 높이
          },
          "& input, & .MuiSelect-select": {
            height: "100%",
            padding: "0 8px",
            boxSizing: "border-box",
          },
          "& textarea": {
            padding: "8px",
            height: "auto !important", // textarea는 자동 높이
          },
          display: "flex",
          alignItems: "center",
        },
      }
    : {}),
}));

export const FormHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

export const FormButtons = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1), // 버튼 간격
  alignItems: "center",   // 버튼 높이 맞추기
}));

// ✅ MUI Theme 생성
const theme = createTheme({
  // --------------------
  // 🎨 기본 색상 팔레트
  // --------------------
  palette: {
    mode: "light", // 🔁 "dark" 로 바꾸면 자동 다크테마
    primary: {
      main: "#4a148c", // 기본 파란색
      light: "#42a5f5",
      dark: "#1565c0",
      contrastText: "#fff",
    },
    secondary: {
      main: "#9c27b0",
      light: "#ba68c8",
      dark: "#7b1fa2",
      contrastText: "#fff",
    },
    background: {
      default: "#f5f6fa", // 전체 배경색
      paper: "#ffffff", // Card, Table 등
    },
    text: {
      primary: "#212121",
      secondary: "#616161",
    },
    divider: "#e0e0e0",
  },

  // --------------------
  // 🧩 MUI 컴포넌트 오버라이드
  // --------------------
  components: {
    // 🔹 Sidebar 관련 공통 스타일 추가
    MuiListItemButton: {
      styleOverrides: {
        root: ({ theme }) => ({
          "&.Mui-selected": {
            backgroundColor: theme.palette.primary.main + "22", // 선택 시 연한 primary 배경
            color: theme.palette.primary.main,
            "&:hover": {
              backgroundColor: theme.palette.primary.main + "33",
            },
          },
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: "#fff" },
        input: {
          height: 28,
          padding: "0 8px",
          fontSize: 13,
        },
        notchedOutline: {
          borderColor: "#ccc",
        },
      },
    },
    MuiSelect: {
      defaultProps: { size: "small", margin: "none" },
      styleOverrides: {
        root: {
          margin: 0,
        },
        select: {
          height: 28,
          padding: "0 8px !important",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          minHeight: "28px !important",
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: 13,
          minHeight: "32px !important",
          padding: "4px 12px",
        },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiInputLabel-root": {
            fontSize: 13,
            transform: "translate(8px, 6px) scale(1)",
          },
          "& .MuiInputLabel-shrink": {
            transform: "translate(8px, -6px) scale(0.75)",
            fontSize: 18,
          },
          "& .MuiInputBase-root": {
            fontSize: 13,
            "&:not(.MuiInputBase-multiline)": {
              height: 28, // multiline이 아닐 때만 고정 높이
            },
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          padding: 0,
          "&.Mui-checked": { backgroundColor: "#fff" },
          "&:hover": { backgroundColor: "#fff" },
          "& svg": {
            backgroundColor: "#fff",
            width: 18,
            height: 18,
          },
        },
      },
    },
    MuiRadio: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          padding: 0,
          "&.Mui-checked": { backgroundColor: "#fff" },
          "&:hover": { backgroundColor: "#fff" },
          "& svg": {
            width: 18,
            height: 18,
          },
        },
      },
    },
    MuiFormControl: {
      defaultProps: {
        margin: "none", // 기본 마진 제거
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: { fontSize: 13, lineHeight: "24px" },
        root: { margin: 0, alignItems: "center", gap: 4 },
      },
    },
    MuiPickersTextField: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          minHeight: 28,
          padding: 0,
          fontSize: 13,
          "& input": { height: 28, padding: 0 },
          "& .MuiPickersSectionList-root": { fontSize: 13, padding: 0 },
          "& .MuiInputAdornment-root": {
            height: 28,
            "& button": { padding: 0, minWidth: 28, width: 24, height: 28 },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: { size: "small" },
      styleOverrides: { root: { minHeight: 28, fontSize: 13, padding: "0px 4px" } },
    },
    MuiTabs: {
      styleOverrides: { root: { minHeight: 36 }, scroller: { minHeight: 36 } },
    },
    MuiTab: {
      styleOverrides: { root: { minHeight: 36, textTransform: "none", fontSize: 13, padding: "0 12px" } },
    },
    MuiCard: {
      styleOverrides: { root: { borderRadius: 8, backgroundColor: "#fff" } },
    },
    MuiTableCell: {
      styleOverrides: { root: { padding: "4px 8px", verticalAlign: "middle" } },
    },
  },
});

export default theme;
