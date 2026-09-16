import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { streamAssistantMessage } from "../../api/assistant.api";
import "./ChatWidget.css";

const SUGGESTED_QUESTIONS = [
  "What is Scylla?",
  "What can I do here?",
  "Where can I see the teams?",
  "How does the vendor marketplace work?",
];

// Derives a lightweight, non-sensitive page context from the current
// route so the assistant can reason about "this team" / "my vehicles"
// etc. without us shipping private frontend state to it. Keys here
// must match app/orchestrator/chain.py's _PAGE_CONTEXT_HINTS table on
// the backend (falls back to a generic route-only note if a route
// isn't mapped, so an unmapped page degrades gracefully rather than
// breaking).
const STATIC_ROUTE_CONTEXT = {
  "/teams-directory": "teams_directory",
  "/vendors-directory": "vendors_directory",
  "/team/home": "my_team_home",
  "/team/profile": "my_team_profile",
  "/team/profilee": "my_team_profile",
  "/team/members": "my_team_members",
  "/team/vehicles": "my_team_vehicles",
  "/team/marketplace": "my_team_marketplace",
  "/team/messages": "my_team_messages",
  "/vendor/home": "my_vendor_home",
  "/vendor/myProfile": "my_vendor_profile",
  "/vendor/profile": "my_vendor_profile",
  "/vendor/product": "my_vendor_products",
  "/vendor/quote": "my_vendor_quotes",
};

function derivePageContext(pathname, params) {
  if (pathname.startsWith("/teams-directory/") && params.teamId) {
    return { route: pathname, entity_type: "team", entity_id: params.teamId };
  }
  if (pathname.startsWith("/vendors-directory/") && params.vendorId) {
    return { route: pathname, entity_type: "vendor", entity_id: params.vendorId };
  }

  const entityType = STATIC_ROUTE_CONTEXT[pathname] || null;
  return { route: pathname, entity_type: entityType, entity_id: null };
}

function ComparisonCard({ comparison }) {
  const { a, b } = comparison;
  const keys = Object.keys(a).filter((k) => k !== "name");

  return (
    <div className="scylla-chat-comparison">
      <div className="scylla-chat-comparison-header">
        <span></span>
        <span>{a.name}</span>
        <span>{b.name}</span>
      </div>
      {keys.map((key) => (
        <div className="scylla-chat-comparison-row" key={key}>
          <span className="scylla-chat-comparison-label">{key}</span>
          <span>{String(a[key])}</span>
          <span>{String(b[key])}</span>
        </div>
      ))}
    </div>
  );
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const location = useLocation();
  const params = useParams();
  const navigate = useNavigate();
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

    let assistantIndex;
    let receivedAny = false;

    setMessages((prev) => {
      assistantIndex = prev.length;
      return [...prev, { role: "assistant", content: "" }];
    });

    try {
      const historyForApi = nextMessages
        .slice(-12)
        .map(({ role, content }) => ({ role, content }));

      let pendingRoute = null;

      await streamAssistantMessage(trimmed, historyForApi, pageContext, {
        onToken: (token) => {
          receivedAny = true;
          setMessages((prev) => {
            const copy = [...prev];
            copy[assistantIndex] = {
              ...copy[assistantIndex],
              content: copy[assistantIndex].content + token,
            };
            return copy;
          });
        },
        onComparison: (comparison) => {
          receivedAny = true;
          setMessages((prev) => [...prev, { role: "comparison", comparison }]);
        },
        onNavigate: ({ route }) => {
          // Captured, not acted on immediately — let the reply text finish
          // rendering first so the navigation doesn't cut off mid-sentence.
          pendingRoute = route;
        },
      });

      if (!receivedAny) {
        // Stream ended with no tokens at all — drop the empty bubble
        // rather than leaving a blank message in the transcript.
        setMessages((prev) => prev.filter((_, i) => i !== assistantIndex));
        setError("The assistant didn't return a response. Please try again.");
      }

      if (pendingRoute) {
        setTimeout(() => navigate(pendingRoute), 600);
      }
    } catch (err) {
      // A failure here can happen AFTER real content already streamed
      // successfully into this bubble (e.g. a late error on a trailing
      // step). Only remove the bubble if it's still genuinely empty —
      // destroying an answer the user already saw arrive, just because
      // something failed afterward, is worse than leaving a partial
      // answer visible.
      if (!receivedAny) {
        setMessages((prev) => prev.filter((_, i) => i !== assistantIndex));
      }

      const status = err?.response?.status;
      let friendly = receivedAny
        ? "That answer may be incomplete — something interrupted the response."
        : "Something went wrong. Please try again in a moment.";
      if (status === 401 || status === 403) {
        friendly = "Please log in to ask about that.";
      } else if (status === 429) {
        friendly = "You're sending messages a bit fast — please wait a moment and try again.";
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

            {messages.map((m, i) => {
              if (m.role === "comparison") {
                return <ComparisonCard key={i} comparison={m.comparison} />;
              }
              return (
                <div key={i} className={`scylla-chat-bubble scylla-chat-bubble-${m.role}`}>
                  {m.content || (isLoading && i === messages.length - 1 ? (
                    <span className="scylla-chat-typing"><span></span><span></span><span></span></span>
                  ) : null)}
                </div>
              );
            })}

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
