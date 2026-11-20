import api from './api';

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    if (response.data.token) {
      localStorage.setItem('sms_auth_token', response.data.token);
      localStorage.setItem('sms_auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout');
    } finally {
      localStorage.removeItem('sms_auth_token');
      localStorage.removeItem('sms_auth_user');
    }
  },

  async getMe() {
    const response = await api.get('/auth/me');
    return response.data;
  },

  async updateProfile(profileData) {
    const response = await api.put('/auth/profile', profileData);
    if (response.data.user) {
      localStorage.setItem('sms_auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  }
};
