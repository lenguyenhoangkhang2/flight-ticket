import axiosClient from "./axiosClient";

const getCurrentUser = () => {
  const token = localStorage.getItem("token");

  return axiosClient.get("/api/users/me", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

const login = (email, password) => {
  return axiosClient.post("/api/sessions", {
    email,
    password,
  });
};

export default {
  getCurrentUser,
  login,
};
