import { useState } from "react";
import ManageEvents from "../components/ManageEvents";
import EventModal from "../components/EventModal";
import EventViewModal from "../components/EventViewModal";
import EventCreateModal from "../components/EventCreateModal";
import toast from "react-hot-toast";

export default function Events() {
  const [events, setEvents] = useState([
    { id: "e1", name: "Vendor Meetup", date: "2026-01-15", status: "Upcoming" },
    { id: "e2", name: "Team Hackathon", date: "2026-01-20", status: "Ongoing" },
    { id: "e3", name: "Compliance Review", date: "2025-12-30", status: "Completed" },
  ]);

  const [editingEvent, setEditingEvent] = useState(null);
  const [viewingEvent, setViewingEvent] = useState(null);
  const [creatingEvent, setCreatingEvent] = useState(false);

  const handleView = (id) => setViewingEvent(events.find((e) => e.id === id));
  const handleEdit = (id) => setEditingEvent(events.find((e) => e.id === id));
  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success("Event deleted successfully!");
  };
  const handleSave = (updatedEvent) => {
    setEvents(events.map((e) => (e.id === updatedEvent.id ? updatedEvent : e)));
    toast.success("Event updated successfully!");
  };
  const handleCreate = (newEvent) => {
    setEvents([newEvent, ...events]);
    toast.success("Event created successfully!");
  };

  return (
    <div>
      {/* Header */}
      <div className="relative rounded-xl p-[2px] bg-gradient-to-r from-cyan-500 via-blue-500 to-purple-500 shadow mb-6">
        <div className="bg-[#0b0f14] rounded-xl px-6 py-4 flex justify-between">
         <h1 className="text-xl font-bold">
  <span className="text-cyan-400">Scylla Racing</span>
  <span className="text-white"> — Manage Events</span>
</h1>

          <button
            onClick={() => setCreatingEvent(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 rounded-lg"
          >
            + Create Event
          </button>
        </div>
      </div>

      {/* Events Table */}
      <ManageEvents
        events={events}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

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
