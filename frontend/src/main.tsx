import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {App} from "./app/app.tsx";
import {createTheme, CssBaseline, ThemeProvider} from "@mui/material";
import {red} from "@mui/material/colors";
import {BrowserRouter} from "react-router-dom";

const theme = createTheme({
    cssVariables: true,
    palette: {
        primary: {
            main: '#ECA413',
        },
        secondary: {
            main: '#000000',
        },
        error: {
            main: red.A400,
        },
    },
});

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <CssBaseline/>

                <App/>
            </ThemeProvider>
        </BrowserRouter>
    </StrictMode>,
)