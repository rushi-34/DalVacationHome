import React, { useState, useRef } from "react";
import useQuestionBank from "./hooks/useQuestionBank";
import { CircularProgress, Typography, Box, Container, Grid, Link as MuiLink } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButton";
import { getAwsCredentials, getCognitoUser } from "./CognitoHelper";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { blue } from "@mui/material/colors";

const loginSchema = yup.object({
    username: yup.string().required("Username is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
}).required();

const securityQuestionSchema = yup.object({
    answer: yup.string().required("Answer is required"),
}).required();

const caesarSchema = yup.object({
    answer: yup.string().required("Answer is required"),
}).required();

const SignIn = () => {
    const { questionBank, isLoading, error } = useQuestionBank();
    const [formState, setFormState] = useState(0);
    const [question, setQuestion] = useState(null);
    const [buttonLoading, setButtonLoading] = useState(false);
    const cognitoUserRef = useRef(null);

    const {
        handleSubmit: handleSubmitLogin,
        control: controlLogin,
        formState: { errors: loginErrors },
        reset: resetLogin,
    } = useForm({ resolver: yupResolver(loginSchema) });

    const {
        handleSubmit: handleSubmitSecurity,
        control: controlSecurity,
        formState: { errors: securityErrors },
        reset: resetSecurity,
    } = useForm({ resolver: yupResolver(securityQuestionSchema) });

    const {
        handleSubmit: handleSubmitCaesar,
        control: controlCaesar,
        formState: { errors: caesarErrors },
        reset: resetCaesar,
    } = useForm({ resolver: yupResolver(caesarSchema) });

    const handleLogin = async (data) => {
        setButtonLoading(true);
        const creds = getAwsCredentials(data.username, data.password);

        if (!cognitoUserRef.current) {
            cognitoUserRef.current = getCognitoUser(data.username);
        }

        const cognitoUser = cognitoUserRef.current;
        cognitoUser.setAuthenticationFlowType("CUSTOM_AUTH");
        cognitoUser.authenticateUser(creds, {
            onSuccess: () => {
                window.location.reload();
            },
            onFailure: (err) => {
                setButtonLoading(false);
                toast.error("Authentication failed: " + err);
            },
            customChallenge: (challengeParameters) => {
                if (challengeParameters.type === "SECURITY_QUESTION") {
                    setFormState(1);
                    setQuestion(challengeParameters.securityQuestion);
                } else if (challengeParameters.type === "CAESAR") {
                    setFormState(2);
                    setQuestion(challengeParameters.securityQuestion);
                }
                setButtonLoading(false);
            },
        });
    };

    const handleCustomChallenge = async (data) => {
        setButtonLoading(true);
        const cognitoUser = cognitoUserRef.current;

        cognitoUser.sendCustomChallengeAnswer(data.answer, {
            onSuccess: () => {
                const searchParams = new URLSearchParams(window.location.search);
                const redirect = searchParams.get("redirect");
                window.location.replace(redirect ? decodeURIComponent(redirect) : "/");
            },
            onFailure: () => {
                setButtonLoading(false);
                toast.error("Invalid Answer - Please Try Again!");
                resetLogin();
                resetSecurity();
                resetCaesar();
                setFormState(0);
            },
            customChallenge: (challengeParameters) => {
                if (challengeParameters.type === "SECURITY_QUESTION") {
                    setFormState(1);
                    setQuestion(challengeParameters.securityQuestion);
                } else if (challengeParameters.type === "CAESAR") {
                    setFormState(2);
                    setQuestion(challengeParameters.securityQuestion);
                }
                setButtonLoading(false);
            },
        });
    };

    if (isLoading) {
        return (
            <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Typography>Error: {error}</Typography>;
    }

    return (
        <Container maxWidth="lg" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
            <Grid container spacing={4} alignItems="center">
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src="/assets/dv4.jpeg"
                        alt="bg"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '80vh',
                            objectFit: 'cover',
                            borderRadius: 2,
                        }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ maxWidth: 400, margin: 'auto' }}>
                        <Typography variant="h4" align="center" gutterBottom>
                            Login
                        </Typography>
                        {formState === 0 && (
                            <form onSubmit={handleSubmitLogin(handleLogin)}>
                                <Box mb={3}>
                                    <Controller
                                        name="username"
                                        control={controlLogin}
                                        render={({ field }) => (
                                            <CustomInput
                                                label="Username"
                                                error={loginErrors.username}
                                                helperText={loginErrors.username?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box mb={3}>
                                    <Controller
                                        name="password"
                                        control={controlLogin}
                                        render={({ field }) => (
                                            <CustomInput
                                                label="Password"
                                                type="password"
                                                error={loginErrors.password}
                                                helperText={loginErrors.password?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box mb={3}>
                                    <CustomButton fullWidth variant="contained" size="large" type="submit">
                                        {buttonLoading ? <CircularProgress color="secondary" size={20} /> : "Login"}
                                    </CustomButton>
                                </Box>
                            </form>
                        )}
                        {formState === 1 && (
                            <form onSubmit={handleSubmitSecurity(handleCustomChallenge)}>
                                <Box mb={3}>
                                    <Typography variant="body1" gutterBottom>
                                        {questionBank.find((q) => q.q_id === question)?.question}
                                    </Typography>
                                    <Controller
                                        name="answer"
                                        control={controlSecurity}
                                        render={({ field }) => (
                                            <CustomInput
                                                label="Answer"
                                                error={securityErrors.answer}
                                                helperText={securityErrors.answer?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box mb={3}>
                                    <CustomButton fullWidth variant="contained" size="large" type="submit">
                                        {buttonLoading ? <CircularProgress color="secondary" size={20} /> : "Submit"}
                                    </CustomButton>
                                </Box>
                            </form>
                        )}
                        {formState === 2 && (
                            <form onSubmit={handleSubmitCaesar(handleCustomChallenge)}>
                                <Box mb={3}>
                                    <Typography variant="body1" gutterBottom>
                                        Decipher the following CAESAR cipher using the key you set during registration: {question}
                                    </Typography>
                                    <Controller
                                        name="answer"
                                        control={controlCaesar}
                                        render={({ field }) => (
                                            <CustomInput
                                                label="Answer"
                                                error={caesarErrors.answer}
                                                helperText={caesarErrors.answer?.message}
                                                {...field}
                                            />
                                        )}
                                    />
                                </Box>
                                <Box mb={3}>
                                    <CustomButton fullWidth variant="contained" size="large" type="submit">
                                        {buttonLoading ? <CircularProgress color="secondary" size={20} /> : "Submit"}
                                    </CustomButton>
                                </Box>
                            </form>
                        )}
                        <Typography variant="body2" align="center">
                            Don't have an account?{' '}
                            <MuiLink component={Link} to="/register" underline="hover" color={blue}>
                                Register Here!
                            </MuiLink>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SignIn;
