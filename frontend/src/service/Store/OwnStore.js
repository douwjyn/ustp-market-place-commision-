import { api } from '../../lib/axios';

export async function getOwnStore() {
  try {
    const response = await api.get('/own-store');
    return response.data;
  } catch (err) {
    console.error('Error fetching own store:', err);
    throw err;
  }
}

export async function createOwnStore(data) {
  try {
    const response = await api.post('/own-store', data);
    return response.data;
  } catch (err) {
    console.error('Error creating own store:', err);
    throw err;
  }
}

export async function getOwnStoreById(id) {
  try {
    const response = await api.get(`/own-store/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching own store by id:', err);
    throw err;
  }
}

export async function updateOwnStore(id, data) {
  try {
    const response = await api.post(`/own-store/${id}`, data);
    return response.data;
  } catch (err) {
    console.error('Error updating own store:', err);
    throw err;
  }
}

export async function deleteOwnStore(id) {
  try {
    const response = await api.delete(`/own-store/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error deleting own store:', err);
    throw err;
  }
}

export async function getOwnStoreEarnings(date, direction) {
  try {
    const response = await api.get(`/own-store/earnings/${date}/${direction}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching own store earnings:', err);
    throw err;
  }
}
