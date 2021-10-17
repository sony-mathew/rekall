import axios from "axios";

const fetchAll = (team_id) => {
  return axios.get(`api/v1/teams/${team_id}/members`);
}

const fetch = (team_id, id) => {
  return axios.get(`api/v1/teams/${team_id}/members/${id}`);
}

const create = (team_id, payload) => {
  return axios.post(`api/v1/teams/${team_id}/members`, payload);
}

const update = (team_id, id, payload) => {
  return axios.put(`api/v1/teams/${team_id}/members/${id}`, payload);
}

const destroy = (team_id, id) => { 
  return axios.delete(`api/v1/teams/${team_id}/members/${id}`);
}

const teamMemberService = {
  fetchAll,
  create,
  fetch,
  update,
  destroy,
};

export default teamMemberService;
