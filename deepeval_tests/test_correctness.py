from deepeval import assert_test
from deepeval.metrics import GEval
from deepeval.test_case import (
    LLMTestCase,
    LLMTestCaseParams,
)

from deepeval_tests.models import get_evaluation_model


def test_login_result_correctness():

    evaluation_model = get_evaluation_model()

    test_case = LLMTestCase(
        input="Interpretar el resultado del login.",
        actual_output="You logged into a secure area!",
        expected_output="You logged into a secure area!"
    )

    correctness = GEval(
        name="Login Result Correctness",
        criteria=(
            "Evalúa si la salida corresponde correctamente "
            "al mensaje esperado después del login."
        ),
        evaluation_params=[
            LLMTestCaseParams.INPUT,
            LLMTestCaseParams.ACTUAL_OUTPUT,
            LLMTestCaseParams.EXPECTED_OUTPUT
        ],
        threshold=0.7,

        # IMPORTANTE
        model=evaluation_model
    )

    assert_test(test_case, [correctness])