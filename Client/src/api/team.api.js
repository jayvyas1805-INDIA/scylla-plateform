import api from './api'


export const teamRegister = (data) =>{
  return api.post('/api/teams/register', data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export const teamLogin = ({ email, password }) =>{
  return api.post('/api/teams/login', { email, password })
}

export const getTeamProfile = () =>{
    return api.get('/api/teams/profile');
}

export const updateTeamProfile = (data) =>{
    return api.put('/api/teams/profile',data, { 
      headers: { "Content-Type": "multipart/form-data" }, // needed for files
  });
}


// team activity api call

export const getTeamActivities = () =>{
  return api.get("/api/teams/activities");
}

// upload the team media

export const uploadTeamMedia = (formData) =>{
  return api.post("/api/teams/profile/media",formData,{ 
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// DELETE team media(not work right now)
export const deleteTeamMedia = (filename) => {
  return api.delete(`/api/teams/profile/media/${filename}`);
};

// add achivement
// Add achievement (send JSON, not FormData)
export const addAchivement1 = (achievement) => {
  // achievement = { title, description, type }
  return api.post("/api/teams/profile/achievements", achievement, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

// delete achivement
export const deleteAchivement1 = (id) =>{
  return api.delete(`/api/teams/profile/achievements/${id}`)
}

// upload sponsor logo
export const uploadSponser = (formData) =>{
  return api.post("/api/teams/profile/sponsor", formData, {
    headers:{
      "Content-Type": "multipart/form-data",
    }
  })
}

// delete sponsor
export const deleteSponsorApi = (id) => {
  return api.delete(`/api/teams/profile/sponsor/${id}`);
};


// upload media gallary
export const uploadGallery = (formData) =>{
  return api.post("/api/teams/profile/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
};


export const deleteMediaApi = (url) => {
  return api.delete(`/api/teams/profile/gallery`, { params: { mediaUrl: url } });
};


// add social media links
export const addSocialLinkApi = (link) =>{
  return api.post("/api/teams/social",link,{
    headers: { "Content-Type": "application/json" }
  })
};

// Delete Social Link
export const deleteSocialLinkApi = (id) => {
  return api.delete(`/api/teams/social/${id}`);
};


export const getSocialLinksApi = () => api.get("/api/teams/social");


export const getAllTeams = () => {
  return api.get("/api/teams");
};
