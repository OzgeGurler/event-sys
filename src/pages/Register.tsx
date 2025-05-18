import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Register() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            navigate("/home"); // kayıt başarılı → home sayfasına gönder
        } catch (error) {
            console.error(error);
            alert("Kayıt başarısız");
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={5}>
            <Typography variant="h4">Kayıt Ol</Typography>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" onClick={handleRegister}>Kayıt Ol</Button>
        </Box>
    );
}
