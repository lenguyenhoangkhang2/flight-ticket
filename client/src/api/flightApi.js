import axiosClient from "./axiosClient";

const getFlights = (date, fromLocation, toLocation) => {
  return axiosClient.get(`/api/flights/`, {
    params: {
      ...(date && { departureDate: date }),
      ...(fromLocation && fromLocation !== "all" && { fromLocation }),
      ...(fromLocation && toLocation !== "all" && { toLocation }),
    },
  });
};

const addOrder = ({ flightId, orders }) => {
  return axiosClient.post(`/api/flights/${flightId}/tickets`, orders);
};

const createSessionPaymentUrl = ({ flightId, ticketIds }) => {
  return axiosClient.post(
    `/api/flights/${flightId}/tickets/checkout-session`,
    ticketIds
  );
};

const getOrderedFlight = () => {
  return axiosClient.get("/api/flights/ordered/me");
};

const createPaymentSessionUrl = ({ flightId, ticketIds }) => {
  return axiosClient.post(`/api/flights/${flightId}/tickets/checkout-session`, {
    ticketIds,
  });
};

const updateFlight = (flight) => {
  return axiosClient.put(`/api/flights/${flight._id}`, flight);
};

const createFlight = (flight) => {
  return axiosClient.post("/api/flights", flight);
};

const flightApi = {
  getFlights,
  addOrder,
  createSessionPaymentUrl,
  getOrderedFlight,
  createPaymentSessionUrl,
  updateFlight,
  createFlight,
};

export default flightApi;
