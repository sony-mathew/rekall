import axios from "axios";

const fetchAll = (query_group_id, query_id) => {
  return axios.get(`api/v1/query_groups/${query_group_id}/queries/${query_id}/results`);
}

const fetch = (query_group_id, query_id, id) => {
  return axios.get(`api/v1/query_groups/${query_group_id}/queries/${query_id}/results/${id}`);
}

const fetch_fresh_results = (query_group_id, query_id) => {
  axios.post(`api/v1/query_groups/${query_group_id}/queries/${query_id}/results/fetch_fresh_results`, {});
}

const register_score = (query_group_id, query_id, id, payload) => {
  axios.post(`api/v1/query_groups/${query_group_id}/queries/${query_id}/results/${id}/register_score`, payload);
}

const update = (query_group_id, query_id, id, payload) => {
  axios.put(`api/v1/query_groups/${query_group_id}/queries/${query_id}/results/${id}`, payload);
}

const destroy = (query_group_id, query_id, id) => { 
  axios.delete(`api/v1/query_groups/${query_group_id}/queries/${query_id}/results/${id}`);
}

const resultService = {
  fetchAll,
  fetch_fresh_results,
  register_score,
  fetch,
  update,
  destroy,
};

export default resultService;
