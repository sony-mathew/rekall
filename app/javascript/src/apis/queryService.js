import axios from "axios";

const fetchAll = (query_group_id) => {
  return axios.get(`api/v1/query_groups/${query_group_id}/queries`);
}

const fetch = (query_group_id, id) => {
  return axios.get(`api/v1/query_groups/${query_group_id}/queries/${id}`);
}

const create = (query_group_id, payload) => {
  axios.post(`api/v1/query_groups/${query_group_id}/queries`, payload);
}

const update = (query_group_id, id, payload) => {
  axios.put(`api/v1/query_groups/${query_group_id}/queries/${id}`, payload);
}

const destroy = (query_group_id, id) => { 
  axios.delete(`api/v1/query_groups/${query_group_id}/queries/${id}`);
}

const queryService = {
  fetchAll,
  create,
  fetch,
  update,
  destroy,
};

export default queryService;
