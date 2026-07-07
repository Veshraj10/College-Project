const leaderboardList = document.getElementById("leaderboardList");
const emptyMsg = document.getElementById("emptyMsg");

function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard") || "[]");

  leaderboardList.innerHTML = "";

  if (leaderboard.length === 0) {
    emptyMsg.style.display = "block";
    return;
  }

  emptyMsg.style.display = "none";

  leaderboard
    .sort((a, b) => b.score - a.score)
    .slice(0, 10)
    .forEach((entry, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <span class="rank">#${index + 1}</span>
        <span class="player-name">${escapeHtml(entry.name)}</span>
        <span class="player-score">${entry.score} pts</span>
      `;
      leaderboardList.appendChild(li);
    });
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.getElementById("backBtn").addEventListener("click", () => {
  window.location.href = "index.html";
});

document.getElementById("clearBtn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear the leaderboard?")) {
    localStorage.removeItem("leaderboard");
    renderLeaderboard();
  }
});

renderLeaderboard();
