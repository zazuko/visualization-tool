import { Fade, Grow } from "@mui/material";
import { Breakpoint, createTheme, Theme } from "@mui/material/styles";
import { merge, omit } from "lodash";

import { Icon } from "@/icons";
import shadows from "@/themes/shadows";

const isSafari15 =
  typeof navigator !== "undefined" && navigator.vendor.indexOf("Apple") >= 0
    ? navigator.userAgent
        .match(/Version[/\s]([\d]+)/g)?.[0]
        ?.split("/")?.[1] === "15"
    : false;

const breakpoints = ["xs", "md"] as Breakpoint[];

const createTypographyVariant = (theme: Theme, spec: Record<string, any>) => {
  const res = omit(spec, ["lineHeight", "fontSize"]);
  for (let i = 0; i < spec.fontSize.length; i++) {
    const lineHeight = `${spec.lineHeight[i]}px`;
    const fontSize = `${spec.fontSize[i]}px`;
    res[theme.breakpoints.up(breakpoints[i])] = {
      fontSize,
      lineHeight,
    };
  }
  return res;
};

/**
 * Theme conforming to the Swiss Federal CD guidelines
 */
export const theme = createTheme({
  palette: {
    primary: {
      light: "#d8e8ef",
      main: "#006699",
      hover: "#004B70",
      active: "#00334D",
      disabled: "#599cbd",
    },
    divider: "#CCCCCC",
    secondary: {
      main: "#757575",
      hover: "#616161",
      active: "#454545",
      disabled: "#a6a6a6",
    },
    success: {
      main: "#3c763d",
      light: "#DFF0D8",
      hover: "#3c763d",
      active: "#3c763d",
      disabled: "#DFF0D8",
    },
    muted: {
      main: "#F5F5F5",
      colored: "#F9FAFB",
      dark: "#F2F7F9",
    },
    brand: {
      main: "#DC0018",
    },
    hint: {
      main: "#757575",
    },
    alert: {
      main: "#DC0018",
      light: "#ffe6e1",
    },
    warning: {
      main: "#8a6d3b",
      light: "#FCF0B4",
    },
    info: {
      main: "#31708f",
      light: "#d9edf7",
    },
    error: {
      main: "#a82824",
      light: "#f2dede",
    },
    organization: {
      main: "#006699",
      light: "#d8e8ef", // same as primaryLight
    },
    category: {
      main: "#3c763d",
      light: "#DFF0D8", // same as successLight
    },
    grey: {
      100: "#FFFFFF",
      200: "#F5F5F5",
      300: "#E5E5E5",
      400: "#D5D5D5",
      500: "#CCCCCC",
      600: "#757575",
      700: "#454545",
      800: "#333333",
      900: "#000000",
    },
  },
  breakpoints: {
    values: { xs: 0, sm: 768, md: 992, lg: 1280, xl: 1360 },
  },
  spacing: [0, 4, 8, 12, 16, 24, 32, 64, 72],
  shape: {
    borderRadius: 2,
  },
  shadows: shadows,

  typography: {
    fontFamily: [
      "FrutigerNeue",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Helvetica",
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

theme.typography = merge(theme.typography, {
  link: {
    textDecoration: "none",
  },
  h1: createTypographyVariant(theme, {
    fontSize: [24, 32],
    lineHeight: [36, 48],
    fontWeight: 700,
  }),
  h2: createTypographyVariant(theme, {
    fontSize: [18, 24],
    lineHeight: [28, 36],
    fontWeight: 500,
  }),
  h3: createTypographyVariant(theme, {
    fontSize: [16, 18],
    lineHeight: [28, 36],
    fontWeight: "bold",
  }),
  h4: createTypographyVariant(theme, {
    fontSize: [14, 16],
    lineHeight: [22, 24],
    fontWeight: "bold",
  }),
  h5: createTypographyVariant(theme, {
    fontSize: [12, 14],
    lineHeight: [18, 20],
    fontWeight: "bold",
  }),
  body1: createTypographyVariant(theme, {
    fontSize: [14, 16],
    lineHeight: [22, 24],
    fontWeight: "regular",
  }),
  body2: createTypographyVariant(theme, {
    fontSize: [12, 14],
    lineHeight: [18, 20],
    fontWeight: "regular",
  }),
  tag: createTypographyVariant(theme, {
    lineHeight: [18, 20],
    fontSize: [12, 14],
  }),
  // table: {
  //   fontFamily: "body",
  //   lineHeight: [2, 4, 4],
  //   fontWeight: "regular",
  //   fontSize: [2, 3, 3],
  // },
  caption: createTypographyVariant(theme, {
    fontSize: [10, 12],
    lineHeight: [16, 18],
    fontWeight: "regular",
  }),
});

const makeStandardAlertVariant = ({
  severity,
}: {
  severity: "info" | "warning" | "success" | "error";
}) => ({
  "&": {
    backgroundColor: theme.palette[severity].light,
  },
  "& > .MuiAlert-message": {
    color: theme.palette[severity].main,
  },
  "& > .MuiAlert-icon": {
    color: theme.palette[severity].main,
  },
});

theme.components = {
  MuiLink: {
    defaultProps: {
      underline: "hover",
      color: "inherit",
    },
    styleOverrides: {},
  },
  MuiInputLabel: {
    styleOverrides: {
      root: {
        textAlign: "left",
        pr: 1,
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        display: "-webkit-box",
        overflow: "hidden",
        fontSize: "0.875rem",
      },
      sizeSmall: {
        fontSize: "0.75rem",
      },
    },
  },
  MuiButton: {
    variants: [
      {
        props: { variant: "selectColorPicker" },
        style: {
          color: "grey.700",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          bg: "monochrome100",
          p: 1,
          height: "40px",
          borderWidth: "1px",
          borderStyle: "solid",
          borderColor: theme.palette.divider,
          ":hover": {
            bg: "monochrome100",
          },
          ":active": {
            backgroundColor: "grey.100",
          },
          ":disabled": {
            cursor: "initial",
            backgroundColor: "muted.main",
          },
        },
      },
      {
        props: { variant: "inline" },
        style: {
          backgroundColor: "transparent",
          ":hover": {
            backgroundColor: "transparent",
          },
          fontSize: theme.typography.body2.fontSize,
          padding: 0,
          margin: 0,
          minHeight: "1rem",
          color: theme.palette.primary.main,
          ":active": {
            backgroundColor: "grey.100",
          },
          ":disabled": {
            color: "grey.500",
          },
        },
      },
      {
        props: { variant: "inverted" },
        style: {
          backgroundColor: theme.palette.primary.contrastText,
          color: theme.palette.primary.main,
          ":hover": {
            backgroundColor: theme.palette.grey[300],
          },
          ":active": {
            bg: theme.palette.grey[400],
          },
          ":disabled": {
            cursor: "initial",
            color: theme.palette.grey[600],
            bg: theme.palette.grey[300],
          },
        },
      },
    ],
    defaultProps: {
      variant: "contained",
      color: "primary",
    },
    styleOverrides: {
      sizeSmall: {
        ".MuiButton-startIcon": {
          marginRight: 4,
        },
        ".MuiButton-endIcon": {
          marginLeft: 4,
        },
      },
      sizeMedium: {
        fontSize: 14,
        lineHeight: "24px",
        minHeight: 40,
      },
      sizeLarge: {
        fontSize: "1rem",
        paddingLeft: theme.spacing(4),
        paddingRight: theme.spacing(4),
        minHeight: 44,

        ".MuiButton-startIcon > :nth-of-type(1)": {
          width: 20,
          height: 20,
        },
      },
      root: {
        padding: `${theme.spacing(4)}px ${theme.spacing(3)}px`,
        alignItems: "center",
        lineHeight: 1.25,
        justifyContent: "flex-start",
        borderRadius: 3,
        transition: "background-color .2s",
        cursor: "pointer",
        display: "inline-flex",
        flexGrow: 0,

        "& > svg": {
          width: 22,
          marginTop: -1,
          marginBottom: -1,
        },
        "& > svg:first-of-type": {
          marginRight: 2,
        },
        "& > svg:last-of-type": {
          marginLeft: 2,
        },
        textTransform: "none",
        boxShadow: "none",
      },
      containedPrimary: {
        "&:hover": {
          boxShadow: "none",
        },
      },
      containedSecondary: {
        "&:hover": {
          boxShadow: "none",
        },
      },
      textSizeSmall: {
        fontSize: "0.875rem",
        paddingTop: 0,
        paddingBottom: 0,

        ":hover": {
          backgroundColor: "transparent",
          color: theme.palette.primary.dark,
        },
        "& svg": {
          width: 16,
          height: 16,
        },
      },
      startIcon: {
        "&$iconSizeSmall": {
          marginRight: 4,
        },
        "&$endIcon": {
          marginLeft: 4,
        },
      },
    },
  },
  MuiButtonBase: {
    defaultProps: {
      // The props to apply
      disableRipple: true, // No more ripple, on the whole application 💣!
    },
    styleOverrides: {
      root: {
        alignItems: "flex-start",
        justifyContent: "flex-start",
        "& .MuiListItemIcon-root.MuiListItemIcon-root": {
          minWidth: "24px",
        },
      },
    },
  },
  MuiInputBase: {
    styleOverrides: {
      adornedStart: {
        "> svg:first-of-type": {
          margin: "0 0.5rem",
        },
      },
    },
  },
  MuiInput: {
    defaultProps: {
      disableUnderline: true,
    },
    styleOverrides: {
      root: {
        backgroundColor: theme.palette.grey[100],
        border: "1px solid",
        borderColor: theme.palette.divider,
        borderRadius: (theme.shape.borderRadius as number) * 2,
        padding: "0 6px",
        minHeight: 48,
      },
      sizeSmall: {
        height: 40,
        minHeight: 40,
      },
      focused: {
        outline: "3px solid #333333",
      },
    },
  },
  MuiOutlinedInput: {
    styleOverrides: {
      root: {
        borderRadius: (theme.shape.borderRadius as number) * 1.5,
      },
    },
  },
  MuiAlertTitle: {
    styleOverrides: {
      root: {
        fontWeight: "bold",
      },
    },
  },
  MuiAlert: {
    styleOverrides: {
      root: {
        "& > .MuiAlert-message": {
          justifyContent: "center",
          display: "flex",
          flexDirection: "column",
          fontSize: `1rem`,
        },
      },
      standardSuccess: makeStandardAlertVariant({
        severity: "success",
      }),
      standardError: makeStandardAlertVariant({ severity: "error" }),
      standardWarning: makeStandardAlertVariant({ severity: "warning" }),
      standardInfo: makeStandardAlertVariant({ severity: "info" }),
    },
  },
  MuiCheckbox: {
    defaultProps: {
      checkedIcon: <Icon name="checkboxActive" size={20} />,
      indeterminateIcon: <Icon name="checkboxIndeterminate" size={20} />,
      icon: <Icon name="checkboxDefault" size={20} />,
    },
    styleOverrides: {
      root: {
        padding: 4,
        color: "primary.main",
      },
      disabled: {
        color: "grey.500",
        "&$checked": {
          color: "primary.disabled",
        },
      },
      checked: {},
    },
  },
  MuiCalendarPicker: {
    styleOverrides: {
      root: {
        maxHeight: "330px",
        "& > :nth-child(2) > div > :nth-child(2)": {
          minHeight: 230,
        },
      },
    },
  },
  MuiPickersDay: {
    styleOverrides: {
      root: {
        justifyContent: "center",
        alignItems: "center",
      },
      selected: {
        color: "white",
        "&.Mui-disabled": {
          color: "rgba(255, 255, 255, 0.5)",
        },
      },
    },
  },
  MuiTable: {
    styleOverrides: {
      root: {
        fontSize: "0.875rem",
      },
    },
  },
  MuiTableRow: {
    styleOverrides: {
      root: {
        verticalAlign: "baseline",
      },
    },
  },
  MuiNativeSelect: {
    styleOverrides: {
      root: {
        paddingTop: "0.25rem",
      },
      outlined: {
        paddingLeft: "0.5rem",
      },
    },
  },
  MuiSwitch: {
    styleOverrides: {
      root: {
        width: 28,
        height: 16,
        padding: 0,
        marginRight: "0.5rem",

        display: "flex",

        "& .MuiSwitch-switchBase": {
          padding: 2,
          "&.Mui-checked": {
            transform: "translateX(12px)",
            color: "#fff",
            "& + .MuiSwitch-track": {
              opacity: 1,
              backgroundColor: theme.palette.primary.main,
              border: 0,
            },
            ".MuiSwitch-thumb": {
              opacity: 1,
              backgroundColor: theme.palette.background.paper,
            },
          },
        },
        "& .MuiSwitch-thumb": {
          backgroundColor: theme.palette.grey[600],
          width: 12,
          height: 12,
          borderRadius: 6,
          transition: theme.transitions.create(["width"], {
            duration: 200,
          }),
        },
        "& .MuiSwitch-track": {
          borderRadius: 16 / 2,
          opacity: 1,
          backgroundColor: theme.palette.background.paper,
          border: `1px solid ${theme.palette.divider}`,
          boxSizing: "border-box",
        },
        "&:active": {
          "& .MuiSwitch-thumb": {
            width: 15,
          },
          "& .MuiSwitch-switchBase.Mui-checked": {
            transform: "translateX(9px)",
          },
        },
      },
    },
  },
  MuiTableCell: {
    styleOverrides: {
      root: {
        padding: `${theme.spacing(2)} ${theme.spacing(3)}`,
        minWidth: 128,
        borderBottomWidth: "1px",
        borderBottomStyle: "solid",
      },
      body: {
        color: "grey.800",
        fontWeight: "normal",
        borderBottomColor: theme.palette.grey[400],
      },
      head: {
        color: "grey.700",
        fontweight: "bold",
        borderBottomColor: theme.palette.grey[700],
      },
    },
  },
  MuiListSubheader: {
    styleOverrides: {
      root: {
        color: theme.palette.grey[900],
        fontWeight: "bold",
        borderBottom: "1px solid",
        borderBottomColor: theme.palette.grey[500],
      },
    },
  },
  MuiListItemIcon: {
    styleOverrides: {
      root: {
        "& svg": {
          width: 16,
          height: 16,
        },
      },
    },
  },
  MuiCircularProgress: {
    defaultProps: {
      size: 16,
    },
  },
  MuiPopover: {
    defaultProps: {
      TransitionComponent: isSafari15 ? Fade : Grow,
    },
    styleOverrides: {
      root: {
        "& .MuiPaper-root": {
          borderRadius: 8,
          boxShadow: "0px 10px 30px 0px rgba(0, 0, 0, 0.34)",
        },
      },
    },
  },
  MuiTabs: {
    styleOverrides: {
      root: {
        "& .MuiTabs-flexContainer": {
          gap: 4,
        },
        "& .MuiTabs-indicator": {
          display: "none",
        },
      },
    },
  },
  MuiTab: {
    styleOverrides: {
      root: {
        justifyContent: "center",
        alignItems: "center",
        height: 49,
        paddingTop: 0,
        paddingRight: 24,
        paddingBottom: 0,
        paddingLeft: 24,
        backgroundColor: theme.palette.grey[100],
        color: theme.palette.grey[900],
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        boxShadow: shadows[6],

        "&.Mui-selected": {
          height: 50,
          color: theme.palette.primary.main,
        },
      },
    },
  },
  MuiCssBaseline: {
    styleOverrides: `
        svg {
          display: block
        }
  
        *:focus {
          outline: 3px solid #333333;
        }

        [tabindex="-1"]:focus { outline: 0; }
    
        fieldset {
          border: 0;
          padding: 0.01em 0 0 0;
          margin: 0;
          minWidth: 0;
        }
  
        html {
          margin: 0;
          padding: 0;
          font-family: ${theme.typography.fontFamily};
          -webkit-overflow-scrolling: touch;
          -ms-overflow-style: -ms-autohiding-scrollbar;
        }
  
        @font-face {
          font-family: "FrutigerNeue";
          font-display: swap;
          font-style: normal;
          font-weight: 700;
          src: url("/static/fonts/FrutigerNeueW02-Bd.woff2") format("woff2");
        }
  
        @font-face {
          font-family: "FrutigerNeue";
          font-display: swap;
          font-style: normal;
          font-weight: 400;
          src: url("/static/fonts/FrutigerNeueW02-Regular.woff2") format("woff2");
        }
  
        @font-face {
          font-family: "FrutigerNeue";
          font-display: swap;
          font-style: normal;
          font-weight: 300;
          src: url("/static/fonts/FrutigerNeueW02-Light.woff2") format("woff2");
        }
        
        @font-face {
          font-family: "FrutigerNeue";
          font-display: swap;
          font-style: italic;
          font-weight: 400;
          src: url("/static/fonts/FrutigerNeueW02-It.woff2") format("woff2");
        }
        `,
  },
};

/**
 * Load these fonts early using <link rel="preload" />
 * Use WOFF2 fonts if possible!
 */
export const preloadFonts = [
  "/static/fonts/FrutigerNeueW02-Bd.woff2",
  "/static/fonts/FrutigerNeueW02-Regular.woff2",
  "/static/fonts/FrutigerNeueW02-Light.woff2",
  "/static/fonts/FrutigerNeueW02-It.woff2",
];
