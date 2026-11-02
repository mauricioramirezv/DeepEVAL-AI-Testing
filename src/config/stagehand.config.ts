import dotenv from "dotenv";

dotenv.config();

export const TARGET_URL = "https://the-internet.herokuapp.com/login";
export const EXPECTED_LOGIN_MESSAGE = "You logged into a secure area!";
export const OLLAMA_BASE_URL = (
  process.env.OLLAMA_BASE_URL || "http://127.0.0.1:11434"
).replace(/\/$/, "");

function modelId(variable: string, fallback: string, provider: string) {
  const configured = process.env[variable] || fallback;
  return configured.replace(new RegExp(`^${provider}/`, "i"), "");
}

// These credentials are public fixtures supplied by the demo site.
export const VALID_USER = {
  username: "tomsmith",
  password: "SuperSecretPassword!",
};

export const MODELS = {
  ollama: modelId("OLLAMA_MODEL", "qwen3.5:4b", "ollama"),
  gemini: `google/${modelId("GEMINI_MODEL", "gemini-3.8-flash", "google")}`,
  openai: `openai/${modelId("OPENAI_MODEL", "gpt-6-astra", "openai")}`,
};

export const BROWSER_OPTIONS = {
  headless: process.env.HEADLESS?.toLowerCase() !== "false",
};
