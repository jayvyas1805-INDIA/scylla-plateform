import api from './api'

// Add vehicle
export const addVehicle = (formData) => {
  return api.post("/api/vehicles", formData, {
     withCredentials: true
  });
};


// get vehicle data
export const getVehicle =  () =>{
   return api.get("/api/vehicles");

}

// delete vehicle data
export const deleteVehicle = (id) =>{
    return api.delete(`/api/vehicles/${id}`)
}