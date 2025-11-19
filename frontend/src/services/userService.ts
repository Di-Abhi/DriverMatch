import ApiConfig from "../config/api";

export const UserService = {
  register: async (data: {
    clerkId: string;
    name: string;
    email: string;
    phone: string;
  }) => {
    const response = await ApiConfig.getClient().post("/users/register", data);
    return response.data;
  },

  getProfile: async () => {
    const response = await ApiConfig.getClient().get("/users/profile");
    return response.data;
  },

  logout: async () => {
    const response = await ApiConfig.getClient().post("/users/logout");
    return response.data;
  },
};
