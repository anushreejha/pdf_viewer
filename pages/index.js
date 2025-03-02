"use client";

import { useState } from "react";
import { Button, Container, Box, Typography, IconButton } from "@mui/material";
import PDFViewer from "../components/pdfviewer";
import {
  EditNoteOutlined,
  SearchOutlined,
  BookmarkBorderOutlined,
} from "@mui/icons-material";

export default function Index() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(URL.createObjectURL(file));
    }
  };

  const handleHighlightClick = (event) => {
    setIsHighlighting((prev) => !prev);
    setColorPickerAnchor(event.currentTarget);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, display: "flex", gap: 2 }}>
      <Box
        sx={{
          width: "200px",
          backgroundColor: "#f5f5f5",
          color: "#0171c5",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Typography variant="h6">Highlights</Typography>
        <Typography variant="body2" sx={{ mt: 2 }}>
          Highlighted texts will appear here.
        </Typography>
      </Box>

      <Box sx={{ flex: 1 }}>
        <Typography variant="h4" gutterBottom sx={{ color: "#0171c5", textAlign: "center" }}>
          PDF Viewer
        </Typography>

        <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
          <Button
            variant="contained"
            component="label"
            sx={{
              backgroundColor: "#0171c5",
              color: "white",
              ":hover": { backgroundColor: "#01579b" },
            }}
          >
            Upload PDF
            <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
          </Button>
        </Box>

        {pdfFile && (
          <PDFViewer
            pdfFile={pdfFile}
            isHighlighting={isHighlighting}
            colorPickerAnchor={colorPickerAnchor}
            onColorPickerClose={() => setColorPickerAnchor(null)}
            onSelectColor={(color) => {
              setColorPickerAnchor(null);
            }}
          />
        )}
      </Box>

      <Box
        sx={{
          width: "64px",
          backgroundColor: "#f5f5f5",
          padding: "10px",
          borderRadius: "8px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 2,
        }}
      >
        <IconButton
          onClick={handleHighlightClick}
          sx={{
            backgroundColor: "#0171c5",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            ":hover": { backgroundColor: "#01579b" },
          }}
        >
          <EditNoteOutlined />
        </IconButton>
        <IconButton
          sx={{
            backgroundColor: "#0171c5",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            ":hover": { backgroundColor: "#01579b" },
          }}
        >
          <SearchOutlined />
        </IconButton>
        <IconButton
          sx={{
            backgroundColor: "#0171c5",
            color: "white",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            ":hover": { backgroundColor: "#01579b" },
          }}
        >
          <BookmarkBorderOutlined />
        </IconButton>
      </Box>
    </Container>
  );
}