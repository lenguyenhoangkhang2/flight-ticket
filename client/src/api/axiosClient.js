import axios from "axios";
import authApi from "./authApi";

const axiosClient = axios.create({
  baseURL: "http://localhost:8000",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalConfig = error.config;

    if (error.response) {
      if (error.response.data?.message === "Session is not valid") {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        return Promise.reject(error);
      }

      if (
        error.response.status === 401 &&
        !originalConfig._retry &&
        error.response.data.message === "jwt error"
      ) {
        originalConfig._retry = true;

        try {
          const { data } = await authApi.refreshToken();
          const { accessToken } = data;

          localStorage.setItem("token", accessToken);

          return axiosClient.request({
            ...originalConfig,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });
        } catch (_error) {
          if (_error.response && _error.response.data) {
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");

            return Promise.reject(_error.response.data);
          }
          return Promise.reject(_error);
        }
      }

      if (error.response.status === 403 && error.response.data) {
        return Promise.reject(error.response.data);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
