import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Box, Typography } from "@mui/material";

pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.js";

const PDFViewer = ({ pdfFile }) => {
  const [numPages, setNumPages] = useState(null);

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error while loading document: ", error);
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" mt={3}>
      {pdfFile ? (
        <Box
          sx={{
            width: "100%",
            maxWidth: "800px",
            height: "80vh",
            overflowY: "auto",
            border: "1px solid #ccc",
            padding: "10px",
            backgroundColor: "#f8f8f8",
          }}
        >
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess} onLoadError={onDocumentLoadError}>
            {Array.from(new Array(numPages), (_, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
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