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

export const getRegistrationInvitations = () => api.get("/api/admin/registration-invitations");
export const deleteRegistrationInvitation = (id) => api.delete(`/api/admin/registration-invitations/${id}`);

export const createAdminVendor = (data) => api.post("/api/admin/vendor", data, {
  headers: { "Content-Type": "multipart/form-data" },
});

export const createAdminTeam = (data) => api.post("/api/admin/team", data, {
  headers: { "Content-Type": "multipart/form-data" },
});


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

// approval checklist rules (Rule Management page) — the AI review's
// source of truth. docType is "team" or "vendor".
export const getApprovalRules = (docType) =>
  api.get("/api/admin/rules", { params: docType ? { docType } : {} });

export const createApprovalRule = (data) =>
  api.post("/api/admin/rules", data);

export const updateApprovalRule = (id, data) =>
  api.put(`/api/admin/rules/${id}`, data);

export const deleteApprovalRule = (id) =>
  api.delete(`/api/admin/rules/${id}`);


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

export const fetchModerationQueue = (params = {}) =>
  api.get("/api/admin/moderation", { params });

export const fetchModerationItem = (contentType, contentId) =>
  api.get(`/api/admin/moderation/${contentType}/${contentId}`);

export const approveModerationItem = (contentType, contentId) =>
  api.post(`/api/admin/moderation/${contentType}/${contentId}/approve`);

export const rejectModerationItem = (contentType, contentId, reason) =>
  api.post(`/api/admin/moderation/${contentType}/${contentId}/reject`, { reason });

export const requestModerationChanges = (contentType, contentId, feedback) =>
  api.post(`/api/admin/moderation/${contentType}/${contentId}/request-changes`, { feedback });

export const fetchCategories = (group) =>
  api.get("/api/admin/categories", { params: group ? { group } : {} });

export const createCategory = (data) =>
  api.post("/api/admin/categories", data);

export const updateCategory = (id, data) =>
  api.patch(`/api/admin/categories/${id}`, data);

export const deleteCategory = (id) =>
  api.delete(`/api/admin/categories/${id}`);

export const fetchAdminAnalytics = (range = "all") =>
  api.get("/api/admin/analytics", { params: { range } });