"use client";

import { useState } from "react";
import { Button, Container, Box, Typography } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";

// Configure PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

export default function Home() {
  const [pdfFile, setPdfFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(URL.createObjectURL(file));
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4, textAlign: "center" }}>
      <Typography variant="h4" gutterBottom sx={{ color: "#1565c0" }}>
        PDF Viewer
      </Typography>
      
      {/* Upload Button */}
      <Button
        variant="contained"
        component="label"
        sx={{ backgroundColor: "#1565c0", color: "white", ":hover": { backgroundColor: "#0d47a1" } }}
      >
        Upload PDF
        <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
      </Button>

      {/* PDF Viewer Box */}
      <Box
        sx={{
          border: "2px dashed #1565c0",
          borderRadius: "8px",
          height: "500px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mt: 3,
          bgcolor: "#f5f5f5",
        }}
      >
        {pdfFile ? (
          <Document file={pdfFile} onLoadError={console.error}>
            <Page pageNumber={1} width={500} />
          </Document>
        ) : (
          <Typography variant="body1" sx={{ color: "#1565c0" }}>
            No PDF Loaded
          </Typography>
        )}
      </Box>
    </Container>
  );
}
