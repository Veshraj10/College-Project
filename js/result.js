const playerName = localStorage.getItem("playerName") || "Player";
const score = parseInt(localStorage.getItem("quizScore"), 10) || 0;
const totalQuestions =
  parseInt(localStorage.getItem("totalQuestions"), 10) || 20;

document.getElementById("playerLine").textContent =
  `${playerName}, here's how you did:`;
document.getElementById("finalScore").textContent = score;

function getPerformanceMessage(score, total) {
  const maxPossible = total;
  if (score >= maxPossible * 0.8)
    return "🌟 Legendary! You're a true football encyclopedia!";
  if (score >= maxPossible * 0.5)
    return "⚽ Great job! You really know your football!";
  if (score >= 0) return "👍 Not bad! A few more matches to study.";
  return "😅 Tough round! Time for a rematch.";
}

document.getElementById("performanceMsg").textContent = getPerformanceMessage(
  score,
  totalQuestions,
);

// --- Personal best (tracked per browser, not per account) ---
function checkPersonalBest() {
  const banner = document.getElementById("bestBanner");
  const previousBest = localStorage.getItem("bestScore");

  if (previousBest === null || score > parseInt(previousBest, 10)) {
    localStorage.setItem("bestScore", score);
    banner.textContent = "🏆 New Personal Best!";
    banner.style.display = "inline-block";
  } else {
    banner.textContent = `Personal Best: ${previousBest} pts`;
    banner.style.display = "inline-block";
  }
}

checkPersonalBest();

function saveToLeaderboard() {
  const alreadySaved = sessionStorage.getItem("resultSaved");
  if (alreadySaved) return;

  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  leaderboard.push({
    name: playerName,
    score: score,
    date: new Date().toLocaleDateString(),
  });

  leaderboard.sort((a, b) => b.score - a.score);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  sessionStorage.setItem("resultSaved", "true");
}

saveToLeaderboard();

function launchConfetti() {
  const colors = ["#ffd166", "#2ecc71", "#e74c3c", "#3498db", "#ffffff"];
  const confettiCount = 60;

  for (let i = 0; i < confettiCount; i++) {
    const piece = document.createElement("div");
    piece.className = "confetti-piece";
    piece.style.left = `${Math.random() * 100}vw`;
    piece.style.background = colors[Math.floor(Math.random() * colors.length)];
    piece.style.animationDuration = `${2.5 + Math.random() * 2}s`;
    piece.style.animationDelay = `${Math.random() * 0.6}s`;
    piece.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(piece);
    setTimeout(() => piece.remove(), 5000);
  }
}

if (score >= totalQuestions * 0.5) {
  launchConfetti();
}

document.getElementById("playAgainBtn").addEventListener("click", () => {
  sessionStorage.removeItem("resultSaved");
  window.location.href = "index.html";
});

document.getElementById("leaderboardBtn").addEventListener("click", () => {
  window.location.href = "leaderboard.html";
});

document.getElementById("shareBtn").addEventListener("click", () => {
  const text = `⚽🏆 I scored ${score}/${totalQuestions} on the FIFA World Cup Ultimate Quiz! Think you can beat me?`;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("shareBtn");
    const original = btn.textContent;
    btn.textContent = "✅ Copied!";
    setTimeout(() => (btn.textContent = original), 1500);
  });
});
