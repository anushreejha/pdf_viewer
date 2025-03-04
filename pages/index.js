"use client";

import { useState, useEffect } from "react";
import { Button, Container, Box, Typography, IconButton } from "@mui/material";
import PDFViewer from "../components/PDFViewer";
import {
  EditNoteOutlined,
  SearchOutlined,
  BookmarkBorderOutlined,
} from "@mui/icons-material";

export default function Index() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isHighlighting, setIsHighlighting] = useState(false);
  const [colorPickerAnchor, setColorPickerAnchor] = useState(null);
  const [highlights, setHighlights] = useState([]);

  // clear highlights on server restart
  useEffect(() => {
    localStorage.removeItem("pdfHighlights");
    setHighlights([]);
  }, []);

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
    <Container maxWidth="lg" sx={{ mt: 4, display: "flex", gap: 2, height: "80vh" }}>
      {/* highlights box */}
      <Box
        sx={{
          width: "200px",
          backgroundColor: "#f5f5f5",
          color: "#0171c5",
          padding: "20px",
          borderRadius: "8px",
          textAlign: "center",
          height: "100%", 
          overflowY: "auto", 
          boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
          Highlights
        </Typography>
        {highlights.map((highlight, i) => (
          <Box
            key={i}
            sx={{
              backgroundColor: "#ffffff",
              padding: "10px",
              borderRadius: "8px",
              marginBottom: "10px",
              boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Typography variant="body2" sx={{ color: "#333333", lineHeight: "1.5" }}>
              {highlight.text}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* PDF preview box */}
      <Box sx={{ flex: 1, height: "100%" }}>
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
            highlights={highlights}
            setHighlights={setHighlights}
          />
        )}
      </Box>

      {/* menu bar (icons) */}
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
          height: "100%", 
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