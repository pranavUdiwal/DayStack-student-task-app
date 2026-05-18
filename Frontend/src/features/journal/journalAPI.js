import axios from 'axios';

const API_URL = '/api/journals';

export const createJournalAPI = async (journalData) => {
  const response = await axios.post(`${API_URL}/`, journalData);
  return response.data;
};

export const fetchJournalsAPI = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const fetchJournalByIdAPI = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

export const updateJournalAPI = async (id, journalData) => {
  const response = await axios.put(`${API_URL}/${id}`, journalData);
  return response.data;
};

export const deleteJournalAPI = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};
