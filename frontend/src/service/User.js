import { api } from '../lib/axios';

export async function me() {
  try {
    const response = await api.get('/user');
    console.log('me', response.data)
    return response.data;
  } catch (err) {
    console.error('Error fetching user:', err);
    throw err;
  }
}

export async function updateMe(data) {
  try {
    const response = await api.post('/user', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  } catch (err) {
    console.error('Error updating user:', err);
    throw err;
  }
}

export async function softDeleteMe() {
  try {
    const response = await api.delete('/user');
    return response.data;
  } catch (err) {
    console.error('Error soft deleting user:', err);
    throw err;
  }
}

export async function historyPurchasesMe() {
  try {
    const response = await api.get('/user/purchases');
    return response.data;
  } catch (err) {
    console.error('Error fetching user history purchases:', err);
    throw err;
  }
}


export async function logout() {
  try {
    const response = await api.post('/logout');
    sessionStorage.removeItem('access_token');
    return response.data;
  } catch (err) {
    console.error('Error logging out:', err);
    throw err;
  }
}