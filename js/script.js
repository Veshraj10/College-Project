const nameInput = document.getElementById("playerName");
const emailInput = document.getElementById("playerEmail");
const startBtn = document.getElementById("startBtn");
const errorMsg = document.getElementById("errorMsg");

startBtn.addEventListener("click", startQuiz);

nameInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startQuiz();
});
emailInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startQuiz();
});

function startQuiz() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim();

  if (name === "") {
    errorMsg.textContent = "Please enter your name to start the quiz.";
    nameInput.focus();
    return;
  }

  localStorage.setItem("playerName", name);
  localStorage.setItem("playerEmail", email); // optional, not verified — just for personalization
  localStorage.removeItem("quizScore");
  localStorage.removeItem("quizAnswers");

  window.location.href = "quiz.html";
}
