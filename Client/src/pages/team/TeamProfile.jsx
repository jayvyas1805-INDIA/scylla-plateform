import { useState, useEffect } from 'react';
import '../../styles/TeamProfile.css';

import TeamNavbar from "../../components/team/TeamNavbar";
import TeamHeader from "../../components/team/TeamHeader";
import TeamDescription from "../../components/team/TeamDescription";
import AchievementsSection from "../../components/team/AchievementsSection";
import TeamLocation from "../../components/team/TeamLocation";
import SponsorsSection from "../../components/team/SponsorsSection";
import ConnectWithUs from "../../components/team/ConnectWithUs";
import MediaGallery from "../../components/team/MediaGallery";
import Modal from "../../components/team/Modal";

import AwardForm from "../../components/team/forms/AwardForm";
import SponsorForm from "../../components/team/forms/sponsorForm";
import MediaForm from "../../components/team/forms/MediaForm";
import TeamDescriptionForm from "../../components/team/forms/TeamDescriptionForm";
import SocialForm from "../../components/team/forms/SocialForm";
import { getTeamProfile, updateTeamProfile, addAchivement1, deleteAchivement1, uploadSponser, deleteSponsorApi, addSocialLinkApi, deleteSocialLinkApi, uploadGallery, deleteMediaApi } from '../../api/team.api';

/* ================= TEMP FLAG ================= */
const USE_BACKEND = true;

const TeamProfile = () => {
  const [activeModal, setActiveModal] = useState(null);

  const [teamData, setTeamData] = useState(null);

  const [achievements, setAchievements] = useState([]);
  const [sponsors, setSponsors] = useState([]);
  const [socialLinks, setSocialLinks] = useState([]);
  const [mediaItems, setMediaItems] = useState([]);

  const createId = () =>
  `${Date.now()}-${Math.random().toString(36).slice(2)}`;



  /* ================= DATA FETCH ================= */

    const fetchTeam = async () => {
      try {
        const res = await getTeamProfile();
        setTeamData(res.data);
        setAchievements(
          (res.data.achievements || []).map(a => ({
            ...a,
            id: a._id,
          }))
        );


        setSponsors(res.data.sponsors || []);
        const galleryItems = (res.data.gallery || []).map((url) => ({
          id: url,   // ✅ use URL as unique id (assuming Cloudinary URLs are unique)
          url: url,
        }));
        setMediaItems(galleryItems);
        // <-- map gallery
        setSocialLinks(
          (res.data.socialMedia || []).map(link => ({
            id: link._id,      // use _id from backend
            platform: link.platform,
            url: link.url,
            handle: link.handle,
            icon: link.icon || "",
          }))
        );

      } catch (err) {
        console.error(err);
        console.warn("Backend fetch failed, using mock data");
      }
    };

useEffect(() => {
  if (USE_BACKEND) fetchTeam();
}, []);


  const handleOpenModal = (modalName) => {
    setActiveModal(modalName);
  };

  const handleCloseModal = () => {
    setActiveModal(null);
  };

  const updateTeamDescription = async (newData) => {
    try {
      if (USE_BACKEND) {
        const formData = new FormData();
        formData.append("name", newData.name);
        formData.append("tagline", newData.tagline);
        formData.append("description", newData.description);
        formData.append("location[address]", newData.location.address);
        if (newData.location.lat) formData.append("location[lat]", newData.location.lat);
        if (newData.location.lng) formData.append("location[lng]", newData.location.lng);

        await updateTeamProfile(formData); // call backend
      }

      // Update UI state
      setTeamData(prev => ({ ...prev, ...newData }));
    } catch (err) {
      console.error("Failed to update team description:", err);
    }
  };


  const addAchievement = async (achievement) => {
    // 1️⃣ Create temp ID immediately
    const tempId = createId();


    // 2️⃣ Optimistically update UI
    setAchievements(prev => [
      ...prev,
      { ...achievement, id: tempId }
    ]);

    try {
      if (USE_BACKEND) {
        const res = await addAchivement1(achievement);
        await fetchTeam()

        // 3️⃣ Replace temp item with backend item
        setAchievements(prev =>
          prev.map(a =>
            a.id === tempId
              ? { ...res.data, id: res.data._id }
              : a
          )
        );
      }
    } catch (err) {
      console.error("Failed to add achievement:", err);

      // rollback on failure
      setAchievements(prev => prev.filter(a => a.id !== tempId));
    }
  };


 const deleteAchievement = async (id) => {
  try {
    if (USE_BACKEND) {
      await deleteAchivement1(id);
    }
    setAchievements(prev => prev.filter(a => a.id !== id));
  } catch (err) {
    console.error("Failed to delete achievement:", err);
  }
};



  const addSponsor = async (sponsor) => {
    try {
      if (USE_BACKEND) {
        // Create FormData to send file
        const formData = new FormData();
        formData.append("name", sponsor.name);
        formData.append("category", sponsor.category);
        formData.append("website", sponsor.website);
        formData.append("initials", sponsor.initials);
        formData.append("logo", sponsor.logoFile); // must match backend multer key

        const res = await uploadSponser(formData);

        // Update sponsors state with returned data
        setSponsors(res.data.sponsors.map(s => ({ ...s, id: s._id })));
      } else {
        setSponsors([...sponsors, { ...sponsor, id: Date.now() }]);
      }
    } catch (err) {
      console.error("Failed to add sponsor:", err);
    }
  };


  const deleteSponsor = async (id) => {
    try {
      if (USE_BACKEND) {
        const res = await deleteSponsorApi(id);
        // Update sponsors state
        setSponsors(res.data.sponsors); // already has id mapped
      } else {
        setSponsors(sponsors.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete sponsor:", err);
    }
  };


  const addSocialLink = async (link) => {
    try {
      if (USE_BACKEND) {
        const res = await addSocialLinkApi(link);
        setSocialLinks([...socialLinks, { ...res.data, id: res.data._id }]);
      } else {
        setSocialLinks([...socialLinks, { ...link, id: Date.now() }]);
      }
    } catch (err) {
      console.error("Failed to add social link:", err);
    }
  };

  const deleteSocialLink = async (id) => {
    try {
      if (USE_BACKEND) {
        await deleteSocialLinkApi(id);
      }
      setSocialLinks(socialLinks.filter(s => s.id !== id));
    } catch (err) {
      console.error("Failed to delete social link:", err);
    }
  };



  const addMedia = async (media) => {
    try {
      if (USE_BACKEND) {
        const formData = new FormData();
        formData.append("gallery", media.mediaFile); // single file

        const res = await uploadGallery(formData); // call backend
        // map returned gallery URLs → {id, url} for React
        setMediaItems(res.data.gallery.map(url => ({ id: url, url })));
      } else {
        setMediaItems([...mediaItems, { ...media, id: Date.now(), url: URL.createObjectURL(media.mediaFile) }]);
      }
    } catch (err) {
      console.error("Failed to add gallery media:", err);
    }
  };



  const deleteMedia = async (id) => {
    try {
      if (USE_BACKEND) {
        await deleteMediaApi(id); // id = url string
        setMediaItems(mediaItems.filter(m => m.id !== id));
      } else {
        setMediaItems(mediaItems.filter(m => m.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete media:", err.response?.data || err);
    }
  };





  return (
    <div className="team-profile">

      <TeamHeader
        teamData={teamData}
        onEditClick={() => handleOpenModal('team-description')}
      />

      <TeamDescription
        teamData={teamData}
        onEditClick={() => handleOpenModal('team-description')}
        onSubmit={(data) => { updateTeamDescription(data); handleCloseModal(); }}
      />

      <AchievementsSection
        achievements={achievements || []}
        onAddClick={() => handleOpenModal('award')}
        onDelete={deleteAchievement}
      />

      <TeamLocation
        teamData={teamData}
        onEditClick={() => handleOpenModal('team-description')}
      />

      <SponsorsSection
        sponsors={sponsors || []}
        onUploadClick={() => handleOpenModal('sponsor')}
        onDelete={deleteSponsor}
      />

      <ConnectWithUs
        socialLinks={socialLinks || []}
        onAddClick={() => handleOpenModal('social')}
        onDelete={deleteSocialLink}
      />

      <MediaGallery
        mediaItems={mediaItems || []}
        onAddClick={() => handleOpenModal('media')}
        onDelete={deleteMedia}
      />

      {/* ================= MODALS ================= */}
      <Modal isOpen={activeModal === 'team-description'} onClose={handleCloseModal}>
        <TeamDescriptionForm
          teamData={teamData}
          onSubmit={(data) => { updateTeamDescription(data); handleCloseModal(); }}
          onClose={handleCloseModal}
        />
      </Modal>

      <Modal isOpen={activeModal === 'award'} onClose={handleCloseModal}>
        <AwardForm
          onSubmit={(data) => { addAchievement(data); handleCloseModal(); }}
          onClose={handleCloseModal}
        />
      </Modal>

      <Modal isOpen={activeModal === 'sponsor'} onClose={handleCloseModal}>
        <SponsorForm
          onSubmit={(data) => { addSponsor(data); handleCloseModal(); }}
          onClose={handleCloseModal}
        />
      </Modal>

      <Modal isOpen={activeModal === 'social'} onClose={handleCloseModal}>
        <SocialForm
          onSubmit={(data) => { addSocialLink(data); handleCloseModal(); }}
          onClose={handleCloseModal}
        />
      </Modal>

      <Modal isOpen={activeModal === 'media'} onClose={handleCloseModal}>
        <MediaForm
          onSubmit={(data) => { addMedia(data); handleCloseModal(); }}
          onClose={handleCloseModal}
        />
      </Modal>
    </div>
  );
};

export default TeamProfile;
