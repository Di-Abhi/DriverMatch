import { ApiConfig } from '../config/api';

export class DriverService {
  static async register(formData: FormData) {
    const response = await ApiConfig.getClient().post('/drivers/register', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  }

  static async getProfile() {
    const response = await ApiConfig.getClient().get('/drivers/profile');
    return response.data;
  }

  static async getAllDrivers() {
    const response = await ApiConfig.getClient().get('/drivers/all');
    return response.data;
  }
}