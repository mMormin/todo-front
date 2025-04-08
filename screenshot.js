import { createServer } from "vite";
import { chromium } from "playwright";

const takeScreenshot = async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto("http://localhost:5173");
  await page.waitForLoadState("networkidle");
  await page.screenshot({ path: "screenshot.png", fullPage: true });
  await browser.close();
  console.log("📸 Screenshot pris avant fermeture");
};

(async () => {
  const server = await createServer({});

  await server.listen();

  console.log("🚀 Serveur Vite lancé sur http://localhost:5173");

  process.on("SIGINT", async () => {
    console.log("\n🛑 Ctrl+C détecté. Prise de screenshot...");
    await takeScreenshot();

    console.log("🧹 Arrêt du serveur...");
    await server.close();
    process.exit(0);
  });
})();
