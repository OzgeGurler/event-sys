// src/components/EventComponent.tsx
import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  SxProps,
  Theme,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { useCart } from "../context/CartContext";
import { Event } from "../types/Event";

interface Props {
  event: Event;
  /** Kartın genişliği (px) */
  width?: number;
  /** Ekstra sx prop’u */
  sx?: SxProps<Theme>;
}

const EventComponent: React.FC<Props> = ({ event, width = 350, sx }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();

  // Local stok state’i
  const [stock, setStock] = useState(event.availableTickets);

  const handleBuy = async () => {
    if (stock < 1) return;

    // Sepete ekle
    addToCart({ id: event.id, title: event.title, quantity: 1, price: event.price });

    // Firestore’da stok azalt
    const eventRef = doc(db, "events", event.id);
    await updateDoc(eventRef, { availableTickets: stock - 1 });

    // UI’da da anlık göster
    setStock((prev) => prev - 1);
  };

  return (
    <Card
      sx={{
        width,
        mx: 1,
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        ...sx,
      }}
    >
      <CardContent onClick={() => navigate(`/events/${event.id}`)}>
        <Typography variant="h6">{event.title}</Typography>
        <Typography variant="body2">Tarih: {event.date}</Typography>
        <Typography variant="body2">Tür: {event.category}</Typography>
        <Typography variant="body2">Şehir: {event.city}</Typography>
        <Typography variant="body2">Kalan Bilet: {stock}</Typography>
        <Typography variant="body2">Fiyat: {event.price.toFixed(2)}₺</Typography>
      </CardContent>
      <Button
        variant="contained"
        fullWidth
        onClick={handleBuy}
        disabled={stock < 1}
        sx={{ mt: 1 }}
      >
        Bilet Al
      </Button>
    </Card>
  );
};

export default EventComponent;
