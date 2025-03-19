import { useState, useEffect } from "react";
import { Homepage } from "./Homepage";
import { AccountSettings } from "./AccountSettings";
import { ImageGallery } from "./images/ImageGallery.jsx";
import { ImageDetails } from "./images/ImageDetails.jsx";
import { MainLayout } from "./MainLayout";
import { Routes, Route } from "react-router";
import { useImageFetching } from "./images/useImageFetching";
import { RegisterPage } from "./auth/RegisterPage.jsx";
import { LoginPage } from "./auth/LoginPage.jsx";
import { ProtectedRoute } from './ProtectedRoute';

function App() {
    const [userName, setUserName] = useState("John Doe");
    const [authToken, setAuthToken] = useState(() => localStorage.getItem("authToken"));
    const { isLoading, fetchedImages, error } = useImageFetching('', authToken);

    useEffect(() => {
        localStorage.setItem("authToken", authToken);
    }, [authToken]);

    const handleLogout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
    };

    return (
        <Routes>
            <Route path="/" element={<MainLayout handleLogout={handleLogout} />}>
                <Route index element={
                    <ProtectedRoute authToken={authToken}>
                        <Homepage userName={userName} />
                    </ProtectedRoute>
                } />
                <Route path="/account" element={
                    <ProtectedRoute authToken={authToken}>
                        <AccountSettings userName={userName} setUserName={setUserName} />
                    </ProtectedRoute>
                } />
                <Route path="/images" element={
                    <ProtectedRoute authToken={authToken}>
                        <ImageGallery
                            isLoading={isLoading}
                            fetchedImages={fetchedImages}
                            error={error}
                        />
                    </ProtectedRoute>
                } />
                <Route path="/image/:id" element={
                    <ProtectedRoute authToken={authToken}>
                        <ImageDetails authToken={authToken} />
                    </ProtectedRoute>
                } />
                <Route path="/register" element={<RegisterPage setAuthToken={setAuthToken} />} />
                <Route path="/login" element={<LoginPage setAuthToken={setAuthToken} />} />
            </Route>
        </Routes>
    );
}

export default App;