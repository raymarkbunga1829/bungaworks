import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
const failed = [];
page.on("response", (r) => {
  if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
});
page.on("console", (m) => {
  if (m.type() === "error") console.log("CONSOLE", m.text());
});
page.on("pageerror", (e) => console.log("PAGEERROR", e.message));

await page.goto("http://127.0.0.1:8080/play", { waitUntil: "networkidle" });
await page.screenshot({ path: "/workspace/screenshots/play-desktop.png" });

await page.getByRole("button", { name: "Play" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: "/workspace/screenshots/play-started.png" });

await page.keyboard.press("ArrowLeft");
await page.keyboard.press("ArrowLeft");
await page.keyboard.press("ArrowRight");
await page.keyboard.press("KeyX");
await page.keyboard.press("Space");
await page.waitForTimeout(200);
await page.screenshot({ path: "/workspace/screenshots/play-after-drop.png" });

const test = await page.evaluate(() => {
  const fn = window.__tetrisTest;
  return fn ? fn() : { ok: false, notes: ["no test"] };
});
console.log("SELFTEST", JSON.stringify(test));

await page.goto("http://127.0.0.1:8080/journal/guideline-well", { waitUntil: "networkidle" });
await page.screenshot({ path: "/workspace/screenshots/essay.png" });

await page.goto("http://127.0.0.1:8080/login", { waitUntil: "networkidle" });
await page.waitForTimeout(500);

await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:8080/", { waitUntil: "networkidle" });
const overflow = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);
console.log("MOBILE_OVERFLOW_HOME", overflow);
await page.screenshot({ path: "/workspace/screenshots/home-mobile.png" });

await page.goto("http://127.0.0.1:8080/play", { waitUntil: "networkidle" });
const overflowPlay = await page.evaluate(
  () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 2,
);
console.log("MOBILE_OVERFLOW_PLAY", overflowPlay);
await page.screenshot({ path: "/workspace/screenshots/play-mobile.png" });

console.log("FAILED", failed);
await browser.close();
