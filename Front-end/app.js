// Point this at your backend (update if needed)
const API_BASE = "http://localhost:3000";

const form     = document.getElementById("ask-form");
const input    = document.getElementById("question");
const btn      = document.getElementById("ask-btn");
const log      = document.getElementById("log");
const clearBtn = document.getElementById("clear-btn");
const health   = document.getElementById("health-link");
const modelTag = document.getElementById("model-tag");

const cardTpl    = document.getElementById("card-tpl");
const loadingTpl = document.getElementById("loading-tpl");

// Restore last session from localStorage
let history = JSON.parse(localStorage.getItem("ut_history") || "[]");
history.forEach(({ q, a }) => renderCard(q, a));
capHistory();

document.querySelectorAll(".chip").forEach(chip => {
  chip.className = "ex chip px-3 py-1.5 rounded-full text-xs bg-brandblue/15 border border-brandblue/30 text-sky-200 hover:bg-brandblue/25 transition";
  chip.addEventListener("click", () => {
    input.value = chip.textContent.trim();
    input.focus();
  });
});

// Submit handler
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const question = input.value.trim();
  if (!question) return;

  input.value = "";
  input.style.height = "auto";
  setSending(true);

  const loading = loadingTpl.content.cloneNode(true);
  log.prepend(loading);

  try {
    const resp = await fetch(`${API_BASE}/ask`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question, history })
    });
    const data = await resp.json();

    // remove loading card (always first)
    log.firstElementChild?.remove();

    if (!resp.ok || data.error) {
      renderCard(question, `⚠️ ${data.error || "Something went wrong."}`);
      setSending(false);
      return;
    }

    if (data.model) modelTag.textContent = data.model;

    renderCard(question, data.answer);
    history.push({ q: question, a: data.answer });
    capHistory();
    persist();
  } catch (err) {
    log.firstElementChild?.remove();
    renderCard(question, "⚠️ Network error. Is the backend running?");
  } finally {
    setSending(false);
  }
});

// Ctrl/Cmd + Enter to send
input.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    form.requestSubmit();
  }
});

// Autosize textarea
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = Math.min(input.scrollHeight, 160) + "px";
});

// Clear chat
clearBtn.addEventListener("click", () => {
  history = [];
  persist();
  log.innerHTML = "";
  input.focus();
});

// Health check
health.addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    const r = await fetch(`${API_BASE}/health`);
    const j = await r.json();
    alert(`API: ${j.ok ? "OK" : "Down"} | Model: ${j.model || "?"}`);
  } catch {
    alert("API not reachable.");
  }
});

function renderCard(q, a) {
  const frag = cardTpl.content.cloneNode(true);
  frag.querySelector(".q").textContent = q;
  frag.querySelector(".a").textContent = a;

  const node = frag.firstElementChild;
  node.querySelector(".copy").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(a);
      const btn = node.querySelector(".copy");
      const old = btn.innerHTML;
      btn.innerHTML = "Copied!";
      setTimeout(() => (btn.innerHTML = old), 900);
    } catch {}
  });

  log.prepend(node);
}

function capHistory() {
  // keep only last 3 pairs for context
  if (history.length > 3) history = history.slice(-3);
}

function persist() {
  localStorage.setItem("ut_history", JSON.stringify(history));
}

function setSending(on) {
  btn.disabled = on;
  btn.classList.toggle("opacity-70", on);
}
