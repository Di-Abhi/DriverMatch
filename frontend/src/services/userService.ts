import { getClient } from "../config/api";

type UserRegistrationData = {
  clerkId: string;
  name: string;
  email: string;
  phone: string;
};

type UserProfile = {
  id: string;
  clerkId: string;
  name: string;
  email: string;
  phone: string;
  userType: string;
  createdAt: string;
  updatedAt: string;
};

export async function registerUser(data: UserRegistrationData): Promise<UserProfile> {
  const response = await getClient().post("/users/register", data);
  return response.data.data;
}

export async function getUserProfile(): Promise<UserProfile> {
  const response = await getClient().get("/users/profile");
  return response.data.data;
}

export async function updateUserProfile(data: { name?: string; phone?: string }): Promise<UserProfile> {
  const response = await getClient().put("/users/profile", data);
  return response.data.data;
}

export async function logoutUser(): Promise<void> {
  await getClient().post("/users/logout");
}

export const UserService = {
  register: registerUser,
  getProfile: getUserProfile,
  updateProfile: updateUserProfile,
  logout: logoutUser,
};