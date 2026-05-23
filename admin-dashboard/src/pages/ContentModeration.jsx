import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  ImagePlus,
  Pencil,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Calendar,
  Search,
} from "lucide-react";
import GroupModerationPanel from "../components/contentModeration/GroupModerationPanel";
import ReviewModerationPanel from "../components/contentModeration/ReviewModerationPanel";
import { saveAdminContent, fetchAdminContent, approveAdminMedia, deleteAdminMedia,updateAdminMedia } from "../api/admin.api";


export default function ContentModeration() {
  // Tabs state
  const [activeTab, setActiveTab] = useState("media");

  // Videos first, then images
  // const [mediaQueue, setMediaQueue] = useState([
  //   {
  //     type: "video",
  //     src: "/istockphoto-2217849428-640_adpp_is.mp4",
  //     title: "Track Walk",
  //     description: "Pre-race footage",
  //     reports: ["Inappropriate content", "Misleading information"],
  //     severity: "High",
  //     uploadedBy: "Velocity Racing Team",
  //     relatedProfile: "Team Profile",
  //     uploadDate: "Dec 23, 2024",
  //   },

  //   {
  //     type: "video",
  //     src: "/istockphoto-2179419363-mp4-480x480-is.mp4",
  //     title: "Race Night",
  //     description: "Night racing cars",
  //     reports: [],
  //     severity: "Low",
  //     uploadedBy: "Velocity Racing Team",
  //     relatedProfile: "Team Profile",
  //     uploadDate: "Dec 23, 2024",
  //   },
  //   {
  //     type: "video",
  //     src: "/istockphoto-1316231170-mp4-480x480-is.mp4",
  //     title: "Pit Lane Clip",
  //     description: "Short clip",
  //     reports: ["Copyright violation"],
  //     severity: "Medium",
  //     uploadedBy: "Velocity Racing Team",
  //     relatedProfile: "Team Profile",
  //     uploadDate: "Dec 23, 2024",
  //   },
  //   {
  //     type: "image",
  //     src: "/helmet.jpg",
  //     title: "Helmet",
  //     description: "Velocity Racing Team",
  //     reports: ["Inappropriate content", "Misleading information"],
  //     severity: "Medium",
  //     uploadedBy: "Velocity Racing Team",
  //     relatedProfile: "Team Profile",
  //     uploadDate: "Dec 23, 2024",
  //   },
  //   {
  //     type: "image",
  //     src: "/racing-car.jpg",
  //     title: "Racing Car",
  //     description: "Scylla Racing Car",
  //     reports: [],
  //     severity: "Low",
  //     uploadedBy: "Velocity Racing Team",
  //     relatedProfile: "Team Profile",
  //     uploadDate: "Dec 23, 2024",
  //   },
  //   {
  //     type: "image",
  //     src: "/RaceTrack.PNG",
  //     title: "Race Track",
  //     description: "Night circuit",
  //     reports: ["Spam/advertising"],
  //     severity: "Low",
  //     uploadedBy: "Velocity Racing Team",
  //     relatedProfile: "Team Profile",
  //     uploadDate: "Dec 23, 2024",
  //   },
  // ]);

  const [mediaQueue, setMediaQueue] = useState([]);


  const [selectedMedia, setSelectedMedia] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterSeverity, setFilterSeverity] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const videoRef = useRef(null);

  const current = mediaQueue[selectedMedia];

  // Autoplay video when selected changes
  useEffect(() => {
    if (current?.type === "video" && videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  }, [selectedMedia]);


  useEffect(() => {
    const loadAdminContent = async () => {
      try {
        const res = await fetchAdminContent();

        const formatted = res.data.content.map(item => ({
          _id: item._id,
          type: item.fileType,
          src: item.fileUrl,
          title: item.title,
          description: item.description,
          severity:
            item.severity.charAt(0).toUpperCase() +
            item.severity.slice(1),
          reports: [],              // admin content has no reports
          uploadedBy: "Admin",
          relatedProfile: "",
          uploadDate: new Date(item.createdAt).toLocaleDateString(),
          status: item.status || "pending",
        }));

        setMediaQueue(formatted);
        setSelectedMedia(0);
      } catch (err) {
        console.error(err);
        toast.error("Failed to load media");
      }
    };

    loadAdminContent();
  }, []);


  const handleApprove = async () => {
    if (!current?._id) return;

    try {
      const res = await approveAdminMedia(current._id);
      console.log(res.data)

      setMediaQueue((prev) =>
        prev.map((item, i) =>
          i === selectedMedia ? { ...item, status: "approved" } : item
        )
      );


      toast.success("Media approved!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to approve media");
    }
  };

  const handleRemove = async () => {
    if (!current?._id) return;

    try {
      // Call API to delete media from DB
      await deleteAdminMedia(current._id);

      // Remove from local state (UI)
      setMediaQueue((prev) => {
        const next = prev.filter((_, i) => i !== selectedMedia);
        setSelectedMedia(0);
        setIsPlaying(false);
        return next;
      });

      toast.success("Media deleted successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.error || "Failed to delete media");
    }
  };


  const prevMedia = () => {
    setSelectedMedia((i) => (i - 1 + mediaQueue.length) % mediaQueue.length);
  };
  const nextMedia = () => {
    setSelectedMedia((i) => (i + 1) % mediaQueue.length);
  };

  const togglePlay = () => {
    setIsPlaying((p) => {
      const next = !p;
      if (videoRef.current) {
        if (next) videoRef.current.play();
        else videoRef.current.pause();
      }
      return next;
    });
  };

  const filteredQueue = mediaQueue.filter(
    (item) =>
      (!filterSeverity || item.severity === filterSeverity) &&
      (!searchQuery ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.uploadedBy.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0b0f14] text-white px-4 sm:px-6 py-4">
      {/* Tabs */}


      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-cyan-400">
          Content Moderation
        </h1>
        <div className="mt-3 flex flex-wrap gap-4 text-sm sm:text-base">

          <button
            onClick={() => setActiveTab("media")}
            className={`hover:text-white ${activeTab === "media"
              ? "text-cyan-400 font-semibold"
              : "text-white/70"
              }`}
          >
            Media Moderation
          </button>

          <button
            onClick={() => setActiveTab("reported")}
            className={`hover:text-white ${activeTab === "reported"
              ? "text-cyan-400 font-semibold"
              : "text-white/70"
              }`}
          >
            Reported Profiles
          </button>

          <button
            onClick={() => setActiveTab("reviews")}
            className={`hover:text-white ${activeTab === "reviews"
              ? "text-cyan-400 font-semibold"
              : "text-white/70"
              }`}
          >
            Reviews & Ratings
          </button>

        </div>
      </div>

      {/* Media Tab */}
      {activeTab === "media" && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Viewer */}
            <div className="lg:col-span-2 bg-[#10151d] rounded-xl border border-gray-800 p-6 shadow-md">
              <div className="relative w-full h-[260px] sm:h-[420px] lg:h-[600px] bg-black rounded-xl">

                {current?.type === "image" ? (
                  <img
                    src={current?.src}
                    alt={current?.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <video
                    ref={videoRef}
                    src={current?.src}
                    className="w-full h-full object-cover"
                    muted
                    controls={false}
                  />
                )}

                {/* Navigation */}
                <button
                  onClick={prevMedia}
                  // className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"
                  className={`absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition
   ${current?.type === "image"
                      ? "bg-black/60 hover:bg-black/80 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                    }
`}

                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={nextMedia}
                  // className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 p-2 rounded-full"
                  className={`absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full transition
   ${current?.type === "image"
                      ? "bg-black/60 hover:bg-black/80 text-white"
                      : "bg-white/10 hover:bg-white/20 text-white"
                    }
`}
                >
                  <ChevronRight size={20} />
                </button>

                {/* Counter */}
                <div className="absolute bottom-4 left-4 bg-white/10 text-white text-xs px-3 py-1 rounded-full">
                  {selectedMedia + 1}/{mediaQueue.length}
                </div>

                {/* Play/Pause */}
                {current?.type === "video" && (
                  <button
                    onClick={togglePlay}
                    className="absolute bottom-4 right-4 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400 p-2 rounded-full"
                  >
                    {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                )}
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">

                <button
                  onClick={handleApprove}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30 transition"
                >
                  <CheckCircle size={18} /> Approve Media
                </button>
                <button
                  onClick={handleRemove}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30 transition"
                >
                  <XCircle size={18} /> Remove Media
                </button>
                <button
                  onClick={() => setShowEditModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 hover:bg-yellow-500/30 transition"
                >
                  <Pencil size={18} /> Edit Info
                </button>
                <button
                  onClick={() => setShowAddModal(true)}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition"
                >
                  <ImagePlus size={18} /> Add Media
                </button>
              </div>
            </div>

            {/* Details */}
            <div className="bg-[#10151d] rounded-xl border border-gray-800 p-6 shadow-md">
              <h2 className="text-lg font-semibold text-white mb-4">
                Media Details
              </h2>
              {current ? (
                <div className="space-y-5 text-sm sm:text-base text-white/80 divide-y divide-gray-800">

                  {/* Uploaded By */}
                  <div>
                    <div className="flex items-center gap-2 text-white font-medium">
                      <CheckCircle size={16} /> Uploaded by:
                    </div>
                    <div className="mt-1">{current.uploadedBy}</div>
                  </div>

                  {/* Content Type */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <ImagePlus size={16} /> Content Type:
                    </div>
                    <div className="mt-1">
                      {current.type === "image" ? "Image" : "Video"}
                    </div>
                  </div>

                  {/* Related Profile */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Pencil size={16} /> Related Profile:
                    </div>
                    <div className="mt-1 text-blue-400">
                      {current.relatedProfile}
                    </div>
                  </div>

                  {/* Upload Date */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Calendar size={16} /> Upload Date:
                    </div>
                    <div className="mt-1">{current.uploadDate}</div>
                  </div>

                  {/* Reports */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <XCircle size={16} /> Reports:
                    </div>
                    <div className="mt-1">
                      <span
                        className={`px-2 py-1 rounded text-sm font-medium ${current.reports.length === 0
                          ? "bg-gray-700 text-white/60"
                          : "bg-yellow-500/20 text-yellow-400"
                          }`}
                      >
                        {current.reports.length}{" "}
                        {current.reports.length === 1 ? "Report" : "Reports"}
                      </span>
                    </div>
                    {current.reports.length > 0 && (
                      <ul className="mt-3 space-y-2">
                        {current.reports.map((reason, idx) => (
                          <li
                            key={idx}
                            className="flex items-center gap-2 text-white/80"
                          >
                            <span
                              className={`w-2 h-2 rounded-full ${reason.toLowerCase().includes("inappropriate")
                                ? "bg-red-500"
                                : reason.toLowerCase().includes("misleading")
                                  ? "bg-yellow-400"
                                  : "bg-white/40"
                                }`}
                            ></span>
                            {reason}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Severity */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-white font-medium">
                      ⚠️ Severity:
                    </div>
                    <div
                      className={`mt-1 font-semibold ${current.severity === "High"
                        ? "text-red-500"
                        : current.severity === "Medium"
                          ? "text-yellow-400"
                          : "text-green-400"
                        }`}
                    >
                      {current.severity || "Not set"}
                    </div>
                  </div>

                  {/* Title */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Pencil size={16} /> Title:
                    </div>
                    <div className="mt-1">{current.title}</div>
                  </div>

                  {/* Description */}
                  <div className="pt-4">
                    <div className="flex items-center gap-2 text-white font-medium">
                      <Pencil size={16} /> Description:
                    </div>
                    <div className="mt-1">{current.description}</div>
                  </div>
                </div>
              ) : (
                <p className="text-white/60">No media selected.</p>
              )}
            </div>
          </div>

          {/* Filter + Search */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mt-10 mb-6">

            <span className="text-white font-medium">Filter by Severity:</span>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              className="px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white"
            >
              <option value="">All</option>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>

            <div className="flex items-center gap-2 ml-auto">
              <Search size={18} className="text-white/60" />
              <input
                type="text"
                placeholder="Search by title or uploader..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white sm:w-64"
              />
            </div>
          </div>

          {/* Queue */}
          <div className="bg-[#10151d] rounded-xl border border-gray-800 p-6 shadow-md">
            <h2 className="text-lg font-semibold text-white mb-4">
              Pending Media Queue
            </h2>
            <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-3 snap-x snap-mandatory">

              {filteredQueue.map((item, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedMedia(index)}
                  className={`relative w-24 h-24 sm:w-28 sm:h-28 rounded-lg border cursor-pointer overflow-hidden transition transform hover:scale-105 ${selectedMedia === index
                    ? "border-cyan-500 shadow-md"
                    : "border-gray-700 hover:border-cyan-400"
                    }`}
                  title={item.title}
                >
                  {item.type === "image" ? (
                    <img
                      src={item.src}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={item.src}
                      muted
                      className="w-full h-full object-cover"
                    />
                  )}

                  {item.type === "video" && (
                    <span className="absolute top-1 left-1 bg-black/60 text-white text-xs px-1.5 py-0.5 rounded">
                      🎥
                    </span>
                  )}

                  {item.reports.length > 0 && (
                    <span className="absolute bottom-1 right-1 bg-red-600/80 text-white text-xs px-1.5 py-0.5 rounded">
                      {item.reports.length}
                    </span>
                  )}

                  {item.severity && (
                    <span
                      className={`absolute top-1 right-1 text-xs px-1.5 py-0.5 rounded font-semibold ${item.severity === "High"
                        ? "bg-red-600/80 text-white"
                        : item.severity === "Medium"
                          ? "bg-yellow-500/80 text-black"
                          : "bg-green-600/80 text-white"
                        }`}
                    >
                      {item.severity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Reported Tab */}
      {activeTab === "reported" && (
        <div className="mt-6">
          <GroupModerationPanel />
        </div>
      )}

      {/* ================= REVIEWS TAB ================= */}
      {activeTab === "reviews" && (
        <div className="mt-6">
          <ReviewModerationPanel />
        </div>
      )}


      {/* Edit and Add Modals */}
      {showEditModal && <ModalEdit />}
      {showAddModal && <ModalAdd setMediaQueue={setMediaQueue} />}
    </div>
  );

  // --- Modals ---
  function Modal({ title, children, onClose }) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
        <div className="bg-[#10151d] border border-gray-700 rounded-xl shadow-xl w-[90%] max-w-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-white">{title}</h3>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition"
            >
              ✕
            </button>
          </div>
          {children}
        </div>
      </div>
    );
  }

  function ModalEdit() {
    const [title, setTitle] = useState(current?.title || "");
    const [description, setDescription] = useState(current?.description || "");
    const [severity, setSeverity] = useState(current?.severity || "Low");

    const handleSave = async () => {
      if (!current?._id) return;

      try {
        // Call API to update media info in DB
        const res = await updateAdminMedia(current._id, {
          title,
          description,
          severity,
        });

        // Update local state
        setMediaQueue((prev) =>
          prev.map((item, i) =>
            i === selectedMedia
              ? {
                ...item,
                title: res.data.content.title,
                description: res.data.content.description,
                severity: res.data.content.severity.charAt(0).toUpperCase() +
                  res.data.content.severity.slice(1),
              }
              : item
          )
        );

        toast.success("Media details updated!");
        setShowEditModal(false);
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.error || "Failed to update media");
      }
    };


    return (
      <Modal title="Edit Media Info" onClose={() => setShowEditModal(false)}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-white text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-white text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white"
            />

          </div>
          <div>
            <label className="text-white text-sm">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            onClick={handleSave}
            className="mt-4 px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition"
          >
            Save Changes
          </button>
        </div>
      </Modal>
    );
  }

  function ModalAdd({ setMediaQueue }) {
    const [file, setFile] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [severity, setSeverity] = useState("Low");
    const [selectedReasons, setSelectedReasons] = useState([]);

    const handleAdd = async () => {
      if (!file) {
        toast.error("Please select a file!");
        return;
      }

      try {
        const formData = new FormData();
        formData.append("file", file);                 // MUST be "file"
        formData.append("title", title || file.name);
        formData.append("description", description);
        formData.append("severity", severity.toLowerCase());

        const res = await saveAdminContent(formData);
        const saved = res.data.content;

        setMediaQueue((prev) => [
          ...prev,
          {
            type: saved.fileType,
            src: saved.fileUrl,
            title: saved.title,
            description: saved.description,
            severity:
              saved.severity.charAt(0).toUpperCase() +
              saved.severity.slice(1),
            reports: [],
            uploadedBy: "Admin",
            relatedProfile: "",
            uploadDate: new Date().toLocaleDateString(),
          },
        ]);

        toast.success("Media uploaded successfully!");
        setShowAddModal(false);
      } catch (err) {
        console.error(err);
        toast.error(err?.response?.data?.error || "Upload failed");
      }
    };

    return (
      <Modal title="Add New Media" onClose={() => setShowAddModal(false)}>
        <div className="flex flex-col gap-4">
          <div>
            <label className="text-white text-sm">Select File</label>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="w-full text-white mt-1"
            />
          </div>
          <div>
            <label className="text-white text-sm">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="text-white text-sm">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description (optional)"
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white"
            />
          </div>
          <div>
            <label className="block text-white font-medium mb-1">Flag Reasons (optional)</label>
            <select
              multiple
              value={selectedReasons}
              onChange={(e) =>
                setSelectedReasons(Array.from(e.target.selectedOptions).map((opt) => opt.value))
              }
              className="w-full px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white h-28"
            >
              <option value="Inappropriate content">Inappropriate content</option>
              <option value="Misleading information">Misleading information</option>
              <option value="Copyright violation">Copyright violation</option>
              <option value="Spam/advertising">Spam / advertising</option>
              <option value="Violence or abuse">Violence or abuse</option>
            </select>
            <p className="text-xs text-white/50 mt-1">
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple.
            </p>
          </div>
          <div>
            <label className="text-white text-sm">Severity</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value)}
              className="w-full mt-1 px-3 py-2 rounded bg-[#0b0f14] border border-gray-700 text-white"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>
          <button
            onClick={handleAdd}
            className="mt-4 px-4 py-2 rounded bg-cyan-500 text-white hover:bg-cyan-600 transition"
          >
            Add Media
          </button>
        </div>
      </Modal>
    );
  }

}
