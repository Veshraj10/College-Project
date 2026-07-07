const TIME_PER_QUESTION = 10;

let currentIndex = 0;
let score = 0;
let timeLeft = TIME_PER_QUESTION;
let timerInterval = null;
let answerLocked = false;
let isMuted = localStorage.getItem("soundMuted") === "true";
const answerStatus = new Array(questions.length).fill("empty"); // "empty" | "correct" | "wrong"

const levelBadge = document.getElementById("levelBadge");
const questionCount = document.getElementById("questionCount");
const scoreDisplay = document.getElementById("scoreDisplay");
const timerBar = document.getElementById("timerBar");
const timerText = document.getElementById("timerText");
const questionArea = document.getElementById("questionArea");
const questionText = document.getElementById("questionText");
const optionsList = document.getElementById("optionsList");
const feedback = document.getElementById("feedback");
const progressDots = document.getElementById("progressDots");
const muteBtn = document.getElementById("muteBtn");

const playerName = localStorage.getItem("playerName");
if (!playerName) {
  window.location.href = "index.html";
}

function playSound(name) {
  if (isMuted) return;
  try {
    const audio = new Audio(`sounds/${name}.mp3`);
    audio.volume = 0.5;
    audio.play().catch(() => {});
  } catch (e) {}
}

muteBtn.textContent = isMuted ? "🔇" : "🔊";
muteBtn.addEventListener("click", () => {
  isMuted = !isMuted;
  localStorage.setItem("soundMuted", isMuted);
  muteBtn.textContent = isMuted ? "🔇" : "🔊";
});

function buildDots() {
  progressDots.innerHTML = "";
  questions.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    dot.id = `dot-${i}`;
    progressDots.appendChild(dot);
  });
}

function refreshDots() {
  questions.forEach((_, i) => {
    const dot = document.getElementById(`dot-${i}`);
    dot.classList.remove("current", "correct", "wrong");
    if (i === currentIndex) dot.classList.add("current");
    if (answerStatus[i] === "correct") dot.classList.add("correct");
    if (answerStatus[i] === "wrong") dot.classList.add("wrong");
  });
}

function difficultyLabel(difficulty) {
  switch (difficulty) {
    case "easy":
      return "EASY";
    case "medium":
      return "MEDIUM";
    case "hard":
      return "HARD";
    case "ultra":
      return "ULTRA HARD";
    default:
      return "";
  }
}

function updateScoreDisplay() {
  scoreDisplay.textContent = `Score: ${score}`;
  scoreDisplay.classList.remove("pop");
  void scoreDisplay.offsetWidth;
  scoreDisplay.classList.add("pop");
}

function replayFadeIn() {
  questionArea.classList.remove("question-area");
  void questionArea.offsetWidth;
  questionArea.classList.add("question-area");
}

function loadQuestion() {
  answerLocked = false;
  feedback.textContent = "";

  const q = questions[currentIndex];

  levelBadge.textContent = difficultyLabel(q.difficulty);
  levelBadge.className =
    "badge " + (q.difficulty === "easy" ? "" : q.difficulty);

  questionCount.textContent = `Question ${currentIndex + 1} / ${questions.length}`;
  scoreDisplay.textContent = `Score: ${score}`;

  questionText.textContent = q.question;

  optionsList.innerHTML = "";
  q.options.forEach((option) => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.textContent = option;
    btn.addEventListener("click", () => selectAnswer(btn, option));
    optionsList.appendChild(btn);
  });

  refreshDots();
  replayFadeIn();
  startTimer();
}

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = TIME_PER_QUESTION;
  timerBar.style.width = "100%";
  timerBar.classList.remove("warning");
  timerText.textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    const pct = (timeLeft / TIME_PER_QUESTION) * 100;
    timerBar.style.width = `${Math.max(pct, 0)}%`;
    timerText.textContent = `${Math.max(timeLeft, 0)}s`;

    if (timeLeft <= 3) timerBar.classList.add("warning");

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      handleTimeout();
    }
  }, 1000);
}

function handleTimeout() {
  if (answerLocked) return;
  answerLocked = true;

  const q = questions[currentIndex];
  score -= 1;
  answerStatus[currentIndex] = "wrong";
  updateScoreDisplay();
  refreshDots();
  feedback.textContent = `⏰ Time's up! Correct answer: ${q.answer}`;
  feedback.style.color = "#e74c3c";

  playSound("wrong");
  revealAnswer(q.answer, null);

  setTimeout(nextQuestion, 1400);
}

function selectAnswer(btn, selectedOption) {
  if (answerLocked) return;
  answerLocked = true;
  clearInterval(timerInterval);

  const q = questions[currentIndex];
  const isCorrect = selectedOption === q.answer;

  if (isCorrect) {
    score += 1;
    answerStatus[currentIndex] = "correct";
    feedback.textContent = "✅ Correct!";
    feedback.style.color = "#2ecc71";
    playSound("correct");
  } else {
    score -= 1;
    answerStatus[currentIndex] = "wrong";
    feedback.textContent = `❌ Wrong! Correct answer: ${q.answer}`;
    feedback.style.color = "#e74c3c";
    playSound("wrong");
  }

  updateScoreDisplay();
  refreshDots();
  revealAnswer(q.answer, btn);

  setTimeout(nextQuestion, 1400);
}

function revealAnswer(correctAnswer, selectedBtn) {
  const buttons = optionsList.querySelectorAll(".option-btn");
  buttons.forEach((b) => {
    b.disabled = true;
    if (b.textContent === correctAnswer) {
      b.classList.add("correct");
    } else if (b === selectedBtn) {
      b.classList.add("wrong");
    }
  });
}

function nextQuestion() {
  currentIndex++;
  if (currentIndex >= questions.length) {
    finishQuiz();
    return;
  }
  loadQuestion();
}

function finishQuiz() {
  localStorage.setItem("quizScore", score);
  localStorage.setItem("totalQuestions", questions.length);
  window.location.href = "result.html";
}

document.addEventListener("keydown", (e) => {
  if (answerLocked) return;
  if (["1", "2", "3", "4"].includes(e.key)) {
    const index = parseInt(e.key, 10) - 1;
    const buttons = optionsList.querySelectorAll(".option-btn");
    if (buttons[index]) buttons[index].click();
  }
});

buildDots();
loadQuestion();
