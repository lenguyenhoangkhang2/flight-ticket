import { Typography } from "@mui/material";
import FlightsTable from "../components/FlightsTable.js";
import MOCK_FLIGHTS from "../MOCK_FLIGHTS.json";

const FlightPage = () => {
  return (
    <div>
      <Typography
        variant="h5"
        marginTop={4}
        marginBottom={2}
        fontWeight="bold"
        align="center"
        color="#424242"
      >
        Danh Sách Chuyến Bay
      </Typography>
      <FlightsTable flights={MOCK_FLIGHTS} />
    </div>
  );
};

export default FlightPage;
