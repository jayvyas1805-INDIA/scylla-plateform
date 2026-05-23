import api from "./api"

export const getAdminContent = () =>{
    return api.get("/api/admin/content")
}