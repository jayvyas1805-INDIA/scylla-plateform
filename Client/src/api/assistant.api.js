import axios from "axios";

// Separate deployable service from the main Express backend — its own
// base URL, configured the same way api.js configures VITE_backend_url.
const assistantApi = axios.create({
  baseURL: import.meta.env.VITE_ai_backend_url || "http://localhost:8000",
  withCredentials: true,
});

// Same token, same header shape as the main api instance — the AI
// service forwards this same JWT to Express when it needs Scylla data,
// so a user's existing session "just works" with the assistant too.
assistantApi.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const sendAssistantMessage = (message, history = [], pageContext = null) => {
  return assistantApi.post("/api/assistant/message", {
    message,
    history,
    page_context: pageContext,
  });
};

// Axios doesn't stream response bodies cleanly in the browser, so the
// streaming endpoint is called with plain fetch instead. onToken fires
// for each piece of text as it arrives; the returned promise resolves
// once the stream's "done" event is received (or rejects on network/
// HTTP failure, mirroring axios's error shape closely enough for the
// widget's existing error handling to work unchanged).
export const streamAssistantMessage = async (message, history, pageContext, onToken) => {
  const baseURL = import.meta.env.VITE_ai_backend_url || "http://localhost:8000";
  const token = localStorage.getItem("token");

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
    buffer = events.pop(); // last (possibly incomplete) event stays buffered

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

export default assistantApi;
