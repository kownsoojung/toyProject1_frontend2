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
  fontSize: 13,
  
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
          userSelect: "text", 
          fontSize: 13,
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
          userSelect: "text", 
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
          userSelect: "text", 
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
            padding: "0 8px",
            height: "auto !important", // textarea는 자동 높이
          },
          display: "flex",
          alignItems: "center",
        },
      }
    : {}),
  }));

// ✅ MUI Theme 생성
const theme = createTheme({
  // --------------------
  // 🎨 기본 색상 팔레트
  // --------------------
  typography: {
    fontSize: 13,
    htmlFontSize: 13, // rem 기준을 13px로 설정
  },
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
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontSize: 13,
        },
        html: {
          fontSize: 13,
        },
        // ⭐ fieldset disabled 전역 스타일 (opacity 제거, pointerEvents와 cursor만 적용)
        "fieldset:disabled": {
          // opacity 제거 - 개별 컴포넌트에서만 처리하여 중첩 방지
          pointerEvents: "none",
          "& *": {
            cursor: "not-allowed !important",
          },
          // ⭐ 색상/투명도는 각 컴포넌트의 disabled에서 처리
          "& .MuiIconButton-root": {
            color: "rgba(255, 255, 255, 0.7) !important", // ⭐ 0.5 → 0.7로 더 선명하게
          },
          // ⭐ call-control-icon 클래스를 가진 아이콘은 색상 유지 (CSS 클래스로 색상 제어)
          "& .MuiSvgIcon-root:not(.call-control-icon)": {
            color: "rgba(255, 255, 255, 0.7) !important", // ⭐ 0.5 → 0.7로 더 선명하게
          },
          // ⭐ call-control-icon 클래스를 가진 아이콘은 색상 덮어쓰지 않음 (CSS 클래스 색상 유지)
          "& .call-control-icon": {
            opacity: 0.7, // ⭐ 투명도만 적용하여 색상은 CSS 클래스에서 제어
          },
          "& .MuiSwitch-root": {
            opacity: 0.7, // ⭐ 0.5 → 0.7로 더 선명하게
            "& .MuiSwitch-switchBase": {
              cursor: "not-allowed",
            },
          },
          "& .MuiOutlinedInput-root": {
            opacity: 0.7, // ⭐ fieldset disabled 시 Input 투명도
            cursor: "not-allowed",
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.26) !important",
            },
          },
          "& .MuiSelect-root": {
            opacity: 0.7, // ⭐ fieldset disabled 시 Select 투명도
            cursor: "not-allowed",
          },
          "& .MuiSlider-root": {
            opacity: 0.7, // ⭐ fieldset disabled 시 Slider 투명도
            cursor: "not-allowed",
          },
        },
      },
    },
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
        root: { 
          backgroundColor: "#fff",
          "&.Mui-disabled": {
            opacity: 0.7, // ⭐ disabled 시 투명도
            cursor: "not-allowed",
            "& fieldset": {
              borderColor: "rgba(0, 0, 0, 0.26) !important",
            },
          },
          // ⭐ readonly 스타일 추가
          "& .MuiInputBase-input[readonly]": {
            backgroundColor: "#f5f5f5",
            cursor: "text",
            "&:focus": {
              backgroundColor: "#f5f5f5",
            },
          },
          "&.Mui-focused .MuiInputBase-input[readonly]": {
            backgroundColor: "#f5f5f5",
            "& fieldset": {
              borderColor: "#ccc",
            },
          },
        },
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
          "&.Mui-disabled": {
            opacity: 0.7, // ⭐ disabled 시 투명도
            cursor: "not-allowed",
          },
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
          "& .MuiInputBase-multiline": {
            padding: "8px 0",
          },
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
            // ⭐ readonly 스타일 추가
            "& .MuiInputBase-input[readonly]": {
              backgroundColor: "#f5f5f5",
              cursor: "text",
            },
            "&.Mui-focused .MuiInputBase-input[readonly]": {
              backgroundColor: "#f5f5f5",
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
    MuiSwitch: {
      styleOverrides: {
        root: {
          "& .MuiSwitch-switchBase.Mui-disabled": {
            cursor: "not-allowed",
            filter: "brightness(0.8)", // ⭐ 0.7 → 0.8로 더 선명하게
            opacity: 0.7, // ⭐ 0.5 → 0.7로 더 선명하게
          },
          "& .MuiSwitch-switchBase.Mui-disabled + .MuiSwitch-track": {
            opacity: 0.7, // ⭐ 0.5 → 0.7로 더 선명하게
          },
        },
      },
    },
    // ⭐ IconButton disabled 스타일 추가
    MuiIconButton: {
      styleOverrides: {
        root: {
          "&.Mui-disabled": {
            color: "rgba(255, 255, 255, 0.7)", // ⭐ 0.5 → 0.7로 더 선명하게
            cursor: "not-allowed",
            pointerEvents: "none",
          },
        },
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
      styleOverrides: { 
        root: { minHeight: 36 }, 
        scroller: { minHeight: 36 },
        scrollButtons: {
          "&.Mui-disabled": {
            opacity: 0.3,
          },
        },
      },
    },
    MuiTab: {
      styleOverrides: { 
        root: ({ theme }) => ({
          minHeight: 36, 
          textTransform: "none", 
          fontSize: 13, 
          padding: "0 12px",
          borderRadius: "8px 8px 0 0",
          border: "1px solid #ccc",
          borderBottom: "none",
          color: theme.palette.text.secondary,
          backgroundColor: "#e0e0e0",
          "&.Mui-selected": {
            color: theme.palette.primary.main,
            fontWeight: 600,
            backgroundColor: "#fff",
          },
          "&:hover": {
            backgroundColor: theme.palette.action.hover,
          },
        }),
      },
    },
    MuiCard: {
      styleOverrides: { root: { backgroundColor: "#fff" } },
    },
    MuiTableCell: {
      styleOverrides: { root: { padding: "4px 8px", verticalAlign: "middle" } },
    },
  },
});

export default theme;
