import axios from "axios";

const fetchAll = () => {
  return axios.get("api/v1/api_sources");
}

const fetch = (id) => {
  return axios.get(`api/v1/api_sources/${id}`);
}

const create = (payload) => {
  axios.post("api/v1/api_sources", payload);
}

const update = (id, payload) => {
  axios.put(`api/v1/api_sources/${id}`, payload);
}

const destroy = (id) => { 
  axios.delete(`api/v1/api_sources/${id}`);
}

const apiSourceService = {
  fetchAll,
  create,
  fetch,
  update,
  destroy,
};

export default apiSourceService;
