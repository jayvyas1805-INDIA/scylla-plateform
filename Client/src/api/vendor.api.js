import api from './api'

// vendor register
export const vendorRegister = (data) =>{
    return api.post("/api/vendors/register", data, {
        headers: {'Content-Type' : 'multipart/form-data'}
    });
}

// vendor login
export const vendorLogin = ({ email, password }) => {
    return api.post("/api/vendors/login", {email,password})
}

// vendor profile fetch
export const getVendorProfile = () =>{
    return api.get("/api/vendors/profile");
}

// edit vendor profile
export const editVendorProfile = (data) =>{
    return api.put("/api/vendors/profile",data, { 
      headers: { "Content-Type": "multipart/form-data" }, // needed for files
  });
}

export const businessHours = (hours) =>{
  return api.put("/api/vendors/businessHours",
    { businessHours: hours },
  )
}

// upload gallery at vendor profile
export const uploadGallery = (formData) =>{
  return api.post("/api/vendors/profile/gallery", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  })
};

// upload media
export const uploadVendorMedia = (formData) =>{
  return api.post("/api/vendors/profile/media",formData,{ 
    headers: { "Content-Type": "multipart/form-data" },
  });
}

// service
export const addService = (data) =>{
  return api.post("/api/vendors/service", data)
}

export const addProject = (formData) =>{
  return api.post("/api/vendors/project", formData,{
    headers : { 'Content-Type': 'multipart/form-data'}
  });
}