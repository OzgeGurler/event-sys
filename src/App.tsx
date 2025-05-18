// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";

import MainLayout from "./layout/MainLayout";
import Login from "./pages/Login";
import RegisterPage from "./pages/RegisterPage";
import AwaitingApprovalPage from "./pages/AwaitingApprovalPage";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import Home from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import EventDetailPage from "./pages/EventDetailPage";
import OrderSummaryPage from "./pages/OrderSummaryPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import AdminPage from "./pages/AdminPage";

import AdminRoute from "./components/AdminRoute";
import ApprovedRoute from "./components/ApprovedRoute";

const App: React.FC = () => (
  <Router>
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/awaiting-approval" element={<AwaitingApprovalPage />} />
      <Route path="/change-password" element={<ChangePasswordPage />} />
      {/* Protected app under MainLayout */}
      <Route path="/" element={<MainLayout />}>
        {/* Only approved users may access these */}
        <Route element={<ApprovedRoute><Outlet /></ApprovedRoute>}>
          <Route index element={<Home />} />
          <Route path="home" element={<Home />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="order-summary" element={<OrderSummaryPage />} />
          <Route path="order-success" element={<OrderSuccessPage />} />
        </Route>

        {/* Admin panel (only for admin) */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>
    </Routes>
  </Router>
);

export default App;
