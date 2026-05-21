export async function loginWithPlaywright(page: any) {
    await page.goto("https://the-internet.herokuapp.com/login", {
        waitUntil: "domcontentloaded"
    });

    await page.locator("#username").fill("tomsmith");
    await page.locator("#password").fill("SuperSecretPassword!");
    await page.locator("button[type='submit']").click();

    await page.waitForSelector("#flash", {
        state: "visible",
        timeout: 10000
    });
}

export async function assertVisibleSuccessMessage(page: any) {
    const message = await page.locator("#flash").innerText();

    if (!message.includes("You logged into a secure area!")) {
        throw new Error(
            `No se encontró el mensaje esperado. Mensaje actual: ${message}`
        );
    }

    return message.trim();
}