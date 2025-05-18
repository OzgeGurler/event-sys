import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase/FirebaseConfig";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Box, Typography } from "@mui/material";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/home"); // giriş başarılı → home sayfasına gönder
        } catch (error) {
            console.error(error);
            alert("Giriş başarısız");
        }
    };

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={5}>
            <Typography variant="h4">Giriş Yap</Typography>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
            <TextField label="Şifre" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            <Button variant="contained" onClick={handleLogin}>Giriş Yap</Button>
        </Box>
    );
}
