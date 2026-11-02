from deepeval import assert_test
from deepeval.test_case import LLMTestCase
from deepeval.metrics import TaskCompletionMetric
from deepeval_tests.common import load_login_result
from deepeval_tests.models import get_evaluation_model


def test_agent_task_completion_login():
    """Evalúa el resultado real producido por el flujo Stagehand."""
    evaluation_model = get_evaluation_model()
    result = load_login_result()

    test_case = LLMTestCase(
        input="Log in to the demo site and report the result displayed on the page.",
        actual_output=result["actualOutput"],
        expected_output=f"Login succeeded and the page displayed: {result['expectedMessage']}",
    )

    task_completion = TaskCompletionMetric(
        task="Log in with the valid demo credentials and report the success banner.",
        model=evaluation_model,
        threshold=0.7,
    )
    assert_test(test_case, [task_completion])
