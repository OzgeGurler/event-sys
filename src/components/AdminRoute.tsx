// src/components/AdminRoute.tsx
import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface AdminRouteProps {
    children: JSX.Element;
}

const AdminRoute: React.FC<AdminRouteProps> = ({ children }) => {
    const { loading, user, isAdmin } = useAuth();

    if (loading) {
        // Yetki durumu netleşene kadar hiçbir şey göstermiyoruz
        return null;
    }

    if (!user) {
        // Giriş yapılmamışsa login sayfasına
        return <Navigate to="/login" replace />;
    }

    if (!isAdmin) {
        // Giriş yapmış ama admin değilse home sayfasına
        return <Navigate to="/home" replace />;
    }

    // Admin ise altındaki component’i render et
    return children;
};

export default AdminRoute;
