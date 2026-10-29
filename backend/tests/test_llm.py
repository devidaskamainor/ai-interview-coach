import json
import os
import unittest
from unittest.mock import patch

import httpx
from groq import Groq


# Tests use an in-memory HTTP transport and never call Groq or Supabase.
with patch.dict(os.environ, {
    "GROQ_API_KEY": "test-groq-key",
    "SUPABASE_URL": "https://example.supabase.co",
    "SUPABASE_SERVICE_KEY": "test-service-key",
}):
    from app import llm


class GroqInterviewTests(unittest.TestCase):
    def setUp(self):
        self.requests = []
        self.replies = []
        self.http_client = httpx.Client(transport=httpx.MockTransport(self.handle_request))
        self.client = Groq(api_key="test-groq-key", http_client=self.http_client, max_retries=0)
        self.client_patch = patch.object(llm, "client", self.client)
        self.client_patch.start()

    def tearDown(self):
        self.client_patch.stop()
        self.client.close()

    def handle_request(self, request):
        self.assertEqual(request.url.path, "/openai/v1/chat/completions")
        self.requests.append(json.loads(request.content))
        reply = self.replies.pop(0)
        if isinstance(reply, Exception):
            raise reply
        return reply

    def enqueue(self, content, finish_reason="stop"):
        self.replies.append(httpx.Response(200, json={
            "id": "chatcmpl-test",
            "object": "chat.completion",
            "created": 0,
            "model": "openai/gpt-oss-20b",
            "choices": [{
                "index": 0,
                "finish_reason": finish_reason,
                "message": {"role": "assistant", "content": content},
            }],
        }))

    def test_question_scoring_and_summary_flow(self):
        questions = [
            {"question": f"Explain concept {i}.", "topic": "Python", "ideal_points": ["Example"]}
            for i in range(3)
        ]
        self.enqueue(json.dumps({"questions": questions}))
        self.enqueue(json.dumps({
            "rubric": {"technical_accuracy": 12, "completeness": 6, "clarity": -3, "structure": 8},
            "strengths": ["Accurate example"],
            "improvements": ["Explain more clearly"],
            "missing_points": ["Trade-offs"],
            "suggested_answer": "Explain the concept, then give an example.",
        }))
        summary = {"summary": "Keep practicing.", "strengths": [], "improvements": [], "next_steps": ["Review Python"]}
        self.enqueue(json.dumps(summary))

        generated = llm.generate_questions("Python Developer", "beginner", 3)
        self.assertEqual(generated, questions)
        result = llm.evaluate_answer("Python Developer", "beginner", generated[0]["question"], ["Example"], "My example")
        self.assertEqual(result["technical_score"], 8)
        self.assertEqual(result["communication_score"], 4)
        self.assertEqual(result["score"], 60)
        self.assertEqual(result["feedback"]["missing_points"], ["Trade-offs"])
        self.assertEqual(llm.summarize_session("Python Developer", "beginner", [result]), summary)
        self.assertIn(llm.SAFETY_NOTE, self.requests[1]["messages"][0]["content"])
        self.assertIn("<candidate_answer>\nMy example\n</candidate_answer>", self.requests[1]["messages"][1]["content"])

    def test_invalid_json_is_rejected_before_persistence(self):
        for content in ('', '{"questions":', '[]', 'null'):
            with self.subTest(content=content):
                self.enqueue(content)
                with self.assertRaisesRegex(ValueError, "invalid response"):
                    llm._complete_json("Return JSON", "Test")

    def test_truncated_response_is_rejected_even_if_json_is_valid(self):
        self.enqueue('{"questions": []}', finish_reason="length")
        with self.assertRaisesRegex(ValueError, "incomplete"):
            llm._complete_json("Return JSON", "Test")

    def test_empty_choices_are_reported(self):
        self.replies.append(httpx.Response(200, json={
            "id": "empty", "object": "chat.completion", "created": 0,
            "model": "openai/gpt-oss-20b", "choices": [],
        }))
        with self.assertRaisesRegex(ValueError, "no answer"):
            llm._complete_json("Return JSON", "Test")

    def test_api_errors_are_actionable_and_do_not_expose_provider_payloads(self):
        for status, expected in ((401, "GROQ_API_KEY"), (429, "quota"), (500, "GROQ_MODEL")):
            with self.subTest(status=status):
                self.replies.append(httpx.Response(status, json={"error": {"message": "gsk-sensitive-marker"}}))
                with self.assertRaisesRegex(RuntimeError, expected) as raised:
                    llm._complete_json("Return JSON", "Test")
                self.assertNotIn("gsk-sensitive-marker", str(raised.exception))

    def test_network_failures_are_actionable(self):
        for error, expected in ((httpx.ReadTimeout("timeout"), "too long"), (httpx.ConnectError("offline"), "internet connection")):
            with self.subTest(error=type(error).__name__):
                self.replies.append(error)
                with self.assertRaisesRegex(RuntimeError, expected):
                    llm._complete_json("Return JSON", "Test")


if __name__ == "__main__":
    unittest.main()
