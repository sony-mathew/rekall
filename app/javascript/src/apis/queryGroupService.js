import axios from "axios";

const fetchAll = () => {
  return axios.get("api/v1/query_groups");
}

const fetch = (id) => {
  return axios.get(`api/v1/query_groups/${id}`);
}

const create = (payload) => {
  return axios.post("api/v1/query_groups", payload);
}

const update = (id, payload) => {
  return axios.put(`api/v1/query_groups/${id}`, payload);
}

const destroy = (id) => { 
  return axios.delete(`api/v1/query_groups/${id}`);
}

const queryGroupService = {
  fetchAll,
  create,
  fetch,
  update,
  destroy,
};

export default queryGroupService;
