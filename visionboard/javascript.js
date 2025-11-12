// ======= Vision Board Logic =======

// Odaberi glavni element
const board = document.getElementById("board");
const addNoteBtn = document.getElementById("addNoteBtn");
const addImageBtn = document.getElementById("addImageBtn");
const addQuoteBtn = document.getElementById("addQuoteBtn");
const saveBtn = document.getElementById("saveBtn");
const clearBtn = document.getElementById("clearBtn");
const recentContainer = document.getElementById("recentItems");
const clearRecentBtn = document.getElementById("clearRecentBtn");

// Recent removed items (max 3)
let recentRemoved = []; // in-memory
const RECENT_KEY = "visionBoardRecent";

// Boje za ljepljive bilješke
const colors = ["color1", "color2", "color3", "color4", "color5", "color6"];

// Primjeri slika i citata
const sampleImages = [
  "slike/slika1.jpg",
  "slike/slika2.jpg",
  "slike/slika3.jpg",
  "slike/slika4.jpg",
  "slike/slika5.jpg",
  "slike/slika6.jpg",
  "slike/slika7.jpg",
  "slike/slika8.jpg",
  "slike/slika9.jpg",
  "slike/slika10.jpg",
];

const sampleQuotes = [
  "“Svaka dovoljno napredna tehnologija jednaka je magiji.” –Arthur C. Clarke ",
  "“Tehnologija je riječ koja opisuje nešto što još ne funkcionira.” - Douglas Adams",
  "“Ne osnivate zajednice. Zajednice već postoje. Pitanje koje treba postaviti je kako im možete pomoći da budu bolje.”– Mark Zuckerberg",
];

// ======= Usluzni program za stvaranje stavki koje se mogu povlaciti i brisati =======
function makeDraggable(el) {
  let offsetX, offsetY;

  // Kreiranje delete (X) button
  const delBtn = document.createElement("button");
  delBtn.textContent = "📌";
  delBtn.className = "delete-btn";
  el.appendChild(delBtn);

  // Brisanje elementa na click
  delBtn.addEventListener("click", (e) => {
    e.stopPropagation(); // prevent starting drag
    // Serialize before remove
    const data = serializeElement(el);
    el.remove();
    pushRecent(data);
    renderRecent();
  });

  // logika povlacenja
  el.addEventListener("mousedown", dragStart);

  function dragStart(e) {
    if (e.target === delBtn) return; // preskoci povlacenja ako se klikne X
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

// ======= Dodaj Post It =======
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

// ======= Dodatj sliku =======
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

// ======= Dodaj citat =======
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

// ======= Snimi Visual Board =======
saveBtn.addEventListener("click", saveBoard);

function saveBoard(silent = false) {
  const items = [];
  document.querySelectorAll("#board > div").forEach((el) => {
    const data = serializeElement(el);
    items.push(data);
  });
  localStorage.setItem("visionBoardItems", JSON.stringify(items));
  // Također sačuvaj i posljednje skinute pinove (max 3)
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
  if (!silent) {
    alert("Board saved!");
  }
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
  // Remove delete buttons inside html to avoid duplicates when restoring preview
  // Keep raw html as is for full fidelity.
  recentRemoved.unshift(data); // add to start
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
    // Provide simplified preview
    if (item.type === "image") {
      // extract img if present
      const temp = document.createElement("div");
      temp.innerHTML = item.html;
      const img = temp.querySelector("img");
      if (img) {
        const previewImg = document.createElement("img");
        previewImg.src = img.src;
        wrap.appendChild(previewImg);
      }
    } else {
      const text = document.createElement("div");
      text.textContent =
        (item.type === "note" ? "Bilješka: " : "Citat: ") +
        truncateText(stripHTML(item.html), 40);
      wrap.appendChild(text);
    }
    const btn = document.createElement("button");
    btn.textContent = "Vrati";
    btn.className = "restore-btn";
    btn.addEventListener("click", () => {
      restoreRecent(idx);
    });
    wrap.appendChild(btn);
    recentContainer.appendChild(wrap);
  });
}

function stripHTML(html) {
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

function truncateText(t, len) {
  return t.length > len ? t.slice(0, len - 3) + "..." : t;
}

function restoreRecent(index) {
  const item = recentRemoved[index];
  if (!item) return;
  const el = createElementFromData(item);
  // Put near top-left with slight offset so user sees it
  el.style.left = Math.random() * 100 + "px";
  el.style.top = Math.random() * 80 + "px";
  board.appendChild(el);
  // Remove from recent list
  recentRemoved.splice(index, 1);
  localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
  renderRecent();
  saveBoard(true); // tiho sačuvaj bez alert-a
}

// ======= Ucitaj Visual Board =======
function loadBoard() {
  const data = localStorage.getItem("visionBoardItems");
  if (!data) return;
  const items = JSON.parse(data);
  items.forEach((item) => {
    const div = createElementFromData(item);
    board.appendChild(div);
  });
}
loadBoard();

// Load recent removed items
function loadRecent() {
  const data = localStorage.getItem(RECENT_KEY);
  if (!data) return;
  try {
    recentRemoved = JSON.parse(data);
  } catch (e) {
    recentRemoved = [];
  }
  renderRecent();
}
loadRecent();

// Clear recent removed items
if (clearRecentBtn) {
  clearRecentBtn.addEventListener("click", () => {
    if (confirm("Očistiti sve skinute pinove?")) {
      recentRemoved = [];
      localStorage.setItem(RECENT_KEY, JSON.stringify(recentRemoved));
      renderRecent();
    }
  });
}

// ======= Ocisti Visual Board =======
clearBtn.addEventListener("click", () => {
  if (confirm("Clear the board?")) {
    board.innerHTML = "";
    localStorage.removeItem("visionBoardItems");
  }
});
