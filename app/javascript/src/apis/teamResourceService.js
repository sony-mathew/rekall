import axios from "axios";

const fetchAll = (team_id) => {
  return axios.get(`api/v1/teams/${team_id}/resources`);
}

const fetch = (team_id, id) => {
  return axios.get(`api/v1/teams/${team_id}/resources/${id}`);
}

const create = (team_id, payload) => {
  return axios.post(`api/v1/teams/${team_id}/resources`, payload);
}

const update = (team_id, id, payload) => {
  return axios.put(`api/v1/teams/${team_id}/resources/${id}`, payload);
}

const destroy = (team_id, id) => { 
  return axios.delete(`api/v1/teams/${team_id}/resources/${id}`);
}

const teamResourceService = {
  fetchAll,
  create,
  fetch,
  update,
  destroy,
};

export default teamResourceService;
