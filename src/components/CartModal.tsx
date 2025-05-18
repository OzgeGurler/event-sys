// src/components/CartModal.tsx
import React from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, List, ListItem, ListItemText, Box
} from "@mui/material";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";

interface CartModalProps { open: boolean; onClose: () => void; }

const CartModal: React.FC<CartModalProps> = ({ open, onClose }) => {
  const { cart } = useCart();
  const navigate = useNavigate();

  const total = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Sepetiniz</DialogTitle>
      <DialogContent>
        {cart.length === 0 ? (
          <Typography>Sepetiniz boş.</Typography>
        ) : (
          <>
            <List>
              {cart.map(i => (
                <ListItem key={i.id}>
                  <ListItemText
                    primary={i.title}
                    secondary={
                      <Box>
                        {i.quantity} × {i.price.toFixed(2)}₺ ={" "}
                        {(i.quantity * i.price).toFixed(2)}₺
                      </Box>
                    }
                  />
                </ListItem>
              ))}
            </List>
            <Box mt={2} textAlign="right">
              <Typography variant="h6">
                Toplam Ücret: {total.toFixed(2)}₺
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={cart.length === 0}
          onClick={() => { onClose(); navigate("/order-summary"); }}
        >
          Sepete Git
        </Button>
        <Button onClick={onClose}>Kapat</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CartModal;
