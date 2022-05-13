import axiosClient from "./axiosClient";

const getLocalToken = () => {
  const token = localStorage.getItem("token");
  return token;
};

const getCurrentUser = () => {
  return axiosClient.get("/api/users/me", {
    headers: {
      Authorization: `Bearer ${getLocalToken()}`,
    },
  });
};

const login = (email, password) => {
  return axiosClient.post("/api/sessions", {
    email,
    password,
  });
};

const logout = () => {
  return axiosClient.post(
    "/api/sessions/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${getLocalToken()}`,
      },
    }
  );
};

const refreshToken = () => {
  return axiosClient.post(
    "/api/sessions/refresh",
    {},
    {
      headers: {
        "x-refresh": localStorage.getItem("refreshToken"),
      },
    }
  );
};

const signup = (data) => {
  return axiosClient.post("/api/users", data);
};

const authApi = {
  getCurrentUser,
  login,
  logout,
  refreshToken,
  signup,
};

export default authApi;
