import axios from "axios";

const client = axios.create({
  baseURL: "http://localhost:8000",
});

const request = ({ ...option }) => {
  const token = localStorage.getItem("accessToken");

  client.defaults.headers.common.Authorization = "Bearer";

  const onSuccess = (response) => response;
  const onError = (error) => error;

  return client(option).then(onSuccess, onError);
};

export default request;
