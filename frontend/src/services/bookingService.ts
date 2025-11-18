import { ApiConfig } from '../config/api';

export class BookingService {
  static async createRequest(data: {
    userId: string;
    driverId: string;
    period: string;
  }) {
    const response = await ApiConfig.getClient().post('/bookings/request', data);
    return response.data;
  }

  static async getUserRequests(userId: string) {
    const response = await ApiConfig.getClient().get(`/bookings/user/${userId}`);
    return response.data;
  }

  static async getDriverRequests(driverId: string) {
    const response = await ApiConfig.getClient().get(`/bookings/driver/${driverId}`);
    return response.data;
  }

  static async updateRequestStatus(requestId: string, status: string) {
    const response = await ApiConfig.getClient().patch(`/bookings/${requestId}/status`, { status });
    return response.data;
  }

  static async getRequestDetails(requestId: string) {
    const response = await ApiConfig.getClient().get(`/bookings/${requestId}`);
    return response.data;
  }
}