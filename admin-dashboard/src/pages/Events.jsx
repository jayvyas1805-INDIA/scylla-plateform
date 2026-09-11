import { useState, useEffect } from "react";
import ManageEvents from "../components/ManageEvents";
import EventModal from "../components/EventModal";
import EventViewModal from "../components/EventViewModal";
import EventCreateModal from "../components/EventCreateModal";
import toast from "react-hot-toast";
import {
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  approveEvent,
  rejectEvent,
} from "../api/events.api";

// Map a backend event doc to the shape the table/modals expect
const mapEvent = (e) => ({
  id: e._id,
  name: e.name,
  date: e.date ? e.date.slice(0, 10) : "",
  location: e.location || "",
  description: e.description || "",
  status: e.status,
});

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const res = await getEvents();
      setEvents((res.data.events || []).map(mapEvent));
    } catch (err) {
      console.error("Failed to load events:", err);
      toast.error("Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();
  }, []);

  const handleView = (id) => setViewingEvent(events.find((e) => e.id === id));
  const handleEdit = (id) => setEditingEvent(events.find((e) => e.id === id));

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete event");
    }
  };

  const handleSave = async (updatedEvent) => {
    try {
      const res = await updateEvent(updatedEvent.id, {
        name: updatedEvent.name,
        date: updatedEvent.date,
        location: updatedEvent.location,
        description: updatedEvent.description,
      });
      const saved = mapEvent(res.data.event);
      setEvents((prev) => prev.map((e) => (e.id === saved.id ? saved : e)));
      toast.success("Event updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event");
    }
  };

  const handleCreate = async (form) => {
    try {
      const res = await createEvent(form);
      const created = mapEvent(res.data.event);
      setEvents((prev) => [created, ...prev]);
      toast.success("Event created — pending approval");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create event");
    }
  };

  const handleApprove = async (id) => {
    try {
      const res = await approveEvent(id);
      const updated = mapEvent(res.data.event);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      toast.success("Event approved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve event");
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await rejectEvent(id);
      const updated = mapEvent(res.data.event);
      setEvents((prev) => prev.map((e) => (e.id === id ? updated : e)));
      toast.success("Event rejected");
    } catch (err) {
      console.error(err);
      toast.error("Failed to reject event");
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-admin-accent via-admin-accent to-admin-accent-dark shadow mb-6">
        <div className="bg-admin-bg rounded-xl px-6 py-4 flex justify-between">
          <h1 className="text-xl font-bold">
            <span className="text-admin-accent">Scylla Racing</span>
            <span className="text-admin-text"> — Manage Events</span>
          </h1>

          <button
            onClick={() => setCreatingEvent(true)}
            className="bg-gradient-to-r from-admin-accent to-admin-accent-dark px-4 py-2 rounded-lg text-white"
          >
            + Create Event
          </button>
        </div>
      </div>

      {/* Events Table */}
      {loading ? (
        <div className="text-admin-muted text-center py-10">Loading events...</div>
      ) : (
        <ManageEvents
          events={events}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onApprove={handleApprove}
          onReject={handleReject}
        />
      )}

      {/* Modals */}
      {editingEvent && (
        <EventModal
          event={editingEvent}
          onClose={() => setEditingEvent(null)}
          onSave={handleSave}
        />
      )}
      {viewingEvent && (
        <EventViewModal
          event={viewingEvent}
          onClose={() => setViewingEvent(null)}
        />
      )}
      {creatingEvent && (
        <EventCreateModal
          onClose={() => setCreatingEvent(false)}
          onCreate={handleCreate}
        />
      )}
    </div>
  );
}
