import api from './api'


// for public market place
export const getMarketPlace = () => {
    return api.get('/api/products/marketplace',{
        headers: { 'Cache-Control': 'no-cache' }
});
}

export const addProduct = (formData) =>{
    return api.post("/api/products",formData,{
        headers: {"content-type":"multipart/form-data"}
    })
}

export const getMarketplaceFilters = () => {
  return api.get("/api/products/filters");
};


export const getMyProduct = () =>{
    return api.get("/api/products/my");
}