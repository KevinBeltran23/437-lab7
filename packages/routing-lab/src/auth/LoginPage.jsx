import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { UsernamePasswordForm } from './UsernamePasswordForm';
import { sendPostRequest } from '../sendPostRequest';

export function LoginPage({ setAuthToken }) {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);
    
    const handleLogin = async ({ username, password }) => {
        try {            
            setFeedback({ type: "loading", message: "Logging in..." });
            
            const response = await sendPostRequest('/labsApi/auth/login', { username, password });
            const result = await response.json();
            const authToken = result.token;
           
            console.log("Authentication Token:", authToken);
            setAuthToken(authToken);
           
            setTimeout(() => {
                setFeedback({ type: "success", message: "Login successful! Redirecting..." });
                navigate('/');
            }, 500); // Redirect after showing success message
           
            return { type: "success", message: "Login successful!" };
        } catch (error) {
            console.error("Login error:", error);
            let errorMessage = "An error occurred during login";
           
            if (error.message.includes('401')) {
                errorMessage = "Incorrect username or password.";
            } else if (error.message) {
                try {
                    // Try to parse error message as JSON if possible
                    const errorData = JSON.parse(error.message);
                    errorMessage = errorData.message || errorData.error || errorMessage;
                } catch {
                    // If not JSON, use the raw message
                    errorMessage = error.message;
                }
            }
           
            setFeedback({ type: "error", message: errorMessage });
            return { type: "error", message: errorMessage };
        }
    };

    return (
        <div>
            <h1>Login</h1>
           
            {feedback && (
                <div className={`feedback-message ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}
           
            <UsernamePasswordForm onSubmit={handleLogin} />
            <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
    );
}