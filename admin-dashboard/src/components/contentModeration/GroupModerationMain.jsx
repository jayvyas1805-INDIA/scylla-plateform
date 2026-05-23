import {
  Users,
  Eye,
  Calendar,
  Heart,
  UserPlus,
  Pencil,
  Upload,
  Plus,
  X,
  Trash2,
} from "lucide-react";
import { MapPin } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";

export default function GroupModerationMain({ selectedTeam }) {
  const fileRef = useRef(null);

  const [showUpload, setShowUpload] = useState(false);
  const [images, setImages] = useState([]);
  const [mediaCount, setMediaCount] = useState(0);
  const [uploadProgress, setUploadProgress] = useState(null); // null = not uploading

  const [activities, setActivities] = useState([
    {
      id: "member",
      icon: <UserPlus size={14} />,
      color: "green",
      text: "Added new team member: Alex Johnson",
      time: "2 days ago",
    },
    {
      id: "profile",
      icon: <Pencil size={14} />,
      color: "blue",
      text: "Updated profile description",
      time: "5 days ago",
    },
  ]);

  /* ================= ACTIVITY HELPERS ================= */

  const updateMediaActivity = (newCount, isUploading = false) => {
    setActivities((prev) => {
      const index = prev.findIndex((a) => a.id === "media");

      // REMOVE ACTIVITY IF COUNT = 0
      if (newCount === 0) {
        return prev.filter((a) => a.id !== "media");
      }

      const activity = {
        id: "media",
        icon: <Upload size={14} />,
        color: "purple",
        text: isUploading
          ? "Uploading images..."
          : `Uploaded images (${newCount})`,
        time: "Just now",
      };

      // UPDATE
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = activity;
        return updated;
      }

      // ADD ONCE
      return [activity, ...prev];
    });
  };

  /* ================= IMAGE UPLOAD ================= */

  const simulateUpload = (files) => {
    let progress = 0;
    setUploadProgress(0);
    updateMediaActivity(mediaCount, true);

    const interval = setInterval(() => {
      progress += 20;
      setUploadProgress(progress);

      if (progress >= 100) {
        clearInterval(interval);
        setUploadProgress(null);

        const newImages = Array.from(files).map((file) => ({
          id: crypto.randomUUID(),
          preview: URL.createObjectURL(file),
        }));

        setImages((prev) => [...newImages, ...prev]);

        setMediaCount((prev) => {
          const newCount = prev + newImages.length;
          updateMediaActivity(newCount);
          return newCount;
        });

        toast.success("Images uploaded");
        setShowUpload(false);
      }
    }, 300);
  };

  const handleFiles = (files) => {
    if (!files.length) return;
    simulateUpload(files);
  };

  const onDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  /* ================= DELETE IMAGE ================= */

  const deleteImage = (id) => {
    setImages((prev) => prev.filter((img) => img.id !== id));

    setMediaCount((prev) => {
      const newCount = prev - 1;
      updateMediaActivity(newCount);
      return newCount;
    });

    toast.success("Image removed");
  };

  /* ================= RESET ================= */

  const resetMedia = () => {
    setImages([]);
    setMediaCount(0);
    updateMediaActivity(0);
    toast.success("Media reset");
  };

  return (
    <>
      <main className="bg-[#0b0f14] border border-[#1f2937] rounded-xl p-4 md:p-6 space-y-6 text-white">

        {/* HEADER */}
        <div className="flex gap-4 p-5 rounded-xl bg-gradient-to-r from-indigo-600/40 to-purple-600/30">
          <div className="w-14 h-14 rounded-lg bg-blue-600 flex items-center justify-center">
            <Users size={26} />
          </div>

          <div>
            <h2 className="text-lg font-semibold">{selectedTeam}</h2>
            <p className="text-xs text-white/70 flex items-center gap-1">
  Formula Student
  <span className="flex items-center gap-1">
    <MapPin size={12} className="text-cyan-400" />
    California, USA
  </span>
</p>
            <span className="inline-block mt-2 px-2 py-0.5 text-[11px] rounded bg-green-500/20 text-green-400">
              ✔ Verified
            </span>
          </div>
        </div>
 {/* ================= ABOUT ================= */}
        <div>
          <h3 className="text-sm font-semibold mb-1">About</h3>
          <p className="text-sm text-white/70 leading-relaxed">
            Thunder Racing Team is a competitive Formula Student team from
            California Institute of Technology. We specialize in electric
            vehicle development and have been competing internationally
            since 2016. Our focus is on innovative aerodynamics and
            sustainable racing solutions.
          </p>
        </div>





        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Stat icon={<Eye size={16} />} label="Views" value="2.5K" color="blue" />
          <Stat icon={<Users size={16} />} label="Members" value="24" color="purple" />
          <Stat icon={<Calendar size={16} />} label="Events" value="8" color="green" />
          <Stat icon={<Heart size={16} />} label="Connections" value="156" color="yellow" />
        </div>

        {/* RECENT ACTIVITY */}
        <div>
          <h3 className="text-sm font-semibold mb-3">Recent Activity</h3>
          <div className="space-y-2">
            {activities.map((a) => (
              <Activity key={a.id} {...a} progress={uploadProgress} />
            ))}
          </div>
        </div>

        {/* MEDIA */}
        <div>
          <div className="flex justify-between mb-3">
            <h3 className="text-sm font-semibold">Media Gallery</h3>
            {mediaCount > 0 && (
              <button onClick={resetMedia} className="text-xs text-red-400">
                Reset
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((img) => (
              <div key={img.id} className="relative h-24 rounded-lg overflow-hidden">
                <img src={img.preview} className="w-full h-full object-cover" />
                <button
                  onClick={() => deleteImage(img.id)}
                  className="absolute top-1 right-1 bg-black/60 p-1 rounded"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}

            <button
              onClick={() => setShowUpload(true)}
              className="h-24 rounded-lg border border-dashed border-blue-500/40 flex items-center justify-center text-blue-400"
            >
              <Plus />
            </button>
          </div>
        </div>
      </main>

      {/* UPLOAD MODAL */}
      {showUpload && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div
            onDrop={onDrop}
            onDragOver={(e) => e.preventDefault()}
            className="bg-[#0b0f14] p-5 rounded-xl w-[90%] max-w-sm"
          >
            <div className="flex justify-between mb-4">
              <h3 className="font-semibold">Upload Images</h3>
              <button onClick={() => setShowUpload(false)}>
                <X />
              </button>
            </div>

            <div
              onClick={() => fileRef.current.click()}
              className="h-32 border border-dashed border-blue-500/40 rounded-lg flex items-center justify-center cursor-pointer"
            >
              <Upload />
            </div>

            <input
              ref={fileRef}
              type="file"
              multiple
              hidden
              accept="image/*"
              onChange={(e) => handleFiles(e.target.files)}
            />
          </div>
        </div>
      )}
    </>
  );
}
/* ================= SUB COMPONENTS ================= */

const Stat = ({ icon, label, value, color }) => {
  const colors = {
    blue: "text-blue-400",
    purple: "text-purple-400",
    green: "text-green-400",
    yellow: "text-yellow-400",
  };

  return (
    <div className="bg-[#0f172a] border border-[#1f2937] rounded-xl p-4">
      <div className={`flex gap-2 items-center ${colors[color]}`}>
        {icon}
        <span className="text-lg font-semibold">{value}</span>
      </div>
      <div className="text-xs text-white/60">{label}</div>
    </div>
  );
};

const Activity = ({ icon, text, time, color, progress }) => {
  const colors = {
    green: "text-green-400",
    blue: "text-blue-400",
    purple: "text-purple-400",
  };

  return (
    <div className="px-4 py-2 rounded-lg bg-[#0f172a] border border-[#1f2937] flex items-center gap-3">
      {/* Icon + Text */}
      <div className={`flex gap-2 items-center ${colors[color]}`}>
        {icon}
        <span className="text-sm text-white">{text}</span>
      </div>

      {/* Optional progress bar */}
      {progress !== null && (
        <div className="ml-auto w-24 h-1 bg-white/10 rounded">
          <div
            style={{ width: `${progress}%` }}
            className="h-1 bg-purple-500 rounded"
          />
        </div>
      )}

      {/* Time on the right */}
      <span className="ml-auto text-xs text-white/50">{time}</span>
    

      {/* Optional progress bar */}
      {progress !== null && (
        <div className="ml-auto w-24 h-1 bg-white/10 rounded">
          <div
            style={{ width: `${progress}%` }}
            className="h-1 bg-purple-500 rounded"
          />
        </div>
      )}
    </div>
  );
};
