// src/theme.ts
import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { Box, Table } from "@mui/material";
import "@mui/x-date-pickers/themeAugmentation";
import { Height } from "@mui/icons-material";

// ✅ Table 스타일 (기존 그대로)
export const StyledTable = styled(Table)<{ type: "search" | "register" | "form" }>(({ type }) => ({
  tableLayout: "fixed",
  width: "100%",
  borderCollapse: "collapse",
  "& tr:first-of-type td": { paddingTop: 12 },
  "& tr:last-of-type td": { paddingBottom: 12 },
  ...(type === "search"
    ? {
        backgroundColor: "#f9fafb",
        border: "1px solid #ddd",
        "& tr": { border: "none" },
        "& th": {
          border: "none !important",
          textAlign: "right",
          verticalAlign: "middle",
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
        "& th, & td": {
          padding: "12px 14px",
          verticalAlign: "middle",
          borderBottom: "1px solid #ddd",
          textAlign: "left",
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
          height: 40, // 전체 컨테이너 높이
          minHeight: 40,
          "& input, & textarea, & .MuiSelect-select": {
            height: "100%",       // 부모 높이 따라가기
            padding: "0 8px",
            boxSizing: "border-box",
          },
          "& textarea": {
            padding: "8px",       // multiline 패딩
          },
          display: "flex",        // Select 중앙 정렬용
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
          height: 32,
          padding: "0 8px",
          fontSize: 13,
        },
        notchedOutline: {
          borderColor: "#ccc",
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
            height: 32,
            fontSize: 13,
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
    MuiFormControlLabel: {
      styleOverrides: {
        label: { fontSize: 14, lineHeight: "24px" },
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
