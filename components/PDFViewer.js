import { useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { PDFDocument, rgb } from "pdf-lib";
import { Button } from "@mui/material";
import { saveAs } from "file-saver";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export default function PDFViewer({ fileUrl }) {
  const [numPages, setNumPages] = useState(null);
  const [highlights, setHighlights] = useState([]);
  const pdfRef = useRef(null);

  const onDocumentLoadSuccess = ({ numPages }) => setNumPages(numPages);

  const highlightText = () => {
    setHighlights([...highlights, Math.floor(Math.random() * numPages) + 1]);
  };

  const saveHighlightedPDF = async () => {
    const existingPdfBytes = await fetch(fileUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const pages = pdfDoc.getPages();

    highlights.forEach(pageNumber => {
      const page = pages[pageNumber - 1];
      page.drawRectangle({
        x: 50,
        y: 500,
        width: 400,
        height: 20,
        color: rgb(1, 1, 0),
        opacity: 0.5,
      });
    });

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    saveAs(blob, "highlighted.pdf");
  };

  return (
    <div>
      <Document file={fileUrl} onLoadSuccess={onDocumentLoadSuccess} ref={pdfRef}>
        {Array.from(new Array(numPages), (_, index) => (
          <Page key={index} pageNumber={index + 1} />
        ))}
      </Document>
      <Button variant="contained" color="primary" onClick={highlightText}>
        Highlight Random
      </Button>
      <Button variant="contained" color="secondary" onClick={saveHighlightedPDF}>
        Download PDF
      </Button>
    </div>
  );
}
