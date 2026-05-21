from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric

from deepeval_tests.common import load_login_context
from deepeval_tests.models import get_evaluation_model


def test_rag_login_response():
    """
    Evalúa una respuesta de chatbot/agente que usa contexto RAG
    para explicar si el login fue exitoso.
    """

    evaluation_model = get_evaluation_model()

    rag_context = [load_login_context()]

    test_case = LLMTestCase(
        input="¿El login fue exitoso?",
        actual_output=(
            "Sí, el login fue exitoso porque la página mostró el mensaje: "
            "You logged into a secure area!"
        ),
        expected_output="Sí, el login fue exitoso.",
        retrieval_context=rag_context
    )

    metrics = [
        AnswerRelevancyMetric(
            threshold=0.7,
            model=evaluation_model
        ),

        FaithfulnessMetric(
            threshold=0.7,
            model=evaluation_model
        )
    ]

    assert_test(test_case, metrics)