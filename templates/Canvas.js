import React, { useEffect, useRef } from 'react';
import { useCanvasContext } from './CanvasContext';

function Canvas() {
  const canvasRef = useRef(null);
  const { setCanvasRef } = useCanvasContext();
  let drawing = false;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 20;
    ctx.lineCap = 'round';
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setCanvasRef(canvas);
  }, [setCanvasRef]);

  const getMousePos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const scaleX = canvasRef.current.width / rect.width;
    const scaleY = canvasRef.current.height / rect.height;
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY,
    };
  };

  const handleMouseDown = (e) => {
    drawing = true;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getMousePos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const handleMouseMove = (e) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const handleMouseUpOrLeave = () => {
    drawing = false;
  };

  return (
    <canvas
      ref={canvasRef}
      width={280}
      height={280}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    />
  );
}

export default Canvas;
