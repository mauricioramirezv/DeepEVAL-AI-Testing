import json
from pathlib import Path

RESULT_PATH = Path(__file__).resolve().parents[1] / "artifacts" / "login-result.json"


def load_login_context():
    context_path = Path(__file__).resolve().parents[1] / "rag" / "login_context.txt"
    return context_path.read_text(encoding="utf-8")


def load_login_result():
    if not RESULT_PATH.exists():
        raise FileNotFoundError(
            "No existe artifacts/login-result.json. Ejecuta primero un ejemplo "
            "Stagehand (por ejemplo: npm run test:gemini)."
        )

    result = json.loads(RESULT_PATH.read_text(encoding="utf-8"))
    expected_message = result.get("expectedMessage")
    observed_message = result.get("observedMessage", "")
    if (
        result.get("status") != "passed"
        or not result.get("actualOutput")
        or not expected_message
        or expected_message not in observed_message
    ):
        raise ValueError("La evidencia del login no contiene un resultado exitoso válido.")
    return result
