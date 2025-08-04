// File: src/components/Result.js
import React from 'react';
import { useCanvasContext } from './CanvasContext';

function Result() {
  const { result } = useCanvasContext();
  return <div id="result">{result}</div>;
}

export default Result;
