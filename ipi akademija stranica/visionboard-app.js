// Integrated Vision Board (copied from standalone, blue theme)
const board = document.getElementById("board");
const addNoteBtn = document.getElementById("addNoteBtn");
const addImageBtn = document.getElementById("addImageBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const recentContainer = document.getElementById("recentItems");
const clearRecentBtn = document.getElementById("clearRecentBtn");

let recentRemoved = [];
const RECENT_KEY = "visionBoardRecent";
const STORAGE_KEY = "visionBoardItems";

const colors = ["color1", "color2", "color3", "color4", "color5", "color6"];
// Load images from root/visionboard/slike (adjusted relative path)
// Integrated page is inside "ipi akademija stranica" so we go one level up
const IMG_BASE = "../visionboard/slike/";
const sampleImages = [
  "slika1.jpg",
  "slika2.jpg",
  "slika3.jpg",
  "slika4.jpg",
  "slika5.jpg",
  "slika6.jpg",
  "slika7.jpg",
  "slika8.jpg",
  "slika9.jpg",
  "slika10.jpg",
].map((n) => IMG_BASE + n);

const sampleQuotes = [
  "“Svaka dovoljno napredna tehnologija jednaka je magiji.” –Arthur C. Clarke ",
  "“Tehnologija je riječ koja opisuje nešto što još ne funkcionira.” - Douglas Adams",
  "“Ne osnivate zajednice. Zajednice već postoje. Pitanje koje treba postaviti je kako im možete pomoći da budu bolje.”– Mark Zuckerberg",
];

function makeDraggable(el) {
  let offsetX, offsetY;
  const delBtn = document.createElement("button");
  delBtn.textContent = "📌";
  delBtn.className = "delete-btn";
  el.appendChild(delBtn);
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const data = serializeElement(el);
    el.remove();
    pushRecent(data);
    renderRecent();
  });
  el.addEventListener("mousedown", dragStart);
  function dragStart(e) {
    if (e.target === delBtn) return;
    offsetX = e.clientX - el.offsetLeft;
    offsetY = e.clientY - el.offsetTop;
    document.addEventListener("mousemove", drag);
    document.addEventListener("mouseup", dragEnd);
  }
  function drag(e) {
    e.preventDefault();
    el.style.left = e.clientX - offsetX + "px";
    el.style.top = e.clientY - offsetY + "px";
  }
  function dragEnd() {
    document.removeEventListener("mousemove", drag);
    document.removeEventListener("mouseup", dragEnd);
  }
}

addNoteBtn.addEventListener("click", () => {
  const note = document.createElement("div");
  note.className = "note " + colors[Math.floor(Math.random() * colors.length)];
  note.contentEditable = "true";
  note.style.left = Math.random() * 500 + "px";
  note.style.top = Math.random() * 300 + "px";
  note.textContent = "Napiši nešto...";
  makeDraggable(note);
  board.appendChild(note);
});

addImageBtn.addEventListener("click", () => {
  const div = document.createElement("div");
  div.className = "pinned-img";
  div.style.left = Math.random() * 400 + "px";
  div.style.top = Math.random() * 250 + "px";
  const img = document.createElement("img");
  img.src = sampleImages[Math.floor(Math.random() * sampleImages.length)];
  div.appendChild(img);
  makeDraggable(div);
  board.appendChild(div);
});

addQuoteBtn.addEventListener("click", () => {
  const q = document.createElement("div");
  q.className = "quote";
  q.textContent = sampleQuotes[Math.floor(Math.random() * sampleQuotes.length)];
  q.style.left = Math.random() * 400 + "px";
  q.style.top = Math.random() * 250 + "px";
  q.contentEditable = "true";
  makeDraggable(q);
  board.appendChild(q);
});

saveBtn.addEventListener("click", () => saveBoard());
clearBtn.addEventListener("click", () => {
  if (confirm("Clear the board?")) {
    board.innerHTML = "";
    localStorage.removeItem(STORAGE_KEY);
  }
});

function saveBoard(silent = false) {
  const items = [];
  document
    .querySelectorAll("#board > div")
    .forEach((el) => items.push(serializeElement(el)));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
  if (!silent) alert("Board saved!");
}
function serializeElement(el) {
  return {
    type: el.classList.contains("note")
      ? "note"
      : el.classList.contains("quote")
      ? "quote"
      : "image",
    className: el.className,
    html: el.innerHTML,
    left: el.style.left,
    top: el.style.top,
  };
}
function createElementFromData(data) {
  const div = document.createElement("div");
  div.className = data.className;
  div.style.left = data.left;
  div.style.top = data.top;
  div.innerHTML = data.html;
  if (data.type !== "image") div.contentEditable = "true";
  makeDraggable(div);
  return div;
}
function pushRecent(data) {
  recentRemoved.unshift(data);
  if (recentRemoved.length > 3) recentRemoved = recentRemoved.slice(0, 3);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
}
function renderRecent() {
  if (!recentContainer) return;
  recentContainer.innerHTML = "";
  if (recentRemoved.length === 0) {
    recentContainer.innerHTML = "<em>Nema skinutih elemenata.</em>";
    return;
  }
  recentRemoved.forEach((item, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "recent-item";
    if (item.type === "image") {
      const temp = document.createElement("div");
      temp.innerHTML = item.html;
      const img = temp.querySelector("img");
      if (img) {
        const preview = document.createElement("img");
        preview.src = img.src;
        wrap.appendChild(preview);
      }
    } else {
      const text = document.createElement("div");
      text.textContent =
        (item.type === "note" ? "Bilješka: " : "Citat: ") +
        truncate(stripHTML(item.html), 40);
      wrap.appendChild(text);
    }
    const btn = document.createElement("button");
    btn.textContent = "Vrati";
    btn.className = "restore-btn";
    btn.addEventListener("click", () => restoreRecent(idx));
    wrap.appendChild(btn);
    recentContainer.appendChild(wrap);
  });
}
function stripHTML(html) {
  const d = document.createElement("div");
  d.innerHTML = html;
  return d.textContent || "";
}
function truncate(t, l) {
  return t.length > l ? t.slice(0, l - 3) + "..." : t;
}
function restoreRecent(index) {
  const item = recentRemoved[index];
  if (!item) return;
  const el = createElementFromData(item);
  el.style.left = Math.random() * 100 + "px";
  el.style.top = Math.random() * 80 + "px";
  board.appendChild(el);
  recentRemoved.splice(index, 1);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
  renderRecent();
  saveBoard(true);
}

function loadBoard() {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return;
  JSON.parse(data).forEach((item) =>
    board.appendChild(createElementFromData(item))
  );
}
function loadRecent() {
  const data = localStorage.getItem(RECENT_KEY);
  if (!data) return;
  try {
    recentRemoved = JSON.parse(data);
  } catch {
    recentRemoved = [];
  }
  renderRecent();
}
loadBoard();
loadRecent();

if (clearRecentBtn) {
  clearRecentBtn.addEventListener("click", () => {
    if (confirm("Očistiti sve skinute pinove?")) {
      recentRemoved = [];
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
      renderRecent();
    }
  });
}
