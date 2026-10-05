const mitzvot = window.MITZVOT;

if (!Array.isArray(mitzvot) || mitzvot.length !== 613) {
  throw new Error("The Sefer HaMitzvot data set did not load correctly.");
}

const button = document.querySelector("#choose-button");
const buttonLabel = document.querySelector("#button-label");
const resultArea = document.querySelector("#result-area");
let selectedIndex = null;

function escapeHtml(value) {
  return String(value).replace(/[&<>'"]/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    "'": "&#39;",
    '"': "&quot;",
  })[character]);
}

function chooseMitzvah() {
  let nextIndex = Math.floor(Math.random() * mitzvot.length);

  while (nextIndex === selectedIndex && mitzvot.length > 1) {
    nextIndex = Math.floor(Math.random() * mitzvot.length);
  }

  selectedIndex = nextIndex;
  const mitzvah = mitzvot[selectedIndex];
  buttonLabel.textContent = "בחרו לי מצווה נוספת";

  resultArea.innerHTML = `
    <article class="mitzvah-card">
      <div class="card-number" aria-hidden="true">${String(mitzvah.number).padStart(3, "0")}</div>
      <div class="card-copy">
        <p class="card-label">${escapeHtml(mitzvah.kind)}</p>
        <h2>מצווה ${escapeHtml(mitzvah.number)}</h2>
        <blockquote>${escapeHtml(mitzvah.summary)}</blockquote>
        <a class="source-link" href="${escapeHtml(mitzvah.sourceUrl)}" target="_blank" rel="noreferrer">
          ${escapeHtml(mitzvah.source)} ↗
        </a>
      </div>
    </article>`;

  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  resultArea.scrollIntoView({
    behavior: reduceMotion ? "auto" : "smooth",
    block: "center",
  });
}

button.addEventListener("click", chooseMitzvah);
