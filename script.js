/* -------------------------
   THEME TOGGLE
-------------------------- */
const themeToggle = document.getElementById("themeToggle");

function setTheme(mode) {
  document.documentElement.setAttribute("data-theme", mode);
  localStorage.setItem("theme", mode);
  themeToggle.textContent = mode === "dark" ? "Light Mode" : "Dark Mode";
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  setTheme(current === "dark" ? "light" : "dark");
});

// Load saved theme
setTheme(localStorage.getItem("theme") || "dark");


/* -------------------------
   API KEY GENERATOR
-------------------------- */
const generateKeyBtn = document.getElementById("generateKey");
const apiKeyBox = document.getElementById("apiKeyBox");

generateKeyBtn.addEventListener("click", () => {
  const key = "meta_" + Math.random().toString(36).substring(2, 18);
  apiKeyBox.textContent = "Your API Key: " + key;
  apiKeyBox.classList.remove("hidden");
});


/* -------------------------
   PURCHASE MODAL
-------------------------- */
const modal = document.getElementById("modal");
const purchaseBtn = document.getElementById("purchaseApi");
const closeModal = document.getElementById("closeModal");

purchaseBtn.addEventListener("click", () => {
  modal.classList.remove("hidden");
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});
