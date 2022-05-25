import { useQuery } from "react-query";
import { format } from "date-fns";
import flightApi from "../api/flightApi";

const useDayFlights = ({ date, onSuccess, onError }) => {
  if (!date) {
    date = new Date();
  }

  return useQuery(
    ["flights", format(date, "yyyy/MM/dd")],
    () => flightApi.getDayFlights(date),
    {
      onSuccess,
      onError,
      select: (data) => data.data,
    }
  );
};

export default useDayFlights;
