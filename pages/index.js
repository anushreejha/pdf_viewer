"use client";

import { useState } from "react";
import { Button, Container, Box, Typography } from "@mui/material";
import PDFViewer from "../components/pdfviewer"; 

export default function Index() {
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
      
      <Button
        variant="contained"
        component="label"
        sx={{ backgroundColor: "#1565c0", color: "white", ":hover": { backgroundColor: "#0d47a1" } }}
      >
        Upload PDF
        <input type="file" hidden accept="application/pdf" onChange={handleFileChange} />
      </Button>

      {pdfFile && <PDFViewer pdfFile={pdfFile} />}
    </Container>
  );
}
