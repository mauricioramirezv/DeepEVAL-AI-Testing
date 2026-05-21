import dotenv from "dotenv";

dotenv.config();

export const TARGET_URL = "https://the-internet.herokuapp.com/login";

export const VALID_USER = {
    username: "tomsmith",
    password: "SuperSecretPassword!"
};

export const MODELS = {
    ollama: process.env.OLLAMA_MODEL || "ollama/llama3.2:3b",
    gemini: process.env.GEMINI_MODEL || "google/gemini-2.5-flash",
    gpt: process.env.GPT_MODEL || "openai/gpt-4.1-mini"
};

export const BROWSER_OPTIONS = {
    headless: false
};
