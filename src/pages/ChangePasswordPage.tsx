// src/pages/ChangePasswordPage.tsx
import React, { useState } from "react";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";
import { auth, db } from "../firebase/FirebaseConfig";
import { updatePassword } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ChangePasswordPage: React.FC = () => {
    const [newPass, setNewPass] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();
    const { markPasswordChanged } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Kullanıcı bulunamadı");
            // 1) Firebase Auth şifre güncelle
            await updatePassword(user, newPass);
            // 2) Firestore’daki flag’i güncelle
            await updateDoc(doc(db, "users", user.uid), {
                passwordChanged: true,
            });
            // 3) Context’i güncelle
            markPasswordChanged();
            // 4) Ana sayfaya yönlendir
            navigate("/", { replace: true });
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box maxWidth={400} mx="auto" p={4}>
            <Typography variant="h4" mb={2}>
                Şifre Değiştir
            </Typography>
            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Yeni Şifre"
                    type="password"
                    fullWidth
                    required
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>
                    Şifreyi Güncelle
                </Button>
            </form>
        </Box>
    );
};

export default ChangePasswordPage;
