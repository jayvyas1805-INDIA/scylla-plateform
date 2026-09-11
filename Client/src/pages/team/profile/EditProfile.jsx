import { useState, useEffect } from "react";
import { getMyProfile, updateMyProfile } from "../../../api/member.api";

function EditProfile() {
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMember = async () => {
      try {
        const res = await getMyProfile();
        setMember(res.data.member);
      } catch (err) {
        console.log(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, []);

  const handleSave = async () => {
    try {
      const res = await updateMyProfile({
        name: member.name,
        bio: member.bio,
        phone: member.phone,
        location: member.location,
        profilePic: member.profilePic,
      });
      setMember(res.data.member);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update profile");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="edit-profile-page">
      <h1>Edit My Profile</h1>

      <div>
        <label>Name</label>
        <input
          type="text"
          value={member.name || ""}
          onChange={(e) => setMember({ ...member, name: e.target.value })}
        />
      </div>

      <div>
        <label>Bio</label>
        <textarea
          value={member.bio || ""}
          onChange={(e) => setMember({ ...member, bio: e.target.value })}
        />
      </div>

      <div>
        <label>Phone</label>
        <input
          type="text"
          value={member.phone || ""}
          onChange={(e) => setMember({ ...member, phone: e.target.value })}
        />
      </div>

      <div>
        <label>Location</label>
        <input
          type="text"
          value={member.location || ""}
          onChange={(e) => setMember({ ...member, location: e.target.value })}
        />
      </div>

      <div>
        <label>Profile Picture</label>
        <input
          type="file"
          onChange={(e) => {
            const file = e.target.files[0];
            if (file) setMember({ ...member, profilePic: URL.createObjectURL(file) });
          }}
        />
      </div>

      <button onClick={handleSave}>Save Changes</button>
    </div>
  );
}

export default EditProfile;
