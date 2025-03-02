import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography, IconButton } from "@mui/material";
import { ZoomIn, ZoomOut, Download } from "@mui/icons-material";
import HighlightColorPicker from "./HighlightColorPicker";
import { PDFDocument, rgb } from "pdf-lib";
import styles from "./PDFViewer.module.css"; 
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const PDFViewer = ({
  pdfFile,
  isHighlighting,
  colorPickerAnchor,
  onColorPickerClose,
  onSelectColor,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2); // Larger default scale
  const [highlights, setHighlights] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#FFFF00"); // Only yellow
  const pdfContainerRef = useRef(null);

  // Load highlights from local storage on component mount
  useEffect(() => {
    const savedHighlights = JSON.parse(localStorage.getItem("pdfHighlights")) || [];
    setHighlights(savedHighlights);
  }, []);

  // Save highlights to local storage whenever they change
  useEffect(() => {
    localStorage.setItem("pdfHighlights", JSON.stringify(highlights));
  }, [highlights]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error while loading document: ", error);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(0.5, prevScale - 0.1));
  };

  const handleDownload = async () => {
    if (!pdfFile) return;

    try {
      const existingPdfBytes = await fetch(pdfFile).then((res) => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(existingPdfBytes);
      const pages = pdfDoc.getPages();

      for (const highlight of highlights) {
        const { pageNumber, rect, color } = highlight;

        // Validate page number
        if (pageNumber < 1 || pageNumber > pages.length) {
          console.error("Invalid page number:", pageNumber);
          continue;
        }

        const page = pages[pageNumber - 1];
        const { width, height } = page.getSize();

        // Validate coordinates
        if (
          isNaN(rect.left) ||
          isNaN(rect.top) ||
          isNaN(rect.width) ||
          isNaN(rect.height)
        ) {
          console.error("Invalid highlight coordinates:", rect);
          continue;
        }

        // Map coordinates from preview to PDF
        const x = rect.left * (width / pdfContainerRef.current.offsetWidth);
        const y = height - (rect.top + rect.height) * (height / pdfContainerRef.current.offsetHeight);

        // Draw the highlight
        page.drawRectangle({
          x,
          y,
          width: rect.width * (width / pdfContainerRef.current.offsetWidth),
          height: rect.height * (height / pdfContainerRef.current.offsetHeight),
          color: rgb(1, 1, 0), // Yellow
          opacity: 0.3,
        });
      }

      // Save and download the PDF
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "highlighted-document.pdf";
      link.click();
    } catch (error) {
      console.error("Error while generating highlighted PDF: ", error);
    }
  };

  const handleTextHighlight = () => {
    const selection = window.getSelection();
    if (selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const rects = Array.from(range.getClientRects());

      // Determine the page number based on the selection's position
      const containerRect = pdfContainerRef.current.getBoundingClientRect();
      const pageHeight = containerRect.height / numPages;
      const pageNumber = Math.floor((rects[0].top - containerRect.top) / pageHeight) + 1;

      const newHighlights = rects.map((rect) => ({
        rect: {
          left: (rect.left - containerRect.left) / scale,
          top: ((rect.top - containerRect.top) % pageHeight) / scale,
          width: rect.width / scale,
          height: rect.height / scale,
        },
        color: selectedColor,
        pageNumber, // Dynamic page number
      }));

      // Append new highlights to the existing highlights
      setHighlights((prevHighlights) => [...prevHighlights, ...newHighlights]);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
      {pdfFile ? (
        <Box
          ref={pdfContainerRef}
          sx={{
            width: "100%",
            maxWidth: "800px",
            height: "80vh",
            overflow: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            backgroundColor: "#f8f8f8",
            position: "relative",
          }}
        >
          {/* Zoom and Download Controls */}
          <Box
            sx={{
              position: "sticky",
              top: 0,
              display: "flex",
              gap: 1,
              justifyContent: "flex-end",
              zIndex: 1,
            }}
          >
            <IconButton onClick={handleZoomOut} size="small">
              <ZoomOut />
            </IconButton>
            <IconButton onClick={handleZoomIn} size="small">
              <ZoomIn />
            </IconButton>
            <IconButton onClick={handleDownload} size="small">
              <Download />
            </IconButton>
          </Box>

          {/* Highlight Color Picker */}
          <HighlightColorPicker
            anchorEl={colorPickerAnchor}
            onClose={onColorPickerClose}
            onSelectColor={(color) => {
              setSelectedColor(color);
              onSelectColor(color);
            }}
          />

          {/* PDF Preview */}
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
            {Array.from(new Array(numPages), (_, index) => (
              <Box key={`page_${index + 1}`} sx={{ position: "relative" }}>
                <Page
                  pageNumber={index + 1}
                  scale={scale}
                  renderTextLayer={true}
                  renderAnnotationLayer={true}
                  className={styles.textContent} // Apply CSS Module class
                />
                {highlights
                  .filter((h) => h.pageNumber === index + 1)
                  .map((highlight, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: "absolute",
                        top: `${highlight.rect.top * scale}px`,
                        left: `${highlight.rect.left * scale}px`,
                        width: `${highlight.rect.width * scale}px`,
                        height: `${highlight.rect.height * scale}px`,
                        backgroundColor: highlight.color,
                        opacity: 0.3,
                        pointerEvents: "none",
                      }}
                    />
                  ))}
              </Box>
            ))}
          </Document>
        </Box>
      ) : (
        <Typography variant="h6">No PDF loaded. Upload a file!</Typography>
      )}
    </Box>
  );
};

export default PDFViewer;