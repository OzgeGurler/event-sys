// src/pages/OrderSuccessPage.tsx
import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const OrderSuccessPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            p={4}
            height="80vh"
            textAlign="center"
        >
            <Typography variant="h4" gutterBottom>
                🎉 Siparişiniz Alındı!
            </Typography>
            <Typography variant="body1" sx={{ mb: 4 }}>
                Siparişiniz başarıyla tamamlandı. İlginiz için teşekkür ederiz.
            </Typography>
            <Button variant="contained" onClick={() => navigate("/home")}>
                Ana Sayfaya Dön
            </Button>
        </Box>
    );
};

export default OrderSuccessPage;
