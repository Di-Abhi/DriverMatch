import ApiConfig from "../config/api";

export const DriverService = {
  register: async (formData: FormData) => {
    const response = await ApiConfig.getClient().post("/drivers/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  getProfile: async () => {
    const response = await ApiConfig.getClient().get("/drivers/profile");
    return response.data;
  },

  getAllDrivers: async () => {
    const response = await ApiConfig.getClient().get("/drivers/all");
    return response.data;
  },
};
