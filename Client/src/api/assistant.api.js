import axios from "axios";

// Separate deployable service from the main Express backend — its own
// base URL, configured the same way api.js configures VITE_backend_url.
const assistantApi = axios.create({
  baseURL: import.meta.env.VITE_ai_backend_url || "http://127.0.0.1:8000",
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
export const streamAssistantMessage = async (
  message,
  history,
  pageContext,
  callbacks = {}
) => {
  const {
    onToken,
    onComparison,
    onNavigate,
  } = callbacks;

  const baseURL =
    import.meta.env.VITE_ai_backend_url || "http://localhost:8000";

  const token = localStorage.getItem("token");

  const res = await fetch(
    `${baseURL}/api/assistant/message/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "text/event-stream",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        message,
        history,
        page_context: pageContext,
      }),
    }
  );

  if (!res.ok) {
    const err = new Error("Assistant request failed");
    err.response = { status: res.status };
    throw err;
  }

  if (!res.body) {
    const err = new Error("Assistant returned no stream");
    err.response = { status: 502 };
    throw err;
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder("utf-8");

  let buffer = "";
  let finished = false;

  while (!finished) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });

    // Handle both LF and CRLF SSE formatting.
    const events = buffer.split(/\r?\n\r?\n/);
    buffer = events.pop() || "";

    for (const rawEvent of events) {
      const lines = rawEvent.split(/\r?\n/);

      let eventType = "message";
      const dataLines = [];

      for (const line of lines) {
        if (line.startsWith("event:")) {
          eventType = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          const value = line.startsWith("data: ")
            ? line.slice(6)
            : line.slice(5);

          dataLines.push(value);
        } else if (line.startsWith("data:")) {
          dataLines.push(line.slice(5));
        }
      }

      const data = dataLines.join("\n");

      // Backend finished the response.
      if (eventType === "done") {
        finished = true;
        break;
      }

      if (!data) {
        continue;
      }

      // Backend reported an error through SSE. A "[error:429]" prefix
      // means the LLM provider itself rate-limited us (distinct from an
      // actual crash) — surfaced as a real 429 so the widget's existing
      // "you're sending messages a bit fast" handling actually fires,
      // instead of every SSE error looking like the same generic outage.
      if (data.startsWith("[error:429]")) {
        const err = new Error(data.slice("[error:429]".length).trim());
        err.response = { status: 429 };
        throw err;
      }
      if (data.startsWith("[error]")) {
        const err = new Error(data);
        err.response = { status: 502 };
        throw err;
      }

      // Normal streamed assistant text.
      if (eventType === "message") {
        onToken?.(data.replace(/\\n/g, "\n"));
      }

      // Navigation action.
      if (eventType === "navigate") {
        try {
          const navigation = JSON.parse(data);
          onNavigate?.(navigation);
        } catch (error) {
          console.error("Invalid navigation event:", data, error);
        }
      }

      // Comparison action.
      if (eventType === "comparison") {
        try {
          const comparison = JSON.parse(data);
          onComparison?.(comparison);
        } catch (error) {
          console.error("Invalid comparison event:", data, error);
        }
      }
    }
  }

  // Flush any remaining decoder bytes.
  decoder.decode();
};

export default assistantApi;
