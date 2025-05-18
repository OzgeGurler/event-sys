import React from "react";
import { Paper, Typography } from "@mui/material";

import { Announcement } from "../types/Announcement";

const AnnouncementComponent: React.FC<{ ann: Announcement }> = ({ ann }) => (
    <Paper
        sx={{
            p: 2,
            mx: 1,
            minWidth: 300,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
        }}
        elevation={3}
    >
        <Typography variant="body1">{ann.message}</Typography>
    </Paper>
);

export default AnnouncementComponent;
