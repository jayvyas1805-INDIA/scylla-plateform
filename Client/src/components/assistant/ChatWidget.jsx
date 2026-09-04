import { useEffect, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { sendAssistantMessage } from "../../api/assistant.api";
import "./ChatWidget.css";

const SUGGESTED_QUESTIONS = [
  "What is Scylla?",
  "What can I do here?",
  "Where can I see the teams?",
  "How does the vendor marketplace work?",
];

// Derives a lightweight, non-sensitive page context from the current
// route so the assistant can reason about "this team" / "this vehicle"
// without us shipping private frontend state to it.
function derivePageContext(pathname, params) {
  if (pathname.startsWith("/teams-directory/") && params.teamId) {
    return { route: pathname, entity_type: "team", entity_id: params.teamId };
  }
  if (pathname.startsWith("/vendors-directory/") && params.vendorId) {
    return { route: pathname, entity_type: "vendor", entity_id: params.vendorId };
  }
  return { route: pathname, entity_type: null, entity_id: null };
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const params = useParams();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const pageContext = derivePageContext(location.pathname, params);

  async function handleSend(text) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    try {
      const historyForApi = nextMessages
        .slice(-12)
        .map(({ role, content }) => ({ role, content }));

      const res = await sendAssistantMessage(trimmed, historyForApi, pageContext);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
    } catch (err) {
      const status = err?.response?.status;
      let friendly = "Something went wrong. Please try again in a moment.";
      if (status === 401 || status === 403) {
        friendly = "Please log in to ask about that.";
      } else if (status === 503) {
        friendly = "The assistant isn't set up yet — check back soon.";
      } else if (err?.code === "ECONNABORTED") {
        friendly = "That took too long to answer. Please try again.";
      } else if (!err?.response) {
        friendly = "Can't reach the assistant right now — check your connection.";
      }
      setError(friendly);
    } finally {
      setIsLoading(false);
    }
  }

  function handleKeyDown(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  }

  function clearConversation() {
    setMessages([]);
    setError(null);
  }

  return (
    <div className="scylla-chat-root">
      {isOpen && (
        <div className="scylla-chat-window" role="dialog" aria-label="Scylla AI Assistant">
          <div className="scylla-chat-header">
            <span className="scylla-chat-title">Scylla Assistant</span>
            <div className="scylla-chat-header-actions">
              <button
                className="scylla-chat-icon-btn"
                onClick={clearConversation}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                ⟲
              </button>
              <button
                className="scylla-chat-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="scylla-chat-messages" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="scylla-chat-empty">
                <p>Ask me about Scylla — teams, vehicles, vendors, or how to find your way around.</p>
                <div className="scylla-chat-suggestions">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      className="scylla-chat-suggestion"
                      onClick={() => handleSend(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`scylla-chat-bubble scylla-chat-bubble-${m.role}`}>
                {m.content}
              </div>
            ))}

            {isLoading && (
              <div className="scylla-chat-bubble scylla-chat-bubble-assistant scylla-chat-typing">
                <span></span><span></span><span></span>
              </div>
            )}

            {error && <div className="scylla-chat-error">{error}</div>}
          </div>

          <div className="scylla-chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Scylla assistant..."
              disabled={isLoading}
            />
            <button
              className="scylla-chat-send-btn"
              onClick={() => handleSend(input)}
              disabled={isLoading || !input.trim()}
              aria-label="Send"
            >
              ➤
            </button>
          </div>
        </div>
      )}

      <button
        className="scylla-chat-fab"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close Scylla Assistant" : "Open Scylla Assistant"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
