import { Stagehand } from "@browserbasehq/stagehand";
import { BROWSER_OPTIONS, MODELS } from "../../src/config/stagehand.config";
import { openLoginPage } from "../../src/utils/login.helper";

/**
 * Prueba E2E completa con GPT.
 *
 * Requiere OPENAI_API_KEY con cuota disponible.
 */
async function main() {
    const stagehand = new Stagehand({
        env: "LOCAL",
        model: MODELS.gpt,
        localBrowserLaunchOptions: BROWSER_OPTIONS
    });

    try {
        await stagehand.init();

        const page = stagehand.context.pages()[0];

        await openLoginPage(page);

        console.log("Ejecutando acciones completas con GPT...");
        await stagehand.act("Type tomsmith in the username field");
        await stagehand.act("Type SuperSecretPassword! in the password field");
        await stagehand.act("Click the Login button");

        await page.waitForTimeout(2000);

        const result = await stagehand.extract(
            "Extract the success message shown after login"
        );

        console.log("Resultado GPT:");
        console.log(result);
    } catch (error) {
        console.error("La prueba con GPT falló:", error);
    } finally {
        await stagehand.close();
    }
}

main();
