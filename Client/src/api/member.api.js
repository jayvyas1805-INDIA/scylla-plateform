import api from './api'

export const getMember = () =>{
    return api.get("/api/member")
}

export const addMember = (memberData) => {
    return api.post("/api/member", memberData,{
    headers: { "Content-Type": "application/json" },
  });
}

export const deleteMember = (id) => {
    return api.delete(`/api/member/${id}`)
}

// get member own profile
export const getMyProfile = () =>{
    return api.get("/api/member/myProfile");
}


// update member prfile
export const updateMyProfile = (formData) =>{
    return api.put("/api/member/myProfile", formData,{
        headers :{'Content-type' : 'multipart/form-data' }
    })
}

// upload certificate
export const uploadCertificate = (formData) =>{
    return api.post("/api/member/uploadCertificate",formData,{
        headers :{'Content-type' : 'multipart/form-data'}
    })
}