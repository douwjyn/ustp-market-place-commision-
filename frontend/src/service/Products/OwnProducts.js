import { api } from '../../lib/axios';

export async function getMyProducts() {
  try {
    const response = await api.get('/own-products');
    return response.data;
  } catch (err) {
    console.error('Error fetching my products:', err);
    throw err;
  }
}

export async function createMyProduct(data) {
  try {
    const response = await api.post('/own-products', data);
    return response.data;
  } catch (err) {
    console.error('Error creating my product:', err);
    throw err;
  }
}

export async function getMyProductById(id) {
  try {
    const response = await api.get(`/own-products/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error fetching my product by id:', err);
    throw err;
  }
}

export async function updateMyProduct(id, data) {
  try {
    const response = await api.post(`/own-products/${id}`, data);
    return response.data;
  } catch (err) {
    console.error('Error updating my product:', err);
    throw err;
  }
}

export async function deleteMyProduct(id) {
  try {
    const response = await api.delete(`/own-products/${id}`);
    return response.data;
  } catch (err) {
    console.error('Error deleting my product:', err);
    throw err;
  }
}

export async function updateMyProductPurchaseStatus(id, status) {
  try {
    const response = await api.post(
      `/own-products/${id}/purchase-status/${status}`
    );
    return response.data;
  } catch (err) {
    console.error('Error updating my product purchase status:', err);
    throw err;
  }
}
