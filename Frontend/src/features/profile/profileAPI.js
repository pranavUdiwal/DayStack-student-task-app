import axios from 'axios';

const API_URL = '/api/profile';

export const fetchProfileAPI = async () => {
  const response = await axios.get(`${API_URL}/`);
  return response.data;
};

export const updateProfileAPI = async (profileData) => {
  const response = await axios.put(`${API_URL}/`, profileData);
  return response.data;
};

export const uploadPhotoAPI = async (formData) => {
  const response = await axios.post(`${API_URL}/upload-photo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
