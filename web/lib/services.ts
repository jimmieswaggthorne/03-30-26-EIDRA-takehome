import axios from "axios";

const DEFAULT_BASE = "http://localhost:4000";

export const getRestaurants = ()=> {
  return axios.get(`${DEFAULT_BASE}/api/restaurants`);
}

export const getRestaurantById = (id: string) => {
return axios.get(`${DEFAULT_BASE}/api/restaurants/${id}`);
};

export const getFilters = () => {
  return axios.get(`${DEFAULT_BASE}/api/filter`);
};

export const getFilterById = (id: string) => {
  return axios.get(`${DEFAULT_BASE}/api/filter/${id}`);
};


export const getOpenStatus = (id:string) => {
  return axios.get(`${DEFAULT_BASE}/api/open/${id}`);
};

export const getPriceRange = (id:string) => {
  return axios.get(`${DEFAULT_BASE}/api/price-range/${id}`);
};