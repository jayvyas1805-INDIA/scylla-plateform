import api from './api'

export const adminLogin = (data) =>{
  return api.post("/api/admin/login",data)
}

// fetch current logged-in admin details
export const getAdminProfile = () => {
  return api.get("/api/admin"); // backend route that returns admin info
};


export const updateAdmin = (formData) =>{
  return api.put("/api/admin/update", formData);
}

export const getDashboardStats = () =>{ 
  return api.get("/api/admin/dashboard");}

// pending teams + vendors
export const getPendingUsers = () =>{
  return api.get("/api/admin/pending");}


export const approveTeam = (id) => {
  return api.put(`/api/admin/team/${id}/approve`);
};

export const rejectTeam = (id) => {
  return api.put(`/api/admin/team/${id}/reject`);
};

/* VENDOR ACTIONS */
export const approveVendor = (id) => {
  return api.put(`/api/admin/vendor/${id}/approve`);
};

export const rejectVendor = (id) => {
  return api.put(`/api/admin/vendor/${id}/reject`);
};

// fetch verification docs

export const fetchVerificationDoc = () =>{
  return api.get('/api/admin/verification');
}


export const updateVerificationStatus = (ownerType, id, status) =>
 api.patch(`/api/admin/verification/${ownerType}/${id}`, { status });


// add content moderation
export const saveAdminContent = (formData) =>{
  return api.post("/api/admin/content",formData,{
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// get content moderation
export const fetchAdminContent = () =>{
  return api.get("/api/admin/content");
}

// approve media
export const approveAdminMedia = (mediaId) =>
  api.patch(`/api/admin/media/${mediaId}/approve`);


// delete the media
export const deleteAdminMedia = (mediaId) =>
  api.delete(`/api/admin/media/${mediaId}`);


// edit the media
export const updateAdminMedia = async (mediaId, data) => {
  return api.put(`/api/admin/media/${mediaId}`,data);
}