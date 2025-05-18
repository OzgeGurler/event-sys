// src/theme.ts
import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: { main: "#00695f" },
        secondary: { main: "#ff5722" },
        background: { default: "#fafafa" },
    },
    typography: {
        fontFamily: '"Segoe UI", sans-serif',
        h5: { fontWeight: 600 },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: "none",
                    borderRadius: 8,
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: "0 2px 8px rgba(211, 184, 184, 0.1)",
                },
            },
        },
    },
});

export default theme;
