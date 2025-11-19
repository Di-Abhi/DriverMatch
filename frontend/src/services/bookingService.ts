import ApiConfig from "../config/api";

export const BookingService = {
  createRequest: async (data: {
    userId: string;
    driverId: string;
    period: string;
  }) => {
    const response = await ApiConfig.getClient().post("/bookings/request", data);
    return response.data;
  },

  getUserRequests: async (userId: string) => {
    const response = await ApiConfig.getClient().get(`/bookings/user/${userId}`);
    return response.data;
  },

  getDriverRequests: async (driverId: string) => {
    const response = await ApiConfig.getClient().get(`/bookings/driver/${driverId}`);
    return response.data;
  },

  updateRequestStatus: async (requestId: string, status: string) => {
    const response = await ApiConfig.getClient().patch(
      `/bookings/${requestId}/status`,
      { status }
    );
    return response.data;
  },

  getRequestDetails: async (requestId: string) => {
    const response = await ApiConfig.getClient().get(`/bookings/${requestId}`);
    return response.data;
  },
};
