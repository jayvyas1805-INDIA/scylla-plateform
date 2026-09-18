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
  eventType: e.eventType || "other",
  date: e.date ? e.date.slice(0, 10) : "",
  startTime: e.startTime || "",
  endTime: e.endTime || "",
  location: e.location || "",
  venue: e.venue || "",
  organizer: e.organizer || "",
  contactEmail: e.contactEmail || "",
  registrationUrl: e.registrationUrl || "",
  capacity: e.capacity ?? "",
  entryFee: e.entryFee || "",
  requirements: e.requirements || "",
  organizerType: e.organizerType || "guest",
  submittedByName: e.submittedByName || e.organizer || "",
  submittedByEmail: e.submittedByEmail || e.contactEmail || "",
  registrationCount: e.registrations?.length || 0,
  registrations: e.registrations || [],
  participantCount: e.registrations?.length || 0,
  description: e.description || "",
  posterUrl: e.posterUrl || "",
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
        eventType: updatedEvent.eventType,
        date: updatedEvent.date,
        startTime: updatedEvent.startTime,
        endTime: updatedEvent.endTime,
        location: updatedEvent.location,
        venue: updatedEvent.venue,
        organizer: updatedEvent.organizer,
        contactEmail: updatedEvent.contactEmail,
        registrationUrl: updatedEvent.registrationUrl,
        capacity: updatedEvent.capacity === "" ? null : Number(updatedEvent.capacity),
        entryFee: updatedEvent.entryFee,
        requirements: updatedEvent.requirements,
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

  const guestRegistrations = events.flatMap((event) =>
    event.registrations
      .filter((registration) => registration.attendeeType === "guest")
      .map((registration) => ({ ...registration, eventName: event.name, eventDate: event.date }))
  );

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

      {!loading && (
        <section className="mt-6 bg-admin-bg border border-admin-border rounded-2xl overflow-hidden">
          <div className="px-6 py-4 bg-admin-surface-raised border-b border-admin-border flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-admin-text">Guest registrations</h2>
              <p className="text-xs text-admin-muted mt-1">Guest contacts available for event follow-up and marketing.</p>
            </div>
            <span className="text-sm text-admin-accent">{guestRegistrations.length} guests</span>
          </div>
          {guestRegistrations.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-admin-muted border-b border-admin-border">
                  <tr><th className="px-6 py-3">Guest</th><th className="px-6 py-3">Email</th><th className="px-6 py-3">Mobile</th><th className="px-6 py-3">Event</th><th className="px-6 py-3">Members</th><th className="px-6 py-3">Vehicle</th></tr>
                </thead>
                <tbody>
                  {guestRegistrations.map((guest) => (
                    <tr key={`${guest.eventName}-${guest.email}`} className="border-b border-admin-border hover:bg-white/[0.03]">
                      <td className="px-6 py-3 text-admin-text">{guest.name}</td>
                      <td className="px-6 py-3 text-admin-accent">{guest.email}</td>
                      <td className="px-6 py-3 text-admin-muted">{guest.phone || "-"}</td>
                      <td className="px-6 py-3 text-admin-text">{guest.eventName}</td>
                      <td className="px-6 py-3 text-admin-muted">{guest.memberCount || 1}</td>
                      <td className="px-6 py-3 text-admin-muted">{guest.vehicleClass || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="px-6 py-5 text-sm text-admin-muted">No guest registrations yet.</p>}
        </section>
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
