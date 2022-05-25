import { differenceInHours, differenceInMinutes, format } from "date-fns";

const flightColumns = ({ expander }) => [
  { accessor: "_id" },
  {
    Header: "HHK",
    accessor: "airline",
  },
  {
    Header: () => null,
    accessor: "stopovers",
  },
  {
    Header: () => null,
    accessor: "seats",
  },
  {
    Header: "Điểm khởi hành",
    accessor: "fromLocation",
    Cell: ({ value }) => String(value.name),
  },
  {
    Header: "Điểm đến",
    accessor: "toLocation",
    Cell: ({ value }) => String(value.name),
  },
  {
    Header: "Giờ đi",
    accessor: "departureTime",
    Cell: ({ value }) => format(new Date(value), "Pp"),
  },
  {
    Header: "Giờ đến",
    accessor: "arrivalTime",
    Cell: ({ value }) => format(new Date(value), "Pp"),
  },
  {
    Header: "TG bay",
    accessor: ({ departureTime, arrivalTime }) => {
      const localDepartureTime = new Date(departureTime);
      const localArrivalTime = new Date(arrivalTime);

      return { localDepartureTime, localArrivalTime };
    },
    Cell: ({ value: { localDepartureTime, localArrivalTime } }) => {
      const hours = differenceInHours(localArrivalTime, localDepartureTime);
      const minutes =
        differenceInMinutes(localArrivalTime, localDepartureTime) - 60 * hours;

      let duration;

      if (!hours) {
        duration = minutes + "m";
      } else if (!minutes) {
        duration = hours + "h";
      } else {
        duration = `${hours}h ${minutes}m`;
      }

      return duration;
    },
    id: "duration",
  },
  {
    Header: "Giá vé",
    accessor: "price",
    Cell: ({ value }) =>
      Intl.NumberFormat("vn-VN", {
        style: "currency",
        currency: "VND",
      }).format(value),
  },
  {
    Header: () => null,
    id: "expander",
    Cell: (value) => expander(value),
    disableSortBy: true,
  },
];

export default flightColumns;
