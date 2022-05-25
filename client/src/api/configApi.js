import axiosClient from "./axiosClient";

const getAll = () => {
  return axiosClient.get("/api/configs");
};

const updateConfig = (configValues) => {
  return axiosClient.put("/api/configs", configValues);
};

const airportApi = {
  getAll,
  updateConfig,
};

export default airportApi;
