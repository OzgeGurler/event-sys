// src/layout/MainLayout.tsx
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CartModal from "../components/CartModal";
import { Outlet } from "react-router-dom";
import { useFilter } from "../context/FilterContext";

const MainLayout: React.FC = () => {
  const [openCart, setOpenCart] = useState(false);
  const { selectedCategory, setSelectedCategory } = useFilter();

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Etkinlik Platformu
          </Typography>

          {/* İlgi Alanı Filtresi */}
          <FormControl variant="standard" sx={{ mr: 2, minWidth: 120, color: "inherit" }}>
            <InputLabel sx={{ color: "inherit" }}>Kategori</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Kategori"
              sx={{
                color: "inherit",
                ".MuiSvgIcon-root": { color: "inherit" },
              }}
            >
              <MenuItem value="">Tümü</MenuItem>
              <MenuItem value="Konser">Konser</MenuItem>
              <MenuItem value="Spor">Spor</MenuItem>
              <MenuItem value="Konferans">Konferans</MenuItem>
              <MenuItem value="Tiyatro">Tiyatro</MenuItem>
            </Select>
          </FormControl>

          <IconButton color="inherit" onClick={() => setOpenCart(true)}>
            <ShoppingCartIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <CartModal open={openCart} onClose={() => setOpenCart(false)} />

      <Outlet />
    </>
  );
};

export default MainLayout;
