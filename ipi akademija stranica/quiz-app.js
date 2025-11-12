// Interactive Quiz Logic for IPI Student Fun Zone
// Converts static form into dynamic scoring without navigation

const quizContainer = document.getElementById("quizRoot");
const checkBtn = document.getElementById("checkAnswersBtn");
const resultBox = document.getElementById("quizResult");
const restartBtn = document.getElementById("restartQuizBtn");

// Define questions (id => correct values)
const answers = {
  q1: ["HyperText Markup Language"],
  q2: ["<ul>", "<ol>", "<li>"],
  q3: ["<img>"],
  q4: ["href", "src", "alt"],
  q5: ['<a href="example.com">Click</a>'],
};

function collectUserAnswers() {
  const user = {};
  Object.keys(answers).forEach((qid) => {
    const inputs = document.querySelectorAll(`[name="${qid}"]`);
    user[qid] = [];
    inputs.forEach((inp) => {
      if (inp.checked) {
        user[qid].push(inp.value);
      }
    });
  });
  return user;
}

function grade() {
  const user = collectUserAnswers();
  let total = 0;
  const max = Object.keys(answers).length;
  Object.keys(answers).forEach((qid) => {
    const correctSet = new Set(answers[qid]);
    const userSet = new Set(user[qid]);
    const allCorrectSelected = answers[qid].every((a) => userSet.has(a));
    const noIncorrect = Array.from(userSet).every((a) => correctSet.has(a));
    if (allCorrectSelected && noIncorrect) {
      total++;
      markQuestion(qid, true);
    } else {
      markQuestion(qid, false);
    }
  });
  showResult(total, max);
}

function markQuestion(qid, ok) {
  const block = document.getElementById(`${qid}_block`);
  if (!block) return;
  block.classList.remove("correct", "incorrect");
  block.classList.add(ok ? "correct" : "incorrect");
}

function showResult(score, max) {
  resultBox.innerHTML = `Rezultat: <strong>${score}</strong> / ${max}`;
  resultBox.classList.add("visible");
  restartBtn.style.display = "inline-block";
}

function restart() {
  // Clear selections
  document
    .querySelectorAll("input[type=radio], input[type=checkbox]")
    .forEach((inp) => (inp.checked = false));
  document
    .querySelectorAll(".correct, .incorrect")
    .forEach((el) => el.classList.remove("correct", "incorrect"));
  resultBox.textContent = "";
  resultBox.classList.remove("visible");
  restartBtn.style.display = "none";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

checkBtn?.addEventListener("click", (e) => {
  e.preventDefault();
  grade();
});
restartBtn?.addEventListener("click", restart);
