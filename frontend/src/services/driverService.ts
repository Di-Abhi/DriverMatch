import { getClient } from "../config/api";

type Driver = {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  licenseNo: string;
  licenseUrl: string;
  available: boolean;
  createdAt: string;
  updatedAt?: string;
};

export async function registerDriver(formData: FormData): Promise<Driver> {
  const response = await getClient().post("/drivers/register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data.data;
}

export async function getDriverProfile(): Promise<Driver> {
  const response = await getClient().get("/drivers/profile");
  return response.data.data;
}

export async function getAllDrivers(availableOnly = true): Promise<Driver[]> {
  const url = availableOnly ? "/drivers/all" : "/drivers/all?available=false";
  const response = await getClient().get(url);
  return response.data.data;
}

export async function getDriverById(driverId: string): Promise<Driver> {
  const response = await getClient().get(`/drivers/${driverId}`);
  return response.data.data;
}

export async function updateDriverAvailability(available: boolean): Promise<Driver> {
  const response = await getClient().patch("/drivers/availability", { available });
  return response.data.data;
}

export const DriverService = {
  register: registerDriver,
  getProfile: getDriverProfile,
  getAllDrivers,
  getById: getDriverById,
  updateAvailability: updateDriverAvailability,
};