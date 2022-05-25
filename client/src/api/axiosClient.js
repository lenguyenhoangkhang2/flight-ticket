import axios from "axios";
// import authApi from "./authApi";

const axiosClient = axios.create({
  baseURL: "http://localhost:8080",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosClient.defaults.withCredentials = true;

// axiosClient.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const originalConfig = error.config;

//     if (error.response) {
//       if (error.response.status === 401 && !originalConfig._retry) {
//         originalConfig._retry = true;

//         try {
//           const { data } = await authApi.refreshToken();
//           const { accessToken } = data;

//           localStorage.setItem("token", accessToken);

//           return axiosClient.request({
//             ...originalConfig,
//             headers: {
//               Authorization: `Bearer ${accessToken}`,
//             },
//           });
//         } catch (_error) {
//           localStorage.removeItem("token");
//           localStorage.removeItem("refreshToken");

//           if (_error.response.status === 401 && _error.response.data) {
//             return Promise.reject(_error.response.data);
//           }
//           return Promise.reject(_error);
//         }
//       }

//       if (error.response.status === 403 && error.response.data) {
//         return Promise.reject(error.response.data);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

export default axiosClient;
