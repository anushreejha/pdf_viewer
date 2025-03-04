import { useState, useRef, useEffect, forwardRef } from "react";
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
  setHighlights,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [selectedColor, setSelectedColor] = useState("#FFFF00");
  const pdfContainerRef = useRef(null);

  useEffect(() => {
    const savedHighlights = JSON.parse(localStorage.getItem("pdfHighlights")) || [];
    setHighlights(savedHighlights);
  }, [setHighlights]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const handleZoomIn = () => {
    setScale((prevScale) => prevScale + 0.1);
  };

  const handleZoomOut = () => {
    setScale((prevScale) => Math.max(0.5, prevScale - 0.1));
  };

  const handleTextSelection = () => {
    if (!isHighlighting) return;

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      const containerRect = pdfContainerRef.current.getBoundingClientRect();

      const highlight = {
        text: selection.toString(),
        rect: {
          left: rect.left - containerRect.left,
          top: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
        },
        pageNumber: 1, // You need to determine the page number based on the selection
        color: selectedColor,
      };

      setHighlights((prev) => {
        const newHighlights = [...prev, highlight];
        localStorage.setItem("pdfHighlights", JSON.stringify(newHighlights));
        return newHighlights;
      });
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
          onMouseUp={handleTextSelection}
        >
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
            <IconButton onClick={() => {}} size="small">
              <Download />
            </IconButton>
          </Box>

          <HighlightColorPicker
            anchorEl={colorPickerAnchor}
            onClose={onColorPickerClose}
            onSelectColor={(color) => {
              setSelectedColor(color);
              onSelectColor(color);
            }}
          />

          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (_, index) => (
              <Box key={`page_${index + 1}`} sx={{ position: "relative" }}>
                <Page pageNumber={index + 1} scale={scale} />
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