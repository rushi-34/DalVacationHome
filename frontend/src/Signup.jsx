import React from "react";
import CustomInput from "./components/CustomInput";
import CustomButton from "./components/CustomButton";
import {
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Typography,
    Box,
    Container,
    Grid,
    Link as MuiLink,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link } from "react-router-dom";
import { getUserPool } from "./CognitoHelper";
import useQuestionBank from "./hooks/useQuestionBank";
import { toast } from "react-toastify";
import { blue } from "@mui/material/colors";

const validationSchema = yup.object({
    username: yup.string().required("Username is required"),
    email: yup.string().email().required("Email is required"),
    password: yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
    c_password: yup.string().oneOf([yup.ref("password"), null], "Passwords must match").required("Confirm Password is required"),
    security_question: yup.string().required("Security Question is required"),
    security_answer: yup.string().required("Security Answer is required"),
    caesar_key: yup.number().min(1, "Caesar key must be greater than 1").max(25, "Caesar key must be less than 25").required("Caesar Key is required"),
    role: yup.string().required("Role is required"),
}).required();

const Signup = () => {
    const { questionBank, isLoading } = useQuestionBank();
    const { handleSubmit, control, formState: { errors } } = useForm({
        resolver: yupResolver(validationSchema),
    });
    const sendEmailNotification = async (email) => {
        const notificationEndpoint = 'https://thbtqi9ka6.execute-api.us-east-1.amazonaws.com/send-email';
        const payload = {
            email: email,
            subject: 'Dal Vacation Home',
            body: 'You have been successfully registered!'
        };
    
        try {
            const response = await fetch(notificationEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
    
            if (!response.ok) {
                throw new Error('Failed to send email notification');
            }
    
            console.log('Email notification sent successfully');
        } catch (error) {
            console.error('Error sending email notification:', error);
        }
    };
    
    const onSubmit = (data) => {
        const userPool = getUserPool();
        userPool.signUp(
            data.username,
            data.password,
            [
                { Name: "email", Value: data.email },
                { Name: "custom:role", Value: data.role },
            ],
            [
                { Name: "caesar_key", Value: data.caesar_key.toString() },
                { Name: "security_questions", Value: JSON.stringify({ q_id: data.security_question, answer: data.security_answer }) },
            ],
            async (err, result) => {
                if (err) {
                    console.log(err);
                    return;
                }
                toast.success("User created successfully");
                
                await sendEmailNotification(data.email);
    
                setTimeout(() => {
                    window.location.href = "/login";
                }, 1000);
            }
        );
    };
    

    if (isLoading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg">
            <Grid container spacing={4} sx={{ height: '100vh', alignItems: 'center' }}>
                <Grid item xs={12} md={6}>
                    <Box
                        component="img"
                        src="/assets/dalvac.jpeg"
                        alt="bg"
                        sx={{ width: '100%', height: '100%', objectFit: 'contain', bgcolor: 'black', borderRadius: 4 }}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Box sx={{ position: 'relative', p: 3 }}>
                        <Typography variant="h4" align="center" gutterBottom color="red">
                            Create an account
                        </Typography>
                        <form onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ my: 2 }}>
                                <Controller
                                    name="role"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.role}>
                                            <InputLabel>Role</InputLabel>
                                            <Select label="Role" {...field}>
                                                <MenuItem value="client">Property Buyer</MenuItem>
                                                <MenuItem value="agent">Property Agent</MenuItem>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Controller
                                    name="username"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Username"
                                            error={!!errors.username}
                                            helperText={errors.username?.message}
                                            fullWidth
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Controller
                                    name="email"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Email"
                                            error={!!errors.email}
                                            helperText={errors.email?.message}
                                            fullWidth
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Controller
                                    name="password"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Password"
                                            type="password"
                                            error={!!errors.password}
                                            helperText={errors.password?.message}
                                            fullWidth
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Controller
                                    name="c_password"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Confirm Password"
                                            type="password"
                                            error={!!errors.c_password}
                                            helperText={errors.c_password?.message}
                                            fullWidth
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Controller
                                    name="security_question"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl fullWidth error={!!errors.security_question}>
                                            <InputLabel>Security Question</InputLabel>
                                            <Select label="Security Question" {...field}>
                                                {questionBank.map((question) => (
                                                    <MenuItem key={question.q_id} value={question.q_id}>
                                                        {question.question}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Controller
                                    name="security_answer"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Security Answer"
                                            type="password"
                                            error={!!errors.security_answer}
                                            helperText={errors.security_answer?.message}
                                            fullWidth
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                            <Box sx={{ my: 2 }}>
                                <Controller
                                    name="caesar_key"
                                    control={control}
                                    render={({ field }) => (
                                        <CustomInput
                                            label="Caesar Key"
                                            type="number"
                                            error={!!errors.caesar_key}
                                            helperText={errors.caesar_key?.message}
                                            fullWidth
                                            {...field}
                                        />
                                    )}
                                />
                            </Box>
                    
                            <Box sx={{ my: 3 }}>
                                <CustomButton fullWidth variant="contained" size="large" type="submit">
                                    Sign Up
                                </CustomButton>
                            </Box>
                        </form>
                        <Typography variant="body2" align="center">
                            Already have an account?{' '}
                            <MuiLink component={Link} to="/login" underline="hover" color={blue}>
                                Login here!
                            </MuiLink>
                        </Typography>
                    </Box>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Signup;
