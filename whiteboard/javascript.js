const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");

const colorPicker = document.getElementById("colorPicker");
const brushSize = document.getElementById("brushSize");
const clearBtn = document.getElementById("clearBtn");
const saveBtn = document.getElementById("saveBtn");
const eraserBtn = document.getElementById("eraserBtn");

// Početne postavke
let drawing = false;
let currentColor = colorPicker.value;
let isErasing = false;

// Funkcije crtanja
function startDraw(e) {
  drawing = true;
  draw(e);
}

function endDraw() {
  drawing = false;
  ctx.beginPath();
}

function draw(e) {
  if (!drawing) return;

  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  const clientX = e.clientX || e.touches[0].clientX;
  const clientY = e.clientY || e.touches[0].clientY;

  const x = (clientX - rect.left) * scaleX;
  const y = (clientY - rect.top) * scaleY;

  ctx.lineWidth = brushSize.value;
  ctx.lineCap = "round";
  ctx.strokeStyle = isErasing ? "#FFFFFF" : currentColor;

  ctx.lineTo(x, y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y);
}

// Mouse Events
canvas.addEventListener("mousedown", startDraw);
canvas.addEventListener("mouseup", endDraw);
canvas.addEventListener("mousemove", draw);

// Touch Events (mobile/tablet)
canvas.addEventListener("touchstart", startDraw);
canvas.addEventListener("touchmove", (e) => {
  draw(e);
  e.preventDefault();
});
canvas.addEventListener("touchend", endDraw);

// Toolbar Logic
colorPicker.addEventListener("input", () => {
  currentColor = colorPicker.value;
  isErasing = false;
});

eraserBtn.addEventListener("click", () => {
  isErasing = !isErasing;
  eraserBtn.textContent = isErasing ? "Crtaj" : "Briši";
});

clearBtn.addEventListener("click", () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
});

saveBtn.addEventListener("click", () => {
  const image = canvas.toDataURL("image/png");
  const link = document.createElement("a");
  link.href = image;
  link.download = "moj_crtez.png";
  link.click();
});

// Funkcija za učitavanje IPI loga (uvijek prikaži pri učitavanju)
function loadDefaultLogo() {
  const img = new Image();
  img.src = "slike/logo-ipi-square.png";

  img.onload = () => {
    // Centriraj logo na canvas
    const logoWidth = 200;
    const logoHeight = (img.height / img.width) * logoWidth;
    const x = (canvas.width - logoWidth) / 2;
    const y = (canvas.height - logoHeight) / 2;

    // Nacrtaj sa 50% prozirnosti
    ctx.save();
    ctx.globalAlpha = 0.5;
    ctx.drawImage(img, x, y, logoWidth, logoHeight);
    ctx.restore();
  };

  img.onerror = () => {
    console.error(
      "Logo nije pronađen ili nije moguće učitati: slike/logo-ipi-square.png"
    );
  };
}

// Učitaj logo kada se stranica učita
loadDefaultLogo();
