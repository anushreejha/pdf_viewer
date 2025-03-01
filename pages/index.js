import { useState } from "react";
import { Container, Button } from "@mui/material";
import PDFViewer from "../components/PDFViewer";

export default function Home() {
  const [pdfFile, setPdfFile] = useState("/sample.pdf");

  return (
    <Container>
      <h1>PDF Viewer & Highlighter</h1>
      <PDFViewer fileUrl={pdfFile} />
    </Container>
  );
}
