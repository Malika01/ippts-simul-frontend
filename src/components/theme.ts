import { createTheme } from "@mui/material";

const theme = createTheme({
    palette: {
        primary: {
            main: '#03dac5',
        },
        secondary: {
            main: '#bb86fc',
        },
        success: {
            main: '#90ee02',
        },
        error: {
            main: '#ff593a',
        },
        warning: {
            main: '#efe73e',
        },
        mode: 'dark',
    },
    typography: {
        "fontFamily": `'Courier New', Courier, monospace`,
        "fontSize": Number(`calc(12px + 1vmin)`)
    }
});

export default theme;