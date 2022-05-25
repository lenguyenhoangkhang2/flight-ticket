import axiosClient from "./axiosClient";

const getAll = () => {
  return axiosClient.get("/api/airports");
};

const updateAirport = ({ _id, name, location }) => {
  return axiosClient.put(`/api/airports/${_id}`, {
    name,
    location,
  });
};

const createAirport = ({ name, location }) => {
  return axiosClient.post(`/api/airports`, {
    name,
    location,
  });
};

const airportApi = {
  getAll,
  updateAirport,
  createAirport,
};

export default airportApi;
