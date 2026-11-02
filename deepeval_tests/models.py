import os
from dotenv import load_dotenv
from deepeval.models import GeminiModel, OllamaModel, OpenAIModel


def get_evaluation_model():
    """Build a current DeepEval provider model from the project .env settings."""
    load_dotenv()
    provider = os.getenv("EVAL_PROVIDER", "gemini").strip().lower()

    if provider == "gemini":
        return GeminiModel(
            model=os.getenv("GEMINI_EVAL_MODEL", "gemini-3.8-flash"),
        )

    if provider == "openai":
        return OpenAIModel(
            model=os.getenv("OPENAI_EVAL_MODEL", "gpt-5.4"),
        )

    if provider == "ollama":
        return OllamaModel(
            model=os.getenv("OLLAMA_MODEL", "qwen3.5:4b").removeprefix("ollama/"),
            base_url=os.getenv("OLLAMA_BASE_URL", "http://127.0.0.1:11434"),
            temperature=0,
        )

    raise ValueError(
        f"EVAL_PROVIDER no soportado: {provider}. Usa gemini, openai u ollama."
    )
