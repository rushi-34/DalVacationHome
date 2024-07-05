import React from "react";
import ReactDOM from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@mui/material";
import App from "./App";
import AuthenticationContextProvider from "./ContextProvider";
import { theme } from "./theme";
import "./index.css";

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <ThemeProvider theme={theme}>
            <QueryClientProvider client={queryClient}>
                <AuthenticationContextProvider>
                    <App />
                </AuthenticationContextProvider>
            </QueryClientProvider>
        </ThemeProvider>
    </React.StrictMode>
);