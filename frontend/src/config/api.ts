import axios from 'axios';

export class ApiConfig {
  private static instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL
  });

  static setAuthToken(token: string) {
    this.instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  static getClient() {
    return this.instance;
  }
}