// src/theme.ts
import { createTheme } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import { Table } from "@mui/material";
import "@mui/x-date-pickers/themeAugmentation";

export const StyledTable = styled(Table)<{ type: "search" | "register" }>(({ type }) => ({
  tableLayout: "fixed",
  width: "100%",
  borderCollapse: "collapse",
  "& tr:first-of-type td": { paddingTop: 12,},
  "& tr:last-of-type td": { paddingBottom: 12 },
  ...(type === "search"
    ? {
        backgroundColor: "#f9fafb",
        border: "1px solid #ddd",
        "& tr": {
          border: "none",
        },
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
    : {
        backgroundColor: "#fff",
        border: "1px solid #ddd",
        "& th, & td": {
          padding: "12px 14px",
          verticalAlign: "middle",
          borderBottom: "1px solid #ddd",
          textAlign: "left",
        },
      }),
}));

const theme = createTheme({
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: { backgroundColor: "#fff" },
        input: { backgroundColor: "#fff" },
      },
    },
    MuiTextField: {
      defaultProps: { size: "small" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            height: "auto",
            padding: 0,
            "&.MuiInputBase-multiline": { height: "auto" },
            "& input": { height: 28, lineHeight: "28px", padding: "0 8px", fontSize: 13 },
            "& textarea": { padding: "4px 8px", lineHeight: "1.5", fontSize: 13 },
          },
        },
      },
    },
    MuiCheckbox: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          backgroundColor: "transparent",
          padding: 0, // 체크박스 주변 여백 최소화
          "&.Mui-checked": { backgroundColor: "#fff" },
          "&:hover": { backgroundColor: "#fff" },
          "& svg": {
            backgroundColor: "#fff", // 아이콘 내부 배경 흰색
            width: 18, // 체크 아이콘 크기 조절
            height: 18,
          },
        },
      },
    },
    MuiRadio: {
      defaultProps: { size: 'small' },
      styleOverrides: {
        root: {
          padding: 0, // 주변 여백 최소화
          "&.Mui-checked": { backgroundColor: "#fff" },
          "&:hover": { backgroundColor: "#fff" },
          "& svg": {
            
            width: 18, // 라디오 아이콘 크기
            height: 18,
            
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: { fontSize: 14, lineHeight: '24px' },
        root: { margin: 0, alignItems: 'center', gap: 4 }, // 체크박스와 label 간격
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
    MuiTabs: { styleOverrides: { root: { minHeight: 36 }, scroller: { minHeight: 36 } } },
    MuiTab: { styleOverrides: { root: { minHeight: 36, textTransform: "none", fontSize: 13, padding: "0 12px" } } },
    MuiCard: { styleOverrides: { root: { borderRadius: 8 } } },
    MuiTableCell: { styleOverrides: { root: { padding: "4px 8px", verticalAlign: "middle" } } },
  },
});

export default theme;
