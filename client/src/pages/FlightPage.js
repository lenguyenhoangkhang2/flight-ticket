import React, { useCallback, useMemo, useState } from "react";
import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import FlightsTable from "../components/FlightsTable.js";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { format } from "date-fns";
import { useQuery, useQueryClient } from "react-query";
import { Box } from "@mui/system";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FlightDetails from "../components/FlightDetails";
import OrderFlightForm from "../components/OrderFlightForm";
import airportApi from "../api/airportApi";
import flightApi from "../api/flightApi";
import { makeStyles } from "@mui/styles";
import FlightColumns from "../utils/FlightColumns";

const useStyles = makeStyles({
  table: {
    marginTop: 24,

    "& .title": {
      backgroundColor: "#0277bd",
      borderBottom: 0,
    },
  },
  tableHead: {
    "& .MuiTableRow-head": {
      backgroundColor: "#0288d1",
      "& .MuiTableCell-root": {
        fontWeight: "bold",
        color: "#fff",
        borderBottom: "none",
      },
    },
  },
  tableBody: {
    "& .MuiTableCell-body": {
      backgroundColor: "#fafafa",
    },

    "& .MuiTableRow-root:hover": {
      "& .MuiTableCell-body": {
        backgroundColor: "#f5f5f5",
      },
    },
  },
});

const FlightPage = () => {
  const [date, setDate] = useState(new Date());
  const [fromLocation, setFromLocation] = useState("all");
  const [toLocation, setToLocation] = useState("all");
  const [currentOrderedFlightId, setCurrentOrderedFlightId] = useState(null);

  const columns = useMemo(
    () =>
      FlightColumns({
        expander: ({ row }) => (
          <Button
            {...row.getToggleRowExpandedProps()}
            endIcon={
              row.isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />
            }
            fullWidth
            size="small"
            autoCapitalize="none"
          >
            Chi tiết, đặt chỗ
          </Button>
        ),
      }),
    []
  );

  const queryClient = useQueryClient();

  const {
    isLoading: isFlightsLoading,
    data: flights,
    isError: isFlightsError,
    error: flightsError,
  } = useQuery(
    [
      "flights",
      format(date || new Date(), "yyyy/MM/dd"),
      fromLocation,
      toLocation,
    ],
    () => flightApi.getFlights(date, fromLocation, toLocation),
    {
      select: (data) => data.data,
    }
  );

  const {
    isLoading: isAirportsLoading,
    data: airports,
    isError: isAirportsError,
  } = useQuery("airports", airportApi.getAll, {
    select: (data) => data.data,
  });

  const handlerDateChanged = (date) => {
    setDate(date);
    queryClient.invalidateQueries("flights", { active: true });
  };

  const renderFlightDetails = useCallback(
    (flight) => <FlightDetails flight={flight} />,
    []
  );

  const renderRowSubComponent = ({ row: { values }, visibleColumns }) => {
    return (
      <>
        <TableCell
          colSpan={visibleColumns.length}
          style={{ background: "#f5f5f5" }}
          padding="none"
        >
          <Grid container paddingX={20} paddingY={5} spacing={2}>
            <Grid container item xs={8} justifyContent="center">
              {renderFlightDetails(values)}
            </Grid>
            <Grid item xs={4}>
              <Stack
                spacing={2}
                padding={2}
                bgcolor="#fff9c4"
                borderRadius={2}
                border={1}
              >
                <Typography variant="h5" fontWeight="700">
                  Đặt vé
                </Typography>
                <OrderFlightForm
                  flight={values}
                  currentOrderedFlightId={currentOrderedFlightId}
                  setCurrentOrderedFlightId={setCurrentOrderedFlightId}
                />
              </Stack>
            </Grid>
          </Grid>
        </TableCell>
      </>
    );
  };

  const renderLocation = (type) => {
    return (
      <FormControl sx={{ m: 1, minWidth: 200 }} error={isAirportsError}>
        <InputLabel id={`${type}Location-select-label`}>
          {isAirportsLoading
            ? "Loading..."
            : type === "from"
            ? "Điểm khởi hành"
            : "Điểm đến"}
        </InputLabel>
        <Select
          labelId={`${type}Location-select-label`}
          value={type === "from" ? fromLocation : toLocation}
          label={
            isAirportsLoading
              ? "Loading..."
              : type === "from"
              ? "Điểm khởi hành"
              : "Điểm đến"
          }
          autoWidth
          onChange={(e) =>
            type === "from"
              ? setFromLocation(e.target.value)
              : setToLocation(e.target.value)
          }
        >
          <MenuItem value="all">Tất cả</MenuItem>
          {!isAirportsLoading &&
            !isAirportsError &&
            airports.map((airport) => (
              <MenuItem key={airport._id} value={airport._id}>
                {airport.name}
              </MenuItem>
            ))}
        </Select>
        {isAirportsError && (
          <FormHelperText>Loading location error</FormHelperText>
        )}
      </FormControl>
    );
  };

  const renderDayFlightsTable = () => {
    if (isFlightsLoading)
      return (
        <Box marginTop={2} display="flex" alignItems="center">
          <CircularProgress />
          <Typography variant="h6" color="blue" marginLeft={2}>
            Finding...
          </Typography>
        </Box>
      );

    if (isFlightsError) {
      return (
        <Box marginTop={2}>
          <Alert severity="error">
            <AlertTitle>Lỗi</AlertTitle>
            <code>
              {JSON.stringify({ values: flightsError.response.data }, null, 2)}
            </code>
          </Alert>
        </Box>
      );
    }

    return (
      <FlightsTable
        columns={columns}
        data={flights}
        renderRowSubComponent={renderRowSubComponent}
        useStyles={useStyles}
        headerTitle={
          <Typography
            variant="h5"
            fontWeight="bold"
            align="center"
            color="white"
          >
            Danh Sách Chuyến Bay
          </Typography>
        }
        hiddenColumns={["airline", "stopovers", "seats", "_id"]}
      />
    );
  };

  return (
    <>
      <Box display="flex" alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DatePicker
            label="Ngày bay"
            value={date}
            onChange={(date) => handlerDateChanged(date)}
            renderInput={(params) => <TextField {...params} />}
            minDate={new Date()}
          />
        </LocalizationProvider>
        {renderLocation("from")}
        {renderLocation("to")}
      </Box>
      {renderDayFlightsTable()}
    </>
  );
};

export default FlightPage;
