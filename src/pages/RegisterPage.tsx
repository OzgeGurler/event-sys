// src/pages/RegisterPage.tsx
import React, { useState } from "react";
import {
    Box,
    Typography,
    TextField,
    Button,
    Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase/FirebaseConfig";
import { createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        try {
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            // Firestore'da users koleksiyonuna doküman oluştur
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                approved: false,
                passwordChanged: false,
            });
            setSuccess("Kayıt başarılı! Admin onayını bekleyin.");
            // Oturumu kapat ve login sayfasına yönlendir
            await signOut(auth);
            navigate("/login");
        } catch (err: any) {
            setError(err.message);
        }
    };

    return (
        <Box maxWidth={400} mx="auto" p={2}>
            <Typography variant="h4" mb={2}>
                Kayıt Ol
            </Typography>
            {error && <Alert severity="error">{error}</Alert>}
            {success && <Alert severity="success">{success}</Alert>}
            <form onSubmit={handleSubmit}>
                <TextField
                    label="Email"
                    type="email"
                    fullWidth
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <TextField
                    label="Şifre"
                    type="password"
                    fullWidth
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 2 }}
                />
                <Button type="submit" variant="contained" fullWidth>
                    Kayıt Ol
                </Button>
            </form>
        </Box>
    );
};

export default RegisterPage;
