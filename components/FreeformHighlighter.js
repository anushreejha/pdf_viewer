import { useEffect, useRef } from "react";

const FreeformHighlighter = ({ color, onDraw, containerRef, scale }) => {
  const canvasRef = useRef(null);
  const isDrawing = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const startDrawing = (e) => {
      isDrawing.current = true;
      startPos.current = { x: e.offsetX, y: e.offsetY };
    };

    const draw = (e) => {
      if (!isDrawing.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.lineWidth = 10 * scale;
      ctx.globalAlpha = 0.3;
      ctx.beginPath();
      ctx.moveTo(startPos.current.x, startPos.current.y);
      ctx.lineTo(e.offsetX, e.offsetY);
      ctx.stroke();
    };

    const stopDrawing = (e) => {
      if (!isDrawing.current) return;
      isDrawing.current = false;
      const rect = {
        left: Math.min(startPos.current.x, e.offsetX) / scale,
        top: Math.min(startPos.current.y, e.offsetY) / scale,
        width: Math.abs(e.offsetX - startPos.current.x) / scale,
        height: Math.abs(e.offsetY - startPos.current.y) / scale,
      };
      onDraw(rect);
    };

    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);

    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
    };
  }, [color, onDraw, scale]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "auto" }}
      width={containerRef.current?.offsetWidth || 800}
      height={containerRef.current?.offsetHeight || 600}
    />
  );
};

export default FreeformHighlighter;