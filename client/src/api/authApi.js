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

const signup = (data) => {
  return axiosClient.post("/api/users", data);
};

const verifyAccount = ({ verificationCode, userId }) => {
  return axiosClient.post("/api/users/verify", {
    verificationCode,
    id: userId,
  });
};

const sendEmailResetPassword = (email) => {
  return axiosClient.post("/api/users/forgot-password", {
    email,
  });
};

const resetPassword = ({
  userId,
  passwordResetCode,
  password,
  passwordConfirmation,
}) => {
  return axiosClient.post(
    `/api/users/reset-password/${userId}/${passwordResetCode}`,
    {
      password,
      passwordConfirmation,
    }
  );
};

const authApi = {
  getCurrentUser,
  login,
  logout,
  signup,
  verifyAccount,
  sendEmailResetPassword,
  resetPassword,
};

export default authApi;
