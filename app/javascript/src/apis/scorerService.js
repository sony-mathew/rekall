import axios from "axios";

const fetchAll = () => {
  return axios.get("api/v1/scorers");
}

const fetch = (id) => {
  return axios.get(`api/v1/scorers/${id}`);
}

const create = (payload) => {
  return axios.post("api/v1/scorers", payload);
}

const update = (id, payload) => {
  return axios.put(`api/v1/scorers/${id}`, payload);
}

const destroy = (id) => { 
  return axios.delete(`api/v1/scorers/${id}`);
}

const scorerService = {
  fetchAll,
  create,
  fetch,
  update,
  destroy,
};

export default scorerService;
