import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router';
import { UsernamePasswordForm } from "./UsernamePasswordForm";
import { sendPostRequest } from '../sendPostRequest';

export function RegisterPage({ setAuthToken }) {
    const navigate = useNavigate();
    const [feedback, setFeedback] = useState(null);
    
    const handleRegister = async ({ username, password }) => {
        try {
            setFeedback({ type: "loading", message: "Creating your account..." });
            
            const response = await sendPostRequest('/auth/register', { username, password });
            
            // For registration, you need to make a second request to login
            // after successful registration since your API doesn't return a token on register
            try {
                const loginResponse = await sendPostRequest('/auth/login', { username, password });
                const result = await loginResponse.json();
                const authToken = result.token;
                
                console.log("Authentication Token:", authToken);
                setAuthToken(authToken);
                
                setFeedback({ type: "success", message: "Registration successful! Redirecting to home..." });
                setTimeout(() => navigate('/'), 1500);
                
                return { type: "success", message: "Registration successful!" };
            } catch (loginError) {
                // Registration worked but login failed
                setFeedback({ 
                    type: "success", 
                    message: "Account created! Please proceed to login." 
                });
                setTimeout(() => navigate('/login'), 1500);
                return { type: "success", message: "Registration successful! Please login." };
            }
        } catch (error) {
            console.error("Registration error:", error);
            let errorMessage = "An error occurred during registration";
            
            if (error.message.includes('400')) {
                errorMessage = "Username already exists.";
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
            <h1>Register a new account</h1>
            
            {feedback && (
                <div className={`feedback-message ${feedback.type}`}>
                    {feedback.message}
                </div>
            )}
            
            <UsernamePasswordForm onSubmit={handleRegister} />
            <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
    );
}