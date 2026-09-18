
export default function EventViewModal({ event, onClose }) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-start justify-center z-[100] overflow-y-auto p-4 pt-[76px]">
      <div className="bg-admin-surface-raised border border-gray-800 rounded-xl p-5 w-[min(760px,100%)] max-h-[calc(100vh-92px)] overflow-y-auto">
        <div className="flex items-center justify-between gap-4 mb-4">
          <h2 className="text-lg font-semibold text-admin-accent">Event Details</h2>
          <button onClick={onClose} className="px-3 py-1 rounded-lg bg-white/10 text-white hover:bg-white/20">Close</button>
        </div>
        {event.posterUrl && <img src={event.posterUrl} alt={`${event.name} poster`} className="w-full h-32 object-cover rounded-lg mb-4" />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-3 text-white text-sm">
          <div className="sm:col-span-2">
            <span className="text-gray-400 text-sm">Event Name:</span>
            <p className="font-medium">{event.name}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Type:</span>
            <p className="font-medium capitalize">{(event.eventType || "other").replace("-", " ")}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Date:</span>
            <p className="font-medium">{event.date}</p>
          </div>
          {(event.startTime || event.endTime) && (
            <div>
              <span className="text-gray-400 text-sm">Schedule:</span>
              <p className="font-medium">{event.startTime || ""}{event.startTime && event.endTime ? " - " : ""}{event.endTime || ""}</p>
            </div>
          )}
          <div>
            <span className="text-gray-400 text-sm">Status:</span>
            <p className="font-medium capitalize">{event.status}</p>
          </div>
          <div>
            <span className="text-gray-400 text-sm">Submitted by:</span>
            <p className="font-medium capitalize">{event.submittedByName} ({event.organizerType})</p>
            {event.submittedByEmail && <p className="text-sm text-gray-400">{event.submittedByEmail}</p>}
          </div>
          {event.location && (
            <div>
              <span className="text-gray-400 text-sm">Location:</span>
              <p className="font-medium">{event.location}</p>
            </div>
          )}
          {event.venue && (
            <div>
              <span className="text-gray-400 text-sm">Venue:</span>
              <p className="font-medium">{event.venue}</p>
            </div>
          )}
          {event.organizer && (
            <div>
              <span className="text-gray-400 text-sm">Organizer:</span>
              <p className="font-medium">{event.organizer}</p>
            </div>
          )}
          {event.contactEmail && (
            <div>
              <span className="text-gray-400 text-sm">Contact:</span>
              <p className="font-medium">{event.contactEmail}</p>
            </div>
          )}
          {(event.capacity !== "" && event.capacity != null) && (
            <div>
              <span className="text-gray-400 text-sm">Capacity:</span>
              <p className="font-medium">{event.capacity} participants</p>
            </div>
          )}
          {event.entryFee && (
            <div>
              <span className="text-gray-400 text-sm">Entry fee:</span>
              <p className="font-medium">{event.entryFee}</p>
            </div>
          )}
          {event.registrationUrl && (
            <div>
              <span className="text-gray-400 text-sm">Registration:</span>
              <a href={event.registrationUrl} target="_blank" rel="noreferrer" className="block font-medium text-admin-accent break-all">{event.registrationUrl}</a>
            </div>
          )}
          {event.requirements && (
            <div>
              <span className="text-gray-400 text-sm">Requirements:</span>
              <p className="font-medium">{event.requirements}</p>
            </div>
          )}
          {event.description && (
            <div className="sm:col-span-2">
              <span className="text-gray-400 text-sm">Description:</span>
              <p className="font-medium">{event.description}</p>
            </div>
          )}
        </div>
        <div className="mt-5 border-t border-gray-800 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-admin-accent">Registrations</h3>
            <span className="text-xs text-gray-400">{event.participantCount || 0}{event.capacity ? ` / ${event.capacity}` : ""} registrations</span>
          </div>
          {event.registrations?.length ? (
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="text-gray-400 border-b border-gray-800">
                  <tr><th className="py-2 pr-3">Name</th><th className="py-2 pr-3">Email</th><th className="py-2 pr-3">Type</th><th className="py-2 pr-3">Members</th><th className="py-2">Vehicle class</th></tr>
                </thead>
                <tbody>
                  {event.registrations.map((registration) => (
                    <tr key={registration._id || registration.email} className="border-b border-gray-800/70">
                      <td className="py-2 pr-3">{registration.name}</td>
                      <td className="py-2 pr-3">{registration.email}</td>
                      <td className="py-2 pr-3 capitalize">{registration.attendeeType}</td>
                      <td className="py-2 pr-3" title={registration.memberNames || ""}>{registration.memberCount || 1}</td>
                      <td className="py-2">{registration.vehicleClass || "-"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : <p className="text-xs text-gray-500">No registrations yet.</p>}
        </div>
      </div>
    </div>
  );
}
