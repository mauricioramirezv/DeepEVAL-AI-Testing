import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { localBrowser, Stagehand } from "@browserbasehq/stagehand";
import { z } from "zod/v4";
import {
  BROWSER_OPTIONS,
  EXPECTED_LOGIN_MESSAGE,
  MODELS,
  TARGET_URL,
  VALID_USER,
} from "../../src/config/stagehand.config";
import { loginWithDeterministicSelectors } from "../../src/utils/login.helper";
import { createOllamaGenerate } from "./ollama.model";

type Provider = "gemini" | "openai" | "ollama";
type Interaction = "agent" | "deterministic";

interface LoginScenarioOptions {
  provider: Provider;
  interaction: Interaction;
  observeFirst?: boolean;
}

const messageSchema = z.object({
  message: z.string().describe("The login result message shown in the flash banner"),
});

function getModel(provider: Provider) {
  if (provider === "ollama") {
    return { generate: createOllamaGenerate() };
  }

  const apiKey = provider === "gemini"
    ? process.env.GOOGLE_GENERATIVE_AI_API_KEY || process.env.GEMINI_API_KEY
    : process.env.OPENAI_API_KEY;

  if (!apiKey) {
    const variable = provider === "gemini"
      ? "GOOGLE_GENERATIVE_AI_API_KEY"
      : "OPENAI_API_KEY";
    throw new Error(`Falta ${variable} en el entorno o en .env.`);
  }

  return {
    modelName: MODELS[provider],
    apiKey,
  };
}

export async function runLoginScenario({
  provider,
  interaction,
  observeFirst = false,
}: LoginScenarioOptions) {
  const browser = await localBrowser.launch(BROWSER_OPTIONS);
  let stagehand: Stagehand | undefined;

  try {
    stagehand = await Stagehand.create({
      browser,
      model: getModel(provider),
    });

    const page = await browser.context.newPage(TARGET_URL);

    if (observeFirst) {
      const { data: actions } = await stagehand.observe(
        "Identify the username input, password input, and Login button on this page",
        { page },
      );
      console.log("Acciones observadas:", actions.map((action) => action.description));
    }

    if (interaction === "agent") {
      await stagehand.act(
        `Fill the username field with ${VALID_USER.username}`,
        { page },
      );
      await stagehand.act(
        `Fill the password field with ${VALID_USER.password}`,
        { page },
      );
      await stagehand.act("Click the Login button", { page });
    }

    const rawObservedMessage = interaction === "deterministic"
      ? await loginWithDeterministicSelectors(page)
      : await (async () => {
        await page.waitForSelector("#flash", { state: "visible", timeout: 15_000 });
        return await page.locator("#flash").innerText();
      })();
    const observedMessage = rawObservedMessage.replace(/\s*[×✖]\s*$/, "").trim();
    if (!observedMessage.includes(EXPECTED_LOGIN_MESSAGE)) {
      throw new Error(`Login fallido. Mensaje observado: ${observedMessage}`);
    }

    const { data: extraction } = await stagehand.extract(
      "Extract the login result message from the visible flash banner",
      messageSchema,
      { page, locator: page.locator("#flash") },
    );

    const extractedMessage = extraction.message.trim();
    if (extractedMessage !== observedMessage) {
      throw new Error(
        `La extracción no coincide con el banner. Banner: ${observedMessage}; extracción: ${extractedMessage}`,
      );
    }

    const result = {
      scenario: "login",
      provider,
      model: MODELS[provider],
      interaction,
      targetUrl: TARGET_URL,
      status: "passed",
      expectedMessage: EXPECTED_LOGIN_MESSAGE,
      observedMessage,
      extractedMessage,
      actualOutput: `Login succeeded. The page displayed: ${observedMessage}`,
      recordedAt: new Date().toISOString(),
    };

    const artifactDirectory = resolve(process.cwd(), "artifacts");
    await mkdir(artifactDirectory, { recursive: true });
    await writeFile(
      resolve(artifactDirectory, "login-result.json"),
      `${JSON.stringify(result, null, 2)}\n`,
      "utf8",
    );

    console.log("Resultado validado:", result);
    console.log("Evidencia guardada en artifacts/login-result.json");
    return result;
  } finally {
    if (stagehand) await stagehand.close();
    await browser.close();
  }
}
