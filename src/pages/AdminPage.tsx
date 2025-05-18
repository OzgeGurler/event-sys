// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Grid,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import {
  fetchEvents,
  addEvent,
  updateEvent,
  deleteEvent,
} from "../services/eventService";
import { Event } from "../types/Event";

import {
  collection,
  getDocs,
  query,
  where,
  doc as firestoreDoc,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/FirebaseConfig";
import { Announcement } from "../types/Announcement";
import { addAnnouncement, deleteAnnouncement, fetchAnnouncements } from "../services/announcementService";

type UserRecord = { uid: string; email: string; approved: boolean };

const AdminPage: React.FC = () => {
  // Kullanıcı onayı için bekleyenler
  const [pendingUsers, setPendingUsers] = useState<UserRecord[]>([]);
  // Etkinlik CRUD state
  const [events, setEvents] = useState<Event[]>([]);
  const [form, setForm] = useState<Omit<Event, "id">>({
    title: "",
    date: "",
    category: "",
    city: "",
    availableTickets: 0,
    price: 0,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  // Bekleyen kullanıcıları yükle
  const loadPendingUsers = async () => {
    const q = query(collection(db, "users"), where("approved", "==", false));
    const snap = await getDocs(q);
    setPendingUsers(
      snap.docs.map((d) => ({ uid: d.id, ...(d.data() as any) }))
    );
  };

  // Bir kullanıcıyı onayla
  const handleApprove = async (uid: string) => {
    await updateDoc(firestoreDoc(db, "users", uid), { approved: true });
    setPendingUsers((u) => u.filter((x) => x.uid !== uid));
  };

  // Etkinlikleri yükle
  const loadEvents = async () => {
    const evs = await fetchEvents();
    setEvents(evs);
  };

  useEffect(() => {
    loadPendingUsers();
    loadEvents();
  }, []);

  // Etkinlik ekle/güncelle
  const handleSubmit = async () => {
    if (editingId) {
      await updateEvent({ id: editingId, ...form });
      setEditingId(null);
    } else {
      await addEvent(form);
    }
    setForm({ title: "", date: "", category: "", city: "", availableTickets: 0, price: 0 });
    loadEvents();
  };

  // Düzenlemeye başla
  const handleEdit = (e: Event) => {
    setEditingId(e.id);
    setForm({
      title: e.title,
      date: e.date,
      category: e.category,
      city: e.city,
      availableTickets: e.availableTickets,
      price: e.price,
    });
  };

  // Etkinlik sil
  const handleDelete = async (id: string) => {
    await deleteEvent(id);
    loadEvents();
  };
  // Duyurular için state
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const loadAnnouncements = async () => {
    const data = await fetchAnnouncements();
    setAnnouncements(data);
  };

  // ekleme
  const handleAddAnnouncement = async () => {
    if (!newMessage.trim()) return;
    await addAnnouncement(newMessage.trim());
    setNewMessage("");
    loadAnnouncements();
  };

  // silme
  const handleDeleteAnnouncement = async (id: string) => {
    await deleteAnnouncement(id);
    loadAnnouncements();
  };

  useEffect(() => {
    // … loadPendingUsers(), loadEvents() …
    loadAnnouncements();
  }, []);

  return (
    <Box p={4}>
      <Typography variant="h4" mb={2}>
        Admin Paneli
      </Typography>

      {/* Kullanıcı Onayı Bölümü */}
      <Typography variant="h5" mb={1}>
        Kullanıcı Onayı
      </Typography>
      <List>
        {pendingUsers.map((u) => (
          <ListItem
            key={u.uid}
            secondaryAction={
              <Button variant="contained" onClick={() => handleApprove(u.uid)}>
                Onayla
              </Button>
            }
          >
            <ListItemText primary={u.email} />
          </ListItem>
        ))}
      </List>

      {/* Etkinlik CRUD Bölümü */}
      <Typography variant="h5" mt={4} mb={2}>
        Etkinlik Yönetimi
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Başlık"
              fullWidth
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 6 }}>
            <TextField
              label="Tarih"
              type="date"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={form.date}
              onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <TextField
              label="Kategori"
              fullWidth
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
            />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <TextField
              label="Şehir"
              fullWidth
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
            />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <TextField
              label="Bilet Sayısı"
              type="number"
              fullWidth
              value={form.availableTickets}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  availableTickets: Number(e.target.value),
                }))
              }
            />
          </Grid>
          <Grid size={{ xs: 4 }}>
            <TextField
              label="Bilet Fiyatı (TL)"
              type="number"
              fullWidth
              value={form.price}
              onChange={(e) =>
                setForm((f) => ({ ...f, price: Number(e.target.value) }))
              }
            />
          </Grid>
          <Grid size={{ xs: 12 }} >
            <Button variant="contained" onClick={handleSubmit} fullWidth>
              {editingId ? "Güncelle" : "Ekle"}
            </Button>
          </Grid>
        </Grid>
      </Paper>

      <Typography variant="h5" mb={2}>
        Mevcut Etkinlikler
      </Typography>
      {events.map((e) => (
        <Paper
          key={e.id}
          sx={{
            p: 2,
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography>
            {e.title} — {e.date} — {e.category} — {e.city} — {e.availableTickets} bilet — {e.price.toFixed(2)}₺
          </Typography>
          <Box>
            <IconButton onClick={() => handleEdit(e)}>
              <EditIcon />
            </IconButton>
            <IconButton onClick={() => handleDelete(e.id)}>
              <DeleteIcon />
            </IconButton>
          </Box>
        </Paper>
      ))}
      {/* ↓ Yeni: Duyurular Bölümü */}
      <Typography variant="h5" mt={4} mb={2}>
        Duyurular
      </Typography>
      <Paper sx={{ p: 2, mb: 4 }}>
        <Box display="flex" gap={2}>
          <TextField
            label="Yeni Duyuru Mesajı"
            fullWidth
            value={newMessage}
            onChange={e => setNewMessage(e.target.value)}
          />
          <Button variant="contained" onClick={handleAddAnnouncement}>
            Ekle
          </Button>
        </Box>
        <List>
          {announcements.map(a => (
            <ListItem
              key={a.id}
              secondaryAction={
                <IconButton onClick={() => handleDeleteAnnouncement(a.id)}>
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemText
                primary={a.message}
                secondary={new Date(a.createdAt).toLocaleString()}
              />
            </ListItem>
          ))}
        </List>
      </Paper>
    </Box>
  );
};
export default AdminPage;
