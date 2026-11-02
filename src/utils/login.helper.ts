import { EXPECTED_LOGIN_MESSAGE, VALID_USER } from "../config/stagehand.config";

export async function loginWithDeterministicSelectors(page: any) {
  await page.locator("#username").fill(VALID_USER.username);
  await page.locator("#password").fill(VALID_USER.password);
  await page.locator("button[type='submit']").click();
  await page.waitForSelector("#flash", { state: "visible", timeout: 15_000 });
  const message = (await page.locator("#flash").innerText())
    .replace(/\s*[×✖]\s*$/, "")
    .trim();
  if (!message.includes(EXPECTED_LOGIN_MESSAGE)) {
    throw new Error(`No se encontró el mensaje esperado. Mensaje actual: ${message}`);
  }
  return message;
}
