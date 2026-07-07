const leaderboardList = document.getElementById("leaderboardList");
const emptyMsg = document.getElementById("emptyMsg");

// Secret admin check — visit the page with ?admin=veshraj123 in the URL
// to reveal the Clear Leaderboard button. Change "veshraj123" to whatever
const ADMIN_SECRET = "veshraj123";
const urlParams = new URLSearchParams(window.location.search);
const isAdmin = urlParams.get("admin") === ADMIN_SECRET;

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

// Only add the Clear Leaderboard button if the secret admin key is present
if (isAdmin) {
  const btnRow = document.querySelector(".btn-row");
  const clearBtn = document.createElement("button");
  clearBtn.id = "clearBtn";
  clearBtn.textContent = "🗑 Clear Leaderboard";
  clearBtn.addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the leaderboard?")) {
      localStorage.removeItem("leaderboard");
      renderLeaderboard();
    }
  });
  btnRow.appendChild(clearBtn);
}

renderLeaderboard();
