import axios from "axios";

const fetchAll = () => {
  return axios.get("api/v1/teams");
}

const fetch = (id) => {
  return axios.get(`api/v1/teams/${id}`);
}

const create = (payload) => {
  return axios.post("api/v1/teams", payload);
}

const update = (id, payload) => {
  return axios.put(`api/v1/teams/${id}`, payload);
}

const destroy = (id) => { 
  return axios.delete(`api/v1/teams/${id}`);
}

const teamService = {
  fetchAll,
  create,
  fetch,
  update,
  destroy,
};

export default teamService;
