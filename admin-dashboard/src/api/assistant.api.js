// Same AI service as the main Client (ai-service/), just called with the
// admin panel's own token key ("adminToken", see src/api/api.js) instead
// of the Client's "token" — the AI service doesn't care which app calls
// it, only what role the JWT it's forwarded decodes to.

export const streamAssistantMessage = async (message, history, pageContext, onToken) => {
  const baseURL = import.meta.env.VITE_ai_backend_url || "http://localhost:8000";
  const token = localStorage.getItem("adminToken");

  const res = await fetch(`${baseURL}/api/assistant/message/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ message, history, page_context: pageContext }),
  });

  if (!res.ok) {
    const err = new Error("Assistant request failed");
    err.response = { status: res.status };
    throw err;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });
    const events = buffer.split("\n\n");
    buffer = events.pop();

    for (const raw of events) {
      if (raw.startsWith("event: done")) return;
      const line = raw.split("\n").find((l) => l.startsWith("data: "));
      if (!line) continue;
      const text = line.slice("data: ".length).replace(/\\n/g, "\n");
      if (text.startsWith("[error]")) {
        const err = new Error(text);
        err.response = { status: 502 };
        throw err;
      }
      onToken(text);
    }
  }
};
