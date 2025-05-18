// src/pages/EventsPage.tsx
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Grid,
} from "@mui/material";

import AnnouncementComponent from "../components/AnnouncementComponent";
import EventComponent from "../components/EventComponent";

import { fetchAnnouncements } from "../services/announcementService";
import { fetchEvents } from "../services/eventService";

import { Announcement } from "../types/Announcement";
import { Event } from "../types/Event";

import { useFilter } from "../context/FilterContext";

const EventsPage: React.FC = () => {
  const [anns, setAnns] = useState<Announcement[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const { selectedCategory } = useFilter();

  useEffect(() => {
    Promise.all([fetchAnnouncements(), fetchEvents()])
      .then(([a, evs]) => {
        setAnns(a);
        setEvents(evs);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" mt={10}>
        <CircularProgress />
      </Box>
    );
  }

  // 1) Tarihe göre sıralama
  const sortedEvents = [...events].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });

  // 2) Kategori filtrelemesi (boşsa tüm liste)
  const filtered = selectedCategory
    ? sortedEvents.filter((e) => e.category === selectedCategory)
    : sortedEvents;

  return (
    <Box p={2}>
      {/* 1) Kategori boştaysa duyurular */}
      {!selectedCategory && anns.length > 0 && (
        <>
          <Typography variant="h5" sx={{ mb: 2 }}>
            📢 Duyurular
          </Typography>
          <Box>
            {anns.map((ann) => (
              <Paper key={ann.id} sx={{ p: 2, mb: 1 }}>
                <Typography>{ann.message}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(ann.createdAt).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Box>
        </>
      )}

      {/* 2) Kategori boştaysa “Önerilen” */}
      {!selectedCategory && (
        <>
          <Typography variant="h5" sx={{ my: 2 }}>
            🔥 Popüler Etkinlikler
          </Typography>
          <Box sx={{ display: "flex", overflowX: "auto", pb: 2 }}>
            {sortedEvents.slice(0, 5).map((e) => (
              <Box key={e.id} sx={{ flex: "0 0 auto", mr: 2 }}>
                <EventComponent event={e} width={300} />
              </Box>
            ))}
          </Box>
        </>
      )}

      {/* 3) Tüm Etkinlikler (grid, tarihe göre sıralı ve kategori filtresi) */}
      <Typography variant="h5" sx={{ my: 2 }}>
        {selectedCategory
          ? `${selectedCategory.charAt(0).toUpperCase() +
          selectedCategory.slice(1)} Etkinlikleri`
          : "📅 Tüm Etkinlikler"}
      </Typography>

      {filtered.length === 0 ? (
        <Typography>Bu kategoride etkinlik bulunamadı.</Typography>
      ) : (
        <Grid container spacing={2}>
          {filtered.map((e) => (
            <Grid size={{ xs: 12, md: 4, }} key={e.id}>
              <EventComponent event={e} />
            </Grid>
          ))}
        </Grid>
      )}
    </Box>
  );
};

export default EventsPage;
