from deepeval import assert_test
from deepeval.metrics import ExactMatchMetric
from deepeval.test_case import LLMTestCase

from deepeval_tests.common import load_login_result


def test_login_result_correctness():
    result = load_login_result()
    test_case = LLMTestCase(
        input="Report the login result displayed by the page.",
        actual_output=result["observedMessage"],
        expected_output=result["expectedMessage"],
    )
    correctness = ExactMatchMetric(threshold=1.0)

    assert_test(test_case, [correctness])
