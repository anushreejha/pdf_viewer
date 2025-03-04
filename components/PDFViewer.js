import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography, IconButton } from "@mui/material";
import { ZoomIn, ZoomOut, Download } from "@mui/icons-material";
import HighlightColorPicker from "./HighlightColorPicker";
import 'react-pdf/dist/esm/Page/TextLayer.css';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const PDFViewer = ({
  pdfFile,
  isHighlighting,
  colorPickerAnchor,
  onColorPickerClose,
  onSelectColor,
  highlights = [], 
  setHighlights,
}) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1.2);
  const [selectedColor, setSelectedColor] = useState("#FFFF00");
  const pdfContainerRef = useRef(null);
  const pageRefs = useRef([]);

  useEffect(() => {
    const savedHighlights = JSON.parse(localStorage.getItem("pdfHighlights")) || [];
    setHighlights(savedHighlights);
  }, [setHighlights]);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    pageRefs.current = new Array(numPages).fill(null);
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

      // find the page number based on the selection
      let pageNumber = -1;
      for (let i = 0; i < pageRefs.current.length; i++) {
        const pageRect = pageRefs.current[i]?.getBoundingClientRect();
        if (pageRect && rect.top >= pageRect.top && rect.bottom <= pageRect.bottom) {
          pageNumber = i + 1;
          break;
        }
      }

      if (pageNumber === -1) return; // selection is not within any page

      const pageRect = pageRefs.current[pageNumber - 1].getBoundingClientRect();

      // relative positioning as per zoom scaling
      const left = (rect.left - pageRect.left) / scale;
      const top = (rect.top - pageRect.top) / scale;
      const width = rect.width / scale;
      const height = rect.height / scale;

      const highlight = {
        text: selection.toString(),
        rect: {
          left,
          top,
          width,
          height,
        },
        pageNumber,
        color: selectedColor,
      };

      setHighlights((prev) => {
        const newHighlights = [...prev, highlight];
        localStorage.setItem("pdfHighlights", JSON.stringify(newHighlights));
        return newHighlights;
      });

      // clear selection to avoid highlighting the same text multiple times
      selection.removeAllRanges();
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
              <Box
                key={`page_${index + 1}`}
                ref={(el) => (pageRefs.current[index] = el)}
                sx={{ position: "relative" }}
              >
                <Page pageNumber={index + 1} scale={scale} />
                {highlights
                  .filter((highlight) => highlight.pageNumber === index + 1)
                  .map((highlight, i) => (
                    <Box
                      key={i}
                      sx={{
                        position: "absolute",
                        left: `${highlight.rect.left * scale}px`,
                        top: `${highlight.rect.top * scale}px`,
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