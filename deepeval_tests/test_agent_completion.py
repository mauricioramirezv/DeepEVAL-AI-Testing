from deepeval import assert_test
from deepeval.test_case import LLMTestCase, LLMTestCaseParams
from deepeval.metrics import GEval
from deepeval_tests.common import load_login_context
from deepeval_tests.models import get_evaluation_model


def test_agent_task_completion_login():
    """
    Evalúa si el agente completó correctamente la tarea de login.
    Esta prueba representa el resultado obtenido por Stagehand después de interactuar con la página.
    """

    evaluation_model = get_evaluation_model()

    rag_context = [load_login_context()]

    test_case = LLMTestCase(
        input=(
            "Ejecuta el login en la página con las credenciales válidas "
            "y reporta si fue exitoso."
        ),
        actual_output=(
            "La tarea fue completada. El agente ingresó el usuario tomsmith, "
            "ingresó la contraseña válida, hizo clic en Login y observó el mensaje "
            "You logged into a secure area!"
        ),
        expected_output=(
            "El agente debe completar el login y confirmar que la página mostró "
            "You logged into a secure area!"
        ),
        retrieval_context=rag_context
    )

    task_completion = GEval(
        name="Task Completion",
        criteria=(
            "Evalúa si la respuesta demuestra que el agente completó el login, "
            "usó las credenciales correctas y verificó el mensaje esperado de éxito."
        ),
        evaluation_steps=[
            "Verificar que la respuesta menciona el uso de credenciales válidas.",
            "Verificar que la respuesta menciona la acción de login.",
            "Verificar que la respuesta confirma el mensaje de éxito esperado.",
            "Penalizar respuestas ambiguas o que no validen el resultado final."
        ],
        evaluation_params=[
            LLMTestCaseParams.INPUT,
            LLMTestCaseParams.ACTUAL_OUTPUT,
            LLMTestCaseParams.EXPECTED_OUTPUT,
            LLMTestCaseParams.RETRIEVAL_CONTEXT
        ],
        model=evaluation_model,
        threshold=0.7
    )

    assert_test(test_case, [task_completion])