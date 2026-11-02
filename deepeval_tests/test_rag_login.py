from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import AnswerRelevancyMetric, FaithfulnessMetric

from deepeval_tests.common import load_login_context, load_login_result
from deepeval_tests.models import get_evaluation_model


def test_rag_login_response():
    """Evalúa la respuesta de login real contra el contexto de referencia."""
    evaluation_model = get_evaluation_model()
    rag_context = [load_login_context()]
    result = load_login_result()
    test_case = LLMTestCase(
        input="¿El login fue exitoso?",
        actual_output=result["actualOutput"],
        expected_output=f"Sí. La página mostró {result['expectedMessage']}",
        retrieval_context=rag_context,
    )

    metrics = [
        AnswerRelevancyMetric(threshold=0.7, model=evaluation_model),
        FaithfulnessMetric(threshold=0.7, model=evaluation_model),
    ]

    assert_test(test_case, metrics)
