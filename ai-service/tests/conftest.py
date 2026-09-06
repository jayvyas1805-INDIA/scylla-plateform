import pytest


class ScriptedLLM:
    """
    A fake chat model whose astream() output is scripted in advance, so
    tests can drive the orchestrator through specific tool-call / final-
    answer sequences deterministically, with no network or API key
    required. Each entry in `turns` is a list of AIMessageChunk-like
    objects representing one full LLM turn's streamed output.
    """

    def __init__(self, turns):
        self._turns = turns
        self._call_index = 0
        self.received_messages = []  # for assertions on what was sent to the model

    def bind_tools(self, tools, tool_choice=None):
        self._bound_tools = tools
        self.tool_choice_calls = getattr(self, "tool_choice_calls", [])
        self.tool_choice_calls.append(tool_choice)
        return self

    def astream(self, messages):
        self.received_messages.append(list(messages))
        turn = self._turns[self._call_index]
        self._call_index += 1

        async def gen():
            for chunk in turn:
                yield chunk

        return gen()


@pytest.fixture
def make_scripted_llm():
    return ScriptedLLM
