import { ApiConfig } from '../config/api';

export class UserService {
  static async register(data: {
    clerkId: string;
    name: string;
    email: string;
    phone: string;
  }) {
    const response = await ApiConfig.getClient().post('/users/register', data);
    return response.data;
  }

  static async getProfile() {
    const response = await ApiConfig.getClient().get('/users/profile');
    return response.data;
  }
  static async logout() {
    const response = await ApiConfig.getClient().post('/users/logout');
    return response.data;
  }
}