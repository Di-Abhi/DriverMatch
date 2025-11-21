import { getClient } from "../config/api";

type BookingPeriod = "hourly" | "daily" | "weekly" | "monthly";
type BookingStatus = "pending" | "accepted" | "rejected" | "cancelled" | "completed";

type BookingRequest = {
  id: string;
  userId: string;
  driverId: string;
  period: BookingPeriod;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    phone: string;
  };
  driver?: {
    id: string;
    name: string;
    email: string;
    phone: string;
    licenseNo: string;
  };
};

type CreateBookingData = {
  userId: string;
  driverId: string;
  period: string;
};

export async function createBookingRequest(data: CreateBookingData): Promise<BookingRequest> {
  const response = await getClient().post("/bookings/request", data);
  return response.data.data;
}

export async function getUserBookings(userId: string): Promise<BookingRequest[]> {
  const response = await getClient().get(`/bookings/user/${userId}`);
  return response.data.data;
}

export async function getDriverBookings(driverId: string): Promise<BookingRequest[]> {
  const response = await getClient().get(`/bookings/driver/${driverId}`);
  return response.data.data;
}

export async function getBookingDetails(requestId: string): Promise<BookingRequest> {
  const response = await getClient().get(`/bookings/${requestId}`);
  return response.data.data;
}

export async function updateBookingStatus(requestId: string, status: BookingStatus): Promise<BookingRequest> {
  const response = await getClient().patch(`/bookings/${requestId}/status`, { status });
  return response.data.data;
}

export async function cancelBooking(requestId: string, userId: string): Promise<BookingRequest> {
  const response = await getClient().post(`/bookings/${requestId}/cancel`, { userId });
  return response.data.data;
}

export const BookingService = {
  createRequest: createBookingRequest,
  getUserRequests: getUserBookings,
  getDriverRequests: getDriverBookings,
  getRequestDetails: getBookingDetails,
  updateRequestStatus: updateBookingStatus,
  cancelRequest: cancelBooking,
};