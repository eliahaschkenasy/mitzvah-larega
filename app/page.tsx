"use client";

import { useState } from "react";

const mitzvot = [
  {
    title: "לתת צדקה",
    explanation:
      "להפריש משהו משלך למי שזקוק — כסף, אוכל או עזרה מעשית. גם נתינה קטנה, כשנעשית בלב פתוח, יכולה לשנות יום שלם.",
    source: "פתוח תפתח את ידך",
    action: "בחרו היום סכום קטן או חפץ טוב והעבירו אותו הלאה.",
  },
  {
    title: "כיבוד הורים",
    explanation:
      "להעניק להורים יחס של כבוד, הקשבה ועזרה. לפעמים המצווה מתחילה דווקא בשיחת טלפון קצרה ובשאלה כנה: מה שלומכם?",
    source: "כבד את אביך ואת אמך",
    action: "התקשרו, כתבו הודעה חמה או הציעו עזרה בדבר אחד.",
  },
  {
    title: "ואהבת לרעך כמוך",
    explanation:
      "לראות את האדם שמולנו בעין טובה ולנהוג בו כפי שהיינו רוצים שינהגו בנו — בסבלנות, ברגישות ובנדיבות.",
    source: "ואהבת לרעך כמוך",
    action: "תנו היום מחמאה אמיתית לאדם שלא מצפה לה.",
  },
  {
    title: "שמירת הלשון",
    explanation:
      "לבחור מילים שבונות ולא פוגעות, ולהימנע מדיבור שלילי שאינו מועיל. לפעמים השתיקה הנכונה היא מעשה של חסד.",
    source: "מי האיש החפץ חיים — נצור לשונך מרע",
    action: "לפני משפט על אדם אחר, עצרו לרגע ושאלו: האם זה נחוץ וטוב?",
  },
  {
    title: "לימוד תורה",
    explanation:
      "לקבוע זמן ללימוד שמוסיף חכמה, עומק ומשמעות לחיים. אפילו כמה דקות קבועות הופכות את הלימוד לחלק מהיום.",
    source: "והגית בו יומם ולילה",
    action: "הקדישו עשר דקות לקריאת פרשה, משנה או רעיון יהודי.",
  },
  {
    title: "ביקור חולים",
    explanation:
      "להיות לצד אדם שאינו מרגיש טוב, בביקור, בשיחה או בהודעה. הנוכחות עצמה מזכירה לו שהוא לא לבד.",
    source: "והלכת בדרכיו",
    action: "שאלו לשלומו של אדם שמתמודד עם קושי והציעו עזרה ממוקדת.",
  },
  {
    title: "השבת אבדה",
    explanation:
      "להתאמץ להחזיר דבר שאבד לבעליו. המצווה מחנכת אותנו לאחריות גם כלפי רכוש שאינו שלנו.",
    source: "השב תשיבם לאחיך",
    action: "מצאתם משהו? נסו לאתר את בעליו במקום להניח שמישהו אחר יטפל בזה.",
  },
  {
    title: "הכנסת אורחים",
    explanation:
      "לפתוח מקום לאחר — בבית, סביב השולחן וגם בלב. קבלת פנים חמה מעניקה תחושת שייכות וביטחון.",
    source: "גדולה הכנסת אורחים",
    action: "הזמינו מישהו לקפה, לארוחה או לשיחה נעימה.",
  },
  {
    title: "בל תשחית",
    explanation:
      "להימנע מבזבוז ומהרס מיותר ולכבד את המשאבים שקיבלנו. תשומת לב קטנה יכולה להפוך להרגל של אחריות.",
    source: "לא תשחית",
    action: "השתמשו היום מחדש בדבר אחד שבדרך כלל הייתם זורקים.",
  },
  {
    title: "עשיית שלום",
    explanation:
      "לחפש דרך לקרב בין אנשים, להפחית מתחים ולוותר כשאפשר. שלום נבנה ממחוות קטנות ומאומץ להקשיב.",
    source: "בקש שלום ורדפהו",
    action: "עשו צעד קטן לתיקון אי־הבנה או פיוס עם אדם קרוב.",
  },
  {
    title: "עזרה לזולת",
    explanation:
      "לשים לב למי שמתאמץ ולהושיט יד לפני שביקש. נשיאה משותפת בעול הופכת קושי פרטי לאחריות אנושית משותפת.",
    source: "עזב תעזב עמו",
    action: "הציעו עזרה מעשית במשימה שמכבידה היום על מישהו.",
  },
  {
    title: "הודיה וברכה",
    explanation:
      "לעצור לפני הנאה ולהכיר בטוב שקיבלנו. ברכה בכוונה הופכת רגע יומיומי להזדמנות של תשומת לב והכרת תודה.",
    source: "ואכלת ושבעת וברכת",
    action: "אמרו ברכה אחת היום לאט, והתרכזו במילים שלה.",
  },
] as const;

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [revealKey, setRevealKey] = useState(0);

  function chooseMitzvah() {
    let nextIndex = Math.floor(Math.random() * mitzvot.length);

    if (selectedIndex !== null && mitzvot.length > 1) {
      while (nextIndex === selectedIndex) {
        nextIndex = Math.floor(Math.random() * mitzvot.length);
      }
    }

    setSelectedIndex(nextIndex);
    setRevealKey((key) => key + 1);
  }

  const selected = selectedIndex === null ? null : mitzvot[selectedIndex];

  return (
    <main className="site-shell">
      <div className="sun-glow" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="#top" aria-label="מצווה לרגע — ראש הדף">
          <span className="brand-mark" aria-hidden="true">מ</span>
          <span>מצווה לרגע</span>
        </a>
        <span className="edition">רעיון קטן ליום גדול</span>
      </header>

      <section className="hero" id="top">
        <div className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" />
          רגע אחד של כוונה
        </div>
        <h1>
          איזו מצווה<br />
          <span>מחכה לך היום?</span>
        </h1>
        <p className="intro">
          לחיצה אחת, רעיון אחד, הזדמנות אחת להוסיף קצת טוב לעולם.
        </p>

        <button className="choose-button" type="button" onClick={chooseMitzvah}>
          <span>{selected ? "בחרו לי מצווה נוספת" : "בחרו לי מצווה"}</span>
          <span className="button-icon" aria-hidden="true">✦</span>
        </button>

        <p className="hint">מתוך {mitzvot.length} מצוות ומעשים טובים</p>
      </section>

      <section className="result-area" aria-live="polite" aria-atomic="true">
        {selected ? (
          <article className="mitzvah-card" key={revealKey}>
            <div className="card-number" aria-hidden="true">
              {String(selectedIndex! + 1).padStart(2, "0")}
            </div>
            <div className="card-copy">
              <p className="card-label">המצווה שלך</p>
              <h2>{selected.title}</h2>
              <p className="explanation">{selected.explanation}</p>
              <blockquote>״{selected.source}״</blockquote>
              <div className="today-action">
                <span className="action-symbol" aria-hidden="true">↙</span>
                <div>
                  <p className="action-label">צעד קטן להיום</p>
                  <p>{selected.action}</p>
                </div>
              </div>
            </div>
          </article>
        ) : (
          <div className="waiting-mark" aria-hidden="true">
            <span>✦</span>
          </div>
        )}
      </section>

      <footer>
        <span>לעשות טוב, רגע אחרי רגע</span>
        <span className="footer-dot" aria-hidden="true" />
        <span>תשפ״ז</span>
      </footer>
    </main>
  );
}
