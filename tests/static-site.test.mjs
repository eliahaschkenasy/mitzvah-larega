import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);

async function read(relativePath) {
  return readFile(new URL(relativePath, root), "utf8");
}

test("serves a Hebrew, RTL and accessible page from relative assets", async () => {
  const html = await read("docs/index.html");

  assert.match(html, /<html lang="he" dir="rtl">/);
  assert.match(html, /<meta name="viewport"/);
  assert.match(html, /href="style\.css"/);
  assert.match(html, /src="script\.js"/);
  assert.match(html, /id="choose-button"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<noscript>/);
  assert.doesNotMatch(html, /מתוך 12 מצוות ומעשים טובים/);
  assert.doesNotMatch(html, /לעשות טוב, רגע אחרי רגע/);
  assert.doesNotMatch(html, /רגע אחד של כוונה/);
  assert.doesNotMatch(html, /לחיצה אחת, רעיון אחד/);
  assert.doesNotMatch(html, /(?:src|href)="\//);
});

test("the button reveals a mitzvah and avoids an immediate repeat", async () => {
  const source = await read("docs/script.js");
  let clickHandler;
  let scrollCount = 0;
  const buttonLabel = { textContent: "" };
  const resultArea = {
    innerHTML: "",
    scrollIntoView() {
      scrollCount += 1;
    },
  };
  const button = {
    addEventListener(event, handler) {
      assert.equal(event, "click");
      clickHandler = handler;
    },
  };
  const randomValues = [0.01, 0.01, 0.09];
  const testMath = Object.create(Math);
  testMath.random = () => randomValues.shift() ?? 0.5;
  const elements = {
    "#choose-button": button,
    "#button-label": buttonLabel,
    "#result-area": resultArea,
  };

  vm.runInNewContext(source, {
    document: { querySelector: (selector) => elements[selector] },
    window: { matchMedia: () => ({ matches: false }) },
    Math: testMath,
  });

  assert.equal(typeof clickHandler, "function");
  clickHandler();
  const firstCard = resultArea.innerHTML;
  assert.match(firstCard, /לתת צדקה/);
  assert.equal(buttonLabel.textContent, "בחרו לי מצווה נוספת");

  clickHandler();
  assert.match(resultArea.innerHTML, /כיבוד הורים/);
  assert.notEqual(resultArea.innerHTML, firstCard);
  assert.equal(scrollCount, 2);
});

test("includes responsive and reduced-motion safeguards", async () => {
  const [css, script] = await Promise.all([
    read("docs/style.css"),
    read("docs/script.js"),
  ]);

  assert.match(css, /@media \(max-width: 680px\)/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
  assert.match(css, /:focus-visible/);
  assert.match(script, /prefers-reduced-motion: reduce/);
  assert.match(script, /while \(nextIndex === selectedIndex/);
});
