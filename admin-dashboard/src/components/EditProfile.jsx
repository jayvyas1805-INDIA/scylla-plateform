// EditProfile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { updateAdmin, getAdminProfile } from "../api/admin.api";

const EditProfile = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState({
    name:  "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");


  // Fetch current admin info
 useEffect(() => {
  const fetchProfile = async () => {
    try {
      const res = await getAdminProfile();
      const data = res.data;
     

      setAdmin({
        name: data?.name || "",
        email: data?.email || "",
        password: "",
      });
    } catch (err) {
      console.error("Error fetching admin profile:", err);
    }
  };

  fetchProfile();
}, []);

  const handleChange = (e) => {
    setAdmin({ ...admin, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const payload = {
        name: admin.name,
        email: admin.email,
      };
      if (admin.password) payload.password = admin.password; // only if changed

      const res = await updateAdmin(payload); // centralized API call
      setMessage(res.message || "Profile updated successfully");
      setLoading(false);
      setAdmin({ ...admin, password: "" }); // clear password field
    } catch (err) {
      console.error(err);
      setMessage(err.message || "Update failed");
      setLoading(false);
    }
  };



  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-6 text-center">Edit Profile</h2>

      {message && (
        <div className="mb-4 text-center text-green-600 font-medium">{message}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1 font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={admin.name ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            name="email"
            value={admin.email ?? ""}
            onChange={handleChange}
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            required
          />
        </div>

        <div>
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            name="password"
            value={admin.password ?? ""}
            onChange={handleChange}
            placeholder="Leave blank to keep current password"
            className="w-full border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition font-semibold"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Profile"}
        </button>
      </form>

      <div className="mt-4 text-center">
        <button
          onClick={() => navigate("/")}
          className="text-green-500 hover:underline"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default EditProfile;
