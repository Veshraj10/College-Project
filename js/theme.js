(function () {
  const THEME_KEY = "quizTheme";

  function getSavedTheme() {
    return localStorage.getItem(THEME_KEY) || "dark";
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.textContent = theme === "dark" ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
  }

  function toggleTheme() {
    const next = getSavedTheme() === "dark" ? "light" : "dark";
    localStorage.setItem(THEME_KEY, next);
    applyTheme(next);
  }

  // Apply saved theme as early as possible to avoid a flash of the wrong theme
  applyTheme(getSavedTheme());

  document.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");
    if (btn) {
      btn.addEventListener("click", toggleTheme);
      applyTheme(getSavedTheme());
    }
  });
})();