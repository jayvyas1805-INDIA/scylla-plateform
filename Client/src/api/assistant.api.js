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

export default assistantApi;
