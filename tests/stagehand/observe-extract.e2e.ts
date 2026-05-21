import { Stagehand } from "@browserbasehq/stagehand";

async function main() {
    const stagehand = new Stagehand({
        env: "LOCAL",
        model: "google/gemini-2.5-flash",
        localBrowserLaunchOptions: {
            headless: false
        }
    });

    try {
        await stagehand.init();

        const page = stagehand.context.pages()[0];

        console.log("Abriendo página de login...");
        await page.goto("https://the-internet.herokuapp.com/login", {
            waitUntil: "domcontentloaded"
        });

        console.log("Observando elementos de la interfaz...");
        const observations = await stagehand.observe(
            "Identify the username input, password input, and login button on this page"
        );

        console.log("Elementos observados:");
        console.log(observations);

        console.log("Ejecutando login con IA...");
        await stagehand.act("Type tomsmith in the username field");
        await stagehand.act("Type SuperSecretPassword! in the password field");
        await stagehand.act("Click the Login button");

        await page.waitForTimeout(3000);

        console.log("Extrayendo resultado...");
        const result = await stagehand.extract(
            "Extract the success message shown after login"
        );

        console.log("Resultado extraído:");
        console.log(result);

    } catch (error) {
        console.error("La prueba observe/extract falló:", error);
    } finally {
        await stagehand.close();
    }
}

main();