// src/components/ApprovedRoute.tsx
import React, { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ApprovedRouteProps {
  children: JSX.Element;
}

const ApprovedRoute: React.FC<ApprovedRouteProps> = ({ children }) => {
  const { loading, approved, needsPasswordChange } = useAuth();

  if (loading) {
    return null; // Hala auth yükleniyor
  }

  if (!approved) {
    // Henüz onay yoksa
    return <Navigate to="/awaiting-approval" replace />;
  }

  if (needsPasswordChange) {
    // Onay var ama şifre değişmemişse
    return <Navigate to="/change-password" replace />;
  }

  // Tüm koşullar sağlandıysa child render et
  return children;
};

export default ApprovedRoute;
