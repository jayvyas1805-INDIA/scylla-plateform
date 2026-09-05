import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { streamAssistantMessage } from "../../api/assistant.api";
import "./ChatWidget.css";

const SUGGESTED_QUESTIONS = [
  "What is Scylla?",
  "Show me the admin dashboard stats",
  "How does vendor approval work?",
  "How does team approval work?",
];

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading, isOpen]);

  const pageContext = { route: location.pathname, entity_type: null, entity_id: null };

  async function handleSend(text) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setError(null);
    const nextMessages = [...messages, { role: "user", content: trimmed }];
    setMessages(nextMessages);
    setInput("");
    setIsLoading(true);

    let assistantIndex;
    setMessages((prev) => {
      assistantIndex = prev.length;
      return [...prev, { role: "assistant", content: "" }];
    });

    try {
      const historyForApi = nextMessages
        .slice(-12)
        .map(({ role, content }) => ({ role, content }));

      let receivedAny = false;

      await streamAssistantMessage(trimmed, historyForApi, pageContext, (token) => {
        receivedAny = true;
        setMessages((prev) => {
          const copy = [...prev];
          copy[assistantIndex] = {
            ...copy[assistantIndex],
            content: copy[assistantIndex].content + token,
          };
          return copy;
        });
      });

      if (!receivedAny) {
        setMessages((prev) => prev.filter((_, i) => i !== assistantIndex));
        setError("The assistant didn't return a response. Please try again.");
      }
    } catch (err) {
      setMessages((prev) => prev.filter((_, i) => i !== assistantIndex));

      const status = err?.response?.status;
      let friendly = "Something went wrong. Please try again in a moment.";
      if (status === 401 || status === 403) {
        friendly = "Please log in as admin to ask about that.";
      } else if (status === 429) {
        friendly = "You're sending messages a bit fast — please wait a moment and try again.";
      } else if (status === 503) {
        friendly = "The assistant isn't set up yet — check back soon.";
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
    <div className="scylla-admin-chat-root">
      {isOpen && (
        <div className="scylla-admin-chat-window" role="dialog" aria-label="Scylla AI Assistant">
          <div className="scylla-admin-chat-header">
            <span className="scylla-admin-chat-title">Scylla Assistant</span>
            <div className="scylla-admin-chat-header-actions">
              <button
                className="scylla-admin-chat-icon-btn"
                onClick={clearConversation}
                title="Clear conversation"
                aria-label="Clear conversation"
              >
                ⟲
              </button>
              <button
                className="scylla-admin-chat-icon-btn"
                onClick={() => setIsOpen(false)}
                title="Close"
                aria-label="Close chat"
              >
                ✕
              </button>
            </div>
          </div>

          <div className="scylla-admin-chat-messages" ref={scrollRef}>
            {messages.length === 0 && (
              <div className="scylla-admin-chat-empty">
                <p>Ask about Scylla data — teams, vendors, approvals, or dashboard stats.</p>
                <div className="scylla-admin-chat-suggestions">
                  {SUGGESTED_QUESTIONS.map((q) => (
                    <button
                      key={q}
                      className="scylla-admin-chat-suggestion"
                      onClick={() => handleSend(q)}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={`scylla-admin-chat-bubble scylla-admin-chat-bubble-${m.role}`}>
                {m.content || (isLoading && i === messages.length - 1 ? (
                  <span className="scylla-admin-chat-typing"><span></span><span></span><span></span></span>
                ) : null)}
              </div>
            ))}

            {error && <div className="scylla-admin-chat-error">{error}</div>}
          </div>

          <div className="scylla-admin-chat-input-row">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask the Scylla assistant..."
              disabled={isLoading}
            />
            <button
              className="scylla-admin-chat-send-btn"
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
        className="scylla-admin-chat-fab"
        onClick={() => setIsOpen((v) => !v)}
        aria-label={isOpen ? "Close Scylla Assistant" : "Open Scylla Assistant"}
      >
        {isOpen ? "✕" : "💬"}
      </button>
    </div>
  );
}
