// src/pages/EventDetailPage.tsx
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Alert,
    CircularProgress,
} from "@mui/material";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useCart, CartItem } from "../context/CartContext";
import { getWeatherByCity, WeatherData } from "../services/weatherService";

interface EventData {
    id: string;
    title: string;
    date: string;
    category: string;
    city: string;
    availableTickets: number;
    price: number;
}

const EventDetailPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [event, setEvent] = useState<EventData | null>(null);
    const [loading, setLoading] = useState(true);
    const [stock, setStock] = useState(0);
    const [error, setError] = useState("");
    const [weather, setWeather] = useState<WeatherData | null>(null);
    const [loadingWeather, setLoadingWeather] = useState(false);
    const { addToCart } = useCart();

    // Firestore’dan etkinlik verisini al
    useEffect(() => {
        if (!id) return;
        const ref = doc(db, "events", id);
        getDoc(ref)
            .then((snap) => {
                if (snap.exists()) {
                    const data = snap.data() as Omit<EventData, "id">;
                    setEvent({ id: snap.id, ...data });
                    setStock(data.availableTickets);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    // Hava durumu API çağrısı
    useEffect(() => {
        if (!event) return;
        setLoadingWeather(true);
        getWeatherByCity(event.city)
            .then((w) => setWeather(w))
            .catch(() => { })
            .finally(() => setLoadingWeather(false));
    }, [event]);

    if (loading) {
        return (
            <Box textAlign="center" mt={4}>
                <CircularProgress />
            </Box>
        );
    }
    if (!event) {
        return <Typography>Etkinlik bulunamadı.</Typography>;
    }

    const isRainy = weather?.weather[0].main.toLowerCase().includes("rain");

    const handleBuy = async () => {
        if (stock < 1) {
            setError("Maalesef bu etkinlikte bilet kalmadı.");
            return;
        }

        // Sepete ekle
        const item: CartItem = { id: event.id, title: event.title, quantity: 1, price: event.price };
        addToCart(item);

        // Firestore'da stok güncelle
        const ref = doc(db, "events", event.id);
        await updateDoc(ref, { availableTickets: stock - 1 });

        // Local state'te stoktan düş
        setStock((prev) => prev - 1);
    };

    return (
        <Box p={4}>
            <Typography variant="h4" gutterBottom>
                {event.title}
            </Typography>
            <Typography>Tarih: {event.date}</Typography>
            <Typography>Tür: {event.category}</Typography>
            <Typography>Şehir: {event.city}</Typography>
            <Typography>Kalan Bilet: {stock}</Typography>
            <Typography sx={{ mb: 2 }}>Fiyat: {event.price}</Typography>

            {loadingWeather ? (
                <CircularProgress size={24} />
            ) : weather ? (
                <Alert
                    severity={isRainy ? "warning" : "info"}
                    sx={{ mb: 2 }}
                >
                    Hava: {weather.weather[0].description}, {weather.main.temp}°C
                </Alert>
            ) : null}

            {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                    {error}
                </Alert>
            )}

            <Button
                variant="contained"
                disabled={stock < 1 || isRainy}
                onClick={handleBuy}
            >
                Bilet Al
            </Button>
        </Box>
    );
};

export default EventDetailPage;
