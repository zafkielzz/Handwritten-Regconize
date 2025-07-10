// DOM Elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const resultDiv = document.getElementById("result");
const clearBtn = document.getElementById("clear-btn");
const predictBtn = document.getElementById("predict-btn");
const downloadBtn = document.getElementById("download-btn");

let drawing = false;

// Function to get corrected mouse position
function getMousePos(e) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;
  return {
    x: (e.clientX - rect.left) * scaleX,
    y: (e.clientY - rect.top) * scaleY,
  };
}

// Drawing Event Listeners
canvas.addEventListener("mousedown", (e) => {
  drawing = true;
  const pos = getMousePos(e);
  ctx.beginPath();
  ctx.moveTo(pos.x, pos.y);
});

canvas.addEventListener("mousemove", (e) => {
  if (drawing) {
    const pos = getMousePos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  }
});

canvas.addEventListener("mouseup", () => {
  drawing = false;
});

canvas.addEventListener("mouseleave", () => {
  drawing = false;
});

// Button Event Listeners
clearBtn.addEventListener("click", resetUI);
predictBtn.addEventListener("click", predict);
downloadBtn.addEventListener("click", downloadCanvas);

// --- Core Functions ---

function initializeCanvas() {
  ctx.strokeStyle = "white";
  ctx.lineWidth = 20;
  ctx.lineCap = "round";
  clearCanvas();
}

function clearCanvas() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function resetUI() {
  clearCanvas();
  resultDiv.textContent = "Hãy vẽ một số vào ô trên";
  resultDiv.className = "info";
  predictBtn.disabled = false;
}

function isCanvasBlank() {
  const pixelBuffer = new Uint32Array(
    ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer
  );
  return !pixelBuffer.some((color) => color !== 0);
}

async function predict() {
  if (isCanvasBlank()) {
    resultDiv.textContent = "Vui lòng vẽ một số trước.";
    resultDiv.className = "error";
    return;
  }

  predictBtn.disabled = true;
  resultDiv.textContent = "Đang dự đoán...";
  resultDiv.className = "info";

  try {
    const dataURL = canvas.toDataURL("image/png");
    const response = await fetch("http://127.0.0.1:5000/predict", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: dataURL }),
    });

    if (!response.ok) {
      throw new Error(`Lỗi từ server: ${response.statusText}`);
    }

    const data = await response.json();
    resultDiv.textContent = "Kết quả: " + data.prediction;
    resultDiv.className = "success";
  } catch (error) {
    resultDiv.textContent = "Lỗi: Không thể kết nối tới server.";
    resultDiv.className = "error";
    console.error("Error:", error);
  } finally {
    predictBtn.disabled = false;
  }
}

function downloadCanvas() {
  if (isCanvasBlank()) {
    alert("Không có gì để tải!");
    return;
  }
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `digit_${new Date().getTime()}.png`;
  link.click();
}

// Initialize the app
initializeCanvas();
