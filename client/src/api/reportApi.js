import axiosClient from "./axiosClient";
// import axiosClient from "axios";

const getAllMonthReport = () => {
  return axiosClient.get("/api/reports/month");
};

const getAllYearReport = () => {
  return axiosClient.get("/api/reports/year");
};

const createMonthReport = (time) => {
  return axiosClient.post("/api/reports/month", {
    time,
  });
};

const createYearReport = (time) => {
  return axiosClient.post("/api/reports/year", {
    time,
  });
};

const updateMonthReport = (reportId) => {
  return axiosClient.put(`/api/reports/month/${reportId}`);
};

const updateYearReport = (reportId) => {
  return axiosClient.put(`/api/reports/year/${reportId}`);
};

const deleteMonthReport = (reportId) => {
  return axiosClient.delete(`/api/reports/month/${reportId}`);
};

const deleteYearReport = (reportId) => {
  return axiosClient.delete(`/api/reports/year/${reportId}`);
};

const reportApi = {
  getAllMonthReport,
  getAllYearReport,
  createMonthReport,
  createYearReport,
  updateMonthReport,
  updateYearReport,
  deleteMonthReport,
  deleteYearReport,
};

export default reportApi;
