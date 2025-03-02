import { Box, IconButton, Popover } from "@mui/material";

const colors = ["#FFFF00"]; 

const HighlightColorPicker = ({ anchorEl, onClose, onSelectColor }) => {
  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
    >
      <Box sx={{ display: "flex", gap: 1, p: 2 }}>
        {colors.map((color) => (
          <IconButton
            key={color}
            sx={{ backgroundColor: color, width: "24px", height: "24px" }}
            onClick={() => onSelectColor(color)}
          />
        ))}
      </Box>
    </Popover>
  );
};

export default HighlightColorPicker;