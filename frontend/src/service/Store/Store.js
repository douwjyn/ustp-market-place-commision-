import { api } from '../../lib/axios';

export async function getStores() {
  try {
    const response = await api.get('/stores');
    return response.data;
  } catch (err) {
    console.error('Error fetching stores:', err);
    throw err;
  }
}

export async function getStoreById(id) {
  try {
    const response = await api.get(`/stores/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching store by id:', err);
    throw err;
  }
}

export async function searchInStores(shop_id, query) {
  try {
    const response = await api.get(`/stores/search/${shop_id}/${query}`);
    return response.data;
  } catch (err) {
    console.error('Error searching in stores:', err);
    throw err;
  }
}
