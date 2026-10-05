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
  assert.match(html, /src="mitzvot\.js"/);
  assert.match(html, /src="script\.js"/);
  assert.ok(html.indexOf('src="mitzvot.js"') < html.indexOf('src="script.js"'));
  assert.match(html, /id="choose-button"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(html, /<noscript>/);
  assert.doesNotMatch(html, /מתוך 12 מצוות ומעשים טובים/);
  assert.doesNotMatch(html, /לעשות טוב, רגע אחרי רגע/);
  assert.doesNotMatch(html, /רגע אחד של כוונה/);
  assert.doesNotMatch(html, /לחיצה אחת, רעיון אחד/);
  assert.doesNotMatch(html, /(?:src|href)="\//);
});

test("contains the Rambam's complete 613-commandment count", async () => {
  const source = await read("docs/mitzvot.js");
  const dataWindow = {};
  vm.runInNewContext(source, { window: dataWindow });
  const mitzvot = dataWindow.MITZVOT;

  assert.equal(mitzvot.length, 613);
  assert.equal(mitzvot.filter(({ kind }) => kind === "מצוות עשה").length, 248);
  assert.equal(mitzvot.filter(({ kind }) => kind === "מצוות לא תעשה").length, 365);
  assert.ok(mitzvot.every(({ summary }) => summary.length > 20 && summary.length <= 261));
  assert.ok(mitzvot.every(({ sourceUrl }) => sourceUrl.startsWith("https://www.sefaria.org/Sefer_HaMitzvot")));
});

test("the button reveals a mitzvah and avoids an immediate repeat", async () => {
  const [dataSource, source] = await Promise.all([
    read("docs/mitzvot.js"),
    read("docs/script.js"),
  ]);
  const dataWindow = {};
  vm.runInNewContext(dataSource, { window: dataWindow });
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
  const randomValues = [0, 0, 0.5];
  const testMath = Object.create(Math);
  testMath.random = () => randomValues.shift() ?? 0.5;
  const elements = {
    "#choose-button": button,
    "#button-label": buttonLabel,
    "#result-area": resultArea,
  };

  const appWindow = {
    MITZVOT: dataWindow.MITZVOT,
    matchMedia: () => ({ matches: false }),
  };

  vm.runInNewContext(source, {
    document: { querySelector: (selector) => elements[selector] },
    window: appWindow,
    Math: testMath,
  });

  assert.equal(typeof clickHandler, "function");
  clickHandler();
  const firstCard = resultArea.innerHTML;
  assert.match(firstCard, /מצוות עשה/);
  assert.match(firstCard, /מצווה 1/);
  assert.match(firstCard, /היא הצווי אשר צונו בהאמנת האלהות/);
  assert.doesNotMatch(firstCard, /צעד קטן להיום|today-action/);
  assert.equal(buttonLabel.textContent, "בחרו לי מצווה נוספת");

  clickHandler();
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
