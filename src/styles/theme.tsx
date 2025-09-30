// src/theme.ts
import { createTheme } from "@mui/material/styles";
import "@mui/x-date-pickers/themeAugmentation";

const theme = createTheme({
  components: {
    // TextField, Input 기본 스타일
    MuiTextField: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            height: "auto",  // multiline이면 auto
            padding: 0,
            "&.MuiInputBase-multiline": {
                height: "auto",
            },
            "& input": {
                height: 28,
                lineHeight: "28px",
                padding: "0 8px",
                fontSize: 13,
            },
            "& textarea": {
                padding: "4px 8px",
                lineHeight: "1.5",
                fontSize: 13,
            },
          },
        },
      },
    },
    // DatePicker input 스타일
    MuiPickersOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 28,
          padding: "0 8px",
          fontSize: 13,
          "& .MuiPickersSectionList-root": {
            minHeight: 28,
            fontSize: 13,
            lineHeight: "28px",
          },
        },
      },
    },
    // Button 기본 스타일
    MuiButton: {
      defaultProps: {
        size: "small",
      },
      styleOverrides: {
        root: {
          minHeight: 28,
          fontSize: 13,
          padding: "0px 4px",
        },
      },
    },

    // Tabs 기본 스타일
    MuiTabs: {
      styleOverrides: {
        root: {
          minHeight: 36,
        },
        scroller: {
          minHeight: 36,
        },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 36,
          textTransform: "none",
          fontSize: 13,
          padding: "0 12px",
        },
      },
    },

    // Card 기본 스타일
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: "4px 8px",
          verticalAlign: "center",
        },
      },
    },
    
  },
});

export default theme;
