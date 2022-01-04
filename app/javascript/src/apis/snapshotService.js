import axios from "axios";

const fetchAll = (query_group_id, query_id) => {
  return axios.get(`api/v1/query_groups/${query_group_id}/queries/${query_id}/snapshots`);
}

const fetch = (query_group_id, query_id, id) => {
  return axios.get(`api/v1/query_groups/${query_group_id}/queries/${query_id}/snapshots/${id}`);
}

const create = (query_group_id, query_id, payload = {}) => {
  return axios.post(`api/v1/query_groups/${query_group_id}/queries/${query_id}/snapshots`, payload);
}

const update = (query_group_id, query_id, id, payload) => {
  return axios.put(`api/v1/query_groups/${query_group_id}/queries/${query_id}/snapshots/${id}`, payload);
}

const destroy = (query_group_id, query_id, id) => { 
  return axios.delete(`api/v1/query_groups/${query_group_id}/queries/${query_id}/snapshots/${id}`);
}

const compare = (query_group_id, query_id, payload) => {
  return axios.post(`api/v1/query_groups/${query_group_id}/queries/${query_id}/snapshots/compare`, payload);
}

const snapshotService = {
  fetchAll,
  create,
  update,
  fetch,
  destroy,
  compare
};

export default snapshotService;
