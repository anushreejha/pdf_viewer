import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography, IconButton } from "@mui/material";
import { ZoomIn, ZoomOut, Download } from "@mui/icons-material";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const PDFViewer = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);
  const [scale, setScale] = useState(1);

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

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = pdfFile;
    link.download = "document.pdf";
    link.click();
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
      {pdfFile ? (
        <Box
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
          {/*zoom & download controls - preview box*/}
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
            <IconButton
              onClick={handleZoomOut}
              size="small"
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                ":hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <ZoomOut sx={{ color: "#666" }} />
            </IconButton>
            <IconButton
              onClick={handleZoomIn}
              size="small"
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                ":hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <ZoomIn sx={{ color: "#666" }} />
            </IconButton>
            <IconButton
              onClick={handleDownload}
              size="small"
              sx={{
                backgroundColor: "white",
                borderRadius: "50%",
                width: "32px",
                height: "32px",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
                ":hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              <Download sx={{ color: "#666" }} />
            </IconButton>
          </Box>

          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} scale={scale} />
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