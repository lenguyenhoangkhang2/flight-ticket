import axiosClient from "./axiosClient";

const getAll = () => {
  return axiosClient.get("/api/seats");
};

const updateSeatclass = ({ _id, className, extraFee }) => {
  return axiosClient.put(`/api/seats/${_id}`, {
    className,
    extraFee,
  });
};

const createSeatclass = ({ className, extraFee }) => {
  return axiosClient.post(`/api/seats`, {
    className,
    extraFee,
  });
};

const seatApi = {
  getAll,
  updateSeatclass,
  createSeatclass,
};

export default seatApi;
