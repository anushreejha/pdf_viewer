"use client";

import { useState } from "react";
import { Button, Container, Box, Typography, IconButton } from "@mui/material";
import PDFViewer from "../components/pdfviewer";
import {
  HighlightOutlined,
  SearchOutlined,
  BookmarkBorderOutlined,
  ZoomIn,
  ZoomOut,
  Download,
} from "@mui/icons-material";

export default function Index() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, display: "flex", gap: 2 }}>
      {/* Left Banner - Highlights */}
      <Box
        sx={{
          width: "200px",
          backgroundColor: "#0171c5",
          color: "white",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">Highlights</Typography>
        {/* Placeholder for highlighted texts */}
        <Typography variant="body2" sx={{ mt: 2 }}>
          Highlighted texts will appear here.
        </Typography>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#0171c5", textAlign: "center" }}>
          PDF Viewer
        </Typography>

        <Button
          variant="contained"
          component="label"
          sx={{
            backgroundColor: "#0171c5",
            color: "white",
            ":hover": { backgroundColor: "#01579b" },
            mb: 2,
          }}
        >
          Upload PDF
          <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
        </Button>

        {pdfFile && <PDFViewer pdfFile={pdfFile} />}
      </Box>

      {/* Right Menu Bar */}
      <Box
        sx={{
          width: "64px",
          backgroundColor: "#0171c5",
          color: "white",
          padding: "20px 10px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton sx={{ color: "white" }}>
          <HighlightOutlined />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <SearchOutlined />
        </IconButton>
        <IconButton sx={{ color: "white" }}>
          <BookmarkBorderOutlined />
        </IconButton>
      </Box>
    </Container>
  );
}