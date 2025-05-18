// src/pages/AwaitingApprovalPage.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { auth } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";

const AwaitingApprovalPage: React.FC = () => {
    const navigate = useNavigate();
    const handleLogout = async () => {
        await auth.signOut();
        navigate("/login");
    };

    return (
        <Box textAlign="center" p={4}>
            <Typography variant="h5" gutterBottom>
                Hesabınız Onay Bekliyor
            </Typography>
            <Typography variant="body1" mb={4}>
                Admin onayladıktan sonra giriş yapabilirsiniz.
            </Typography>
            <Button variant="contained" onClick={handleLogout}>
                Çıkış Yap
            </Button>
        </Box>
    );
};

export default AwaitingApprovalPage;
