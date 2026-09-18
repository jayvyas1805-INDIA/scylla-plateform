import api from "./api";

export const getApprovedEvents = (params = {}) => api.get("/api/public/events", { params });

export const submitEvent = (data) => api.post("/api/public/events", data);

export const registerForEvent = (id, data) => api.post(`/api/public/events/${id}/register`, data);
