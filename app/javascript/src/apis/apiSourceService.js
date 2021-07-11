import axios from "axios";

const fetchAll = () => {
  return axios.get("api/v1/api_sources");
}

const fetch = (id) => {
  return axios.get(`api/v1/api_sources/${id}`);
}

const create = (payload) => {
  return axios.post("api/v1/api_sources", payload);
}

const update = (id, payload) => {
  return axios.put(`api/v1/api_sources/${id}`, payload);
}

const destroy = (id) => { 
  return axios.delete(`api/v1/api_sources/${id}`);
}

const apiSourceService = {
  fetchAll,
  create,
  fetch,
  update,
  destroy,
};

export default apiSourceService;
