// src/pages/OrderSummaryPage.tsx
import React, { useState } from "react";
import {
  Box, Typography, Paper, List, ListItem, ListItemText,
  Divider, FormControl, FormLabel, RadioGroup,
  FormControlLabel, Radio, Button
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

const OrderSummaryPage: React.FC = () => {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("credit");

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>Sipariş Özeti</Typography>

      {cart.length === 0 ? (
        <Typography>Sepetiniz boş.</Typography>
      ) : (
        <Paper sx={{ p: 2, mb: 4 }}>
          <List>
            {cart.map(i => (
              <ListItem key={i.id}>
                <ListItemText
                  primary={i.title}
                  secondary={`${i.quantity} × ${i.price.toFixed(2)}₺ = ${(i.quantity * i.price).toFixed(2)}₺`}
                />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />
          <Typography variant="subtitle1">
            Toplam Ücret: {total.toFixed(2)}₺
          </Typography>
        </Paper>
      )}

      <FormControl component="fieldset" sx={{ mb: 4 }}>
        <FormLabel component="legend">Ödeme Yöntemi</FormLabel>
        <RadioGroup
          value={paymentMethod}
          onChange={e => setPaymentMethod(e.target.value)}
        >
          <FormControlLabel value="credit" control={<Radio />} label="Kredi Kartı" />
          <FormControlLabel value="bank" control={<Radio />} label="Banka Havalesi" />
          <FormControlLabel value="cash" control={<Radio />} label="Kapıda Ödeme" />
        </RadioGroup>
      </FormControl>

      <Button
        variant="contained"
        disabled={cart.length === 0}
        onClick={() => { clearCart(); navigate("/order-success"); }}
      >
        Ödeme Yap
      </Button>
    </Box>
  );
};

export default OrderSummaryPage;
