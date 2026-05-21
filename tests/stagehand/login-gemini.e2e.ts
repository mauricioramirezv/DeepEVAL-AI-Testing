import { Stagehand } from "@browserbasehq/stagehand";
import { BROWSER_OPTIONS, MODELS } from "../../src/config/stagehand.config";

/**
 * Prueba E2E completa con Gemini.
 *
 * Aquí Stagehand usa IA para:
 * - identificar el campo username,
 * - identificar el campo password,
 * - hacer clic en el botón Login,
 * - extraer el mensaje final.
 */
async function main() {
    const stagehand = new Stagehand({
        env: "LOCAL",
        model: MODELS.gemini,
        localBrowserLaunchOptions: BROWSER_OPTIONS
    });

    try {
        await stagehand.init();

        const page = stagehand.context.pages()[0];

        console.log("Abriendo página de login...");
        await page.goto("https://the-internet.herokuapp.com/login", {
            waitUntil: "domcontentloaded"
        });

        console.log("Ejecutando acciones completas con Gemini...");
        await stagehand.act("Type tomsmith in the username field");
        await stagehand.act("Type SuperSecretPassword! in the password field");
        await stagehand.act("Click the Login button");

        await page.waitForTimeout(2000);

        const result = await stagehand.extract(
            "Extract the success message shown after login"
        );

        console.log("Resultado Gemini:");
        console.log(result);
    } catch (error) {
        console.error("La prueba con Gemini falló:", error);
    } finally {
        await stagehand.close();
    }
}

main();