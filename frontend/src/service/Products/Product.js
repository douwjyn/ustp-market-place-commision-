import { api } from '../../lib/axios';

export async function getProducts() {
  try {
    const response = await api.get('/products');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
}

export async function getProductById(id) {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product by id:', error);
    throw error;
  }
}

export async function buyProduct(id, quantity) {
  try {
    const response = await api.post(`/products/${id}/purchase/${quantity}`);
    return response.data;
  } catch (error) {
    console.error('Error buying product:', error);
    throw error;
  }
}

export async function cancelPurchase(id) {
  try {
    const response = await api.post(`/products/${id}/purchase`);
    return response.data;
  } catch (error) {
    console.error('Error canceling purchase:', error);
    throw error;
  }
}

export async function confirmPurchase(id) {
  try {
    const response = await api.post(`/products/${id}/confirm-purchase`);
    return response.data;
  } catch (error) {
    console.error('Error confirming purchase:', error);
    throw error;
  }
}

export async function confirmPurchaseByShop(id) {
  try {
    const response = await api.post(`/products/${id}/confirm-purchase-by-shop`);
    return response.data;
  } catch (error) {
    console.error('Error confirming purchase by shop:', error);
    throw error;
  }
}

// Filters

export async function byCategory(category, shop_id) {
  try {
    const response = await api.get(`/products/${category}/${shop_id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    throw error;
  }
}

export async function byPrice(price, direction, shop_id) {
  try {
    const response = await api.get(
      `/products/${price}/${direction}/${shop_id}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching products by price:', error);
    throw error;
  }
}

export async function bySearch(query) {
  try {
    const response = await api.get(`/products/${query}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching products by search:', error);
    throw error;
  }
}
