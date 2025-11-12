// Interactive Bingo Game for IPI Student Fun Zone
// Blue theme #345AAA

const BINGO_SIZE = 5;
const FREE_TEXT = "SLOBODAN PROSTOR";
const statements = [
  "Putovao je van zemlje.",
  "Letio je avionom.",
  "Ima više od troje braće i sestara.",
  "Ima pet ili više kućnih ljubimaca.",
  "Voli jesti kisele krastavce.",
  "Igra košarku.",
  "Voli Disney-eve crtane filmove.",
  "Voli crtati.",
  "Voli HTML.",
  "Zna roniti.",
  "Omiljena boja je narandžasta.",
  "Ne voli plažu.",
  "Dobar je u matematici.",
  "Nema kućne ljubimce.",
  "Ne voli čokoladu.",
  "Boji se pauka.",
  "Voli peći kolačiće.",
  "Svira instrument.",
  "Alergičan je na mačke ili pse.",
  "Slavi rođendan u oktobru.",
  "Voli jesti sir.",
  "Igra online igre.",
  "Ne voli pizzu.",
  "Voli pjevati.",
  "Ima tetovažu.",
  "Gleda SF filmove.",
  "Koristi Linux.",
  "Piše dnevnik.",
  "Trči 5km redovno.",
  "Zna dva strana jezika.",
];

const boardEl = document.getElementById("bingoBoard");
const generateBtn = document.getElementById("generateCardBtn");
const resetMarksBtn = document.getElementById("resetMarksBtn");
const exportBtn = document.getElementById("exportPdfBtn");
const statusEl = document.getElementById("bingoStatus");

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function generateCard() {
  statusEl.textContent = "";
  const pool = shuffle(statements);
  const needed = BINGO_SIZE * BINGO_SIZE - 1; // minus free center
  const chosen = pool.slice(0, needed);
  const cells = [];
  let idx = 0;
  for (let r = 0; r < BINGO_SIZE; r++) {
    const row = [];
    for (let c = 0; c < BINGO_SIZE; c++) {
      if (r === 2 && c === 2) {
        row.push({ text: FREE_TEXT, free: true, marked: true });
      } else {
        row.push({ text: chosen[idx++], free: false, marked: false });
      }
    }
    cells.push(row);
  }
  renderBoard(cells);
}

function renderBoard(cells) {
  boardEl.innerHTML = "";
  cells.forEach((row, r) => {
    const tr = document.createElement("tr");
    row.forEach((cell, c) => {
      const td = document.createElement("td");
      td.textContent = cell.text;
      td.dataset.row = r;
      td.dataset.col = c;
      td.className = "bingo-cell" + (cell.free ? " free marked" : "");
      td.addEventListener("click", () => {
        td.classList.toggle("marked");
        checkWin();
      });
      tr.appendChild(td);
    });
    boardEl.appendChild(tr);
  });
}

function checkWin() {
  const cells = Array.from(boardEl.querySelectorAll("td"));
  const grid = Array.from({ length: BINGO_SIZE }, () =>
    Array(BINGO_SIZE).fill(false)
  );
  cells.forEach((td) => {
    const r = +td.dataset.row;
    const c = +td.dataset.col;
    if (td.classList.contains("marked")) grid[r][c] = true;
  });
  // rows
  for (let r = 0; r < BINGO_SIZE; r++) {
    if (grid[r].every((v) => v)) {
      return declareWin("Red " + (r + 1));
    }
  }
  // cols
  for (let c = 0; c < BINGO_SIZE; c++) {
    let colOk = true;
    for (let r = 0; r < BINGO_SIZE; r++) {
      if (!grid[r][c]) {
        colOk = false;
        break;
      }
    }
    if (colOk) {
      return declareWin("Kolona " + (c + 1));
    }
  }
  // diag TL-BR
  if (Array.from({ length: BINGO_SIZE }, (_, i) => grid[i][i]).every((v) => v))
    return declareWin("Dijagonala 1");
  // diag TR-BL
  if (
    Array.from(
      { length: BINGO_SIZE },
      (_, i) => grid[i][BINGO_SIZE - 1 - i]
    ).every((v) => v)
  )
    return declareWin("Dijagonala 2");
}

function declareWin(type) {
  statusEl.textContent = "BINGO! " + type + " kompletiran.";
  statusEl.classList.add("win");
}

function resetMarks() {
  statusEl.textContent = "";
  statusEl.classList.remove("win");
  boardEl
    .querySelectorAll("td:not(.free)")
    .forEach((td) => td.classList.remove("marked"));
  boardEl.querySelector("td.free")?.classList.add("marked");
}

function exportPdf() {
  window.print(); // jednostavno rješenje za sada
}

generateBtn.addEventListener("click", generateCard);
resetMarksBtn.addEventListener("click", resetMarks);
exportBtn.addEventListener("click", exportPdf);

// initial
generateCard();
