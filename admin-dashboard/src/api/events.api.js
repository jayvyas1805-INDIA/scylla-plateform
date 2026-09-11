import api from "./api";

export const getEvents = (status) =>
  api.get("/api/events", { params: status ? { status } : {} });

export const getEventById = (id) => api.get(`/api/events/${id}`);

export const createEvent = (data) => api.post("/api/events", data);

export const updateEvent = (id, data) => api.put(`/api/events/${id}`, data);

export const deleteEvent = (id) => api.delete(`/api/events/${id}`);

export const approveEvent = (id) => api.put(`/api/events/${id}/approve`);

export const rejectEvent = (id) => api.put(`/api/events/${id}/reject`);
