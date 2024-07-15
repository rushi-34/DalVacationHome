import React, { useContext } from "react";
import { CircularProgress, ThemeProvider, Box } from "@mui/material";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { theme } from "./theme";
import SignIn from "./SignIn";
import Signup from "./Signup";
import ClientDashboard from "./pages/ClientDashboard";
import AgentDashboard from "./pages/AgentDashboard";
import { AuthenticationContext } from "./ContextProvider";
import SupportChat from "./pages/SupportChat";

const PrivateRoute = ({ children, isAuthenticated }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppRouter = ({ loggedInRole }) => {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        !loggedInRole ? <Navigate to="/login" /> : <Navigate to="/app" />
                    }
                />
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<Signup />} />
                <Route
                    path="/app"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            {loggedInRole === "client" ? (
                                <Navigate to="/app/client" />
                            ) : (
                                <Navigate to="/app/agent" />
                            )}
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/app/client"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            <ClientDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/app/agent"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            <AgentDashboard />
                        </PrivateRoute>
                    }
                />
                <Route
                    path="/app/support"
                    element={
                        <PrivateRoute isAuthenticated={loggedInRole}>
                            <SupportChat />
                        </PrivateRoute>
                    }
                />
            </Routes>
        </BrowserRouter>
    );
};

const App = () => {
    const { loading, userRole } = useContext(AuthenticationContext);

    if (loading) {
        return (
            <Box
                sx={{
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
            >
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <AppRouter loggedInRole={userRole} />
            <ToastContainer />
        </>
    );
};

export default App;
