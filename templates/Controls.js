// File: src/components/Controls.js
import React, { useState } from 'react';
import { useCanvasContext } from './CanvasContext';

function Controls() {
  const { canvasRef, setResult } = useCanvasContext();
  const [isPredicting, setIsPredicting] = useState(false);

  const isCanvasBlank = () => {
    const ctx = canvasRef.getContext('2d');
    const pixelBuffer = new Uint32Array(
      ctx.getImageData(0, 0, canvasRef.width, canvasRef.height).data.buffer
    );
    return !pixelBuffer.some((color) => color !== 0);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.getContext('2d');
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasRef.width, canvasRef.height);
    setResult('Hãy vẽ một số vào ô trên');
  };

  const downloadCanvas = () => {
    if (isCanvasBlank()) {
      alert('Không có gì để tải!');
      return;
    }
    const link = document.createElement('a');
    link.href = canvasRef.toDataURL('image/png');
    link.download = `digit_${Date.now()}.png`;
    link.click();
  };

  const predict = async () => {
    if (isCanvasBlank()) {
      setResult('Vui lòng vẽ một số trước.');
      return;
    }
    setIsPredicting(true);
    setResult('Đang dự đoán...');
    const dataURL = canvasRef.toDataURL('image/png');
    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: dataURL }),
      });

      if (!response.ok) throw new Error('Server lỗi');
      const data = await response.json();
      setResult(`Kết quả: ${data.prediction}`);
    } catch (err) {
      setResult('Lỗi: Không thể kết nối tới server.');
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <div className="controls">
      <button onClick={clearCanvas}>Xóa</button>
      <button onClick={predict} disabled={isPredicting}>Dự đoán</button>
      <button onClick={downloadCanvas}>Tải ảnh</button>
    </div>
  );
}

export default Controls;
