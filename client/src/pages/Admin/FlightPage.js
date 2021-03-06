import {
  Alert,
  AlertTitle,
  Button,
  CircularProgress,
  Grid,
  Modal,
  Stack,
  TableCell,
  TextField,
  Typography,
} from "@mui/material";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { format } from "date-fns";
import { useMemo, useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import flightApi from "../../api/flightApi.js";
import FlightColumns from "../../utils/FlightColumns.js";
import { Box } from "@mui/system";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { makeStyles } from "@mui/styles";
import FlightsTable from "../../components/FlightsTable.js";
import AirportLocationSelect from "../../components/AirportLocationSelect";
import FlightForm from "../../components/FlightForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "white",
  border: "1px solid #333",
  boxShadow: 24,
  p: 4,
};

const useStyles = makeStyles({
  menuPaper: {
    maxHeight: 200,
  },
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
});

export default function FlightPage() {
  // const classes = useStyles();

  const [date, setDate] = useState(new Date());
  const [fromLocation, setFromLocation] = useState("all");
  const [toLocation, setToLocation] = useState("all");

  const [flightFormOpen, setflightFormOpen] = useState(false);

  const handleOpenFlightForm = () => {
    setflightFormOpen(true);
  };
  const handleCloseFlightForm = () => {
    setflightFormOpen(false);
  };

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
            Chi ti???t
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
      "admin",
    ],
    () => flightApi.getFlights(date, fromLocation, toLocation),
    {
      select: (data) => data.data,
    }
  );

  const handlerDateChanged = (date) => {
    setDate(date);
    queryClient.invalidateQueries("flights", { active: true });
  };

  const renderRowSubComponent = ({ row: { values }, visibleColumns }) => {
    const index = flights.findIndex((flight) => flight._id === values._id);

    if (index === -1)
      return <Alert severity="error">Kh??ng t??m th???y th??ng tin</Alert>;

    const flight = flights[index];

    return (
      <>
        <TableCell
          colSpan={visibleColumns.length}
          style={{ background: "#f5f5f5" }}
          padding="none"
        >
          <Box padding={5}>
            <FlightForm data={flight} showBtnOpenOrdered={true} />
          </Box>
        </TableCell>
      </>
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
            <AlertTitle>L???i</AlertTitle>
            <code>
              {JSON.stringify({ values: flightsError.response.data }, null, 2)}
            </code>
          </Alert>
        </Box>
      );
    }

    return (
      <>
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
              {`DS Chuy???n Bay - ${format(date, "PPPP")}`}
            </Typography>
          }
          hiddenColumns={["airline", "stopovers", "seats", "_id"]}
        />
      </>
    );
  };

  return (
    <Box marginBottom={20}>
      <Stack spacing={2}>
        <Grid container>
          <Grid item xs={3}>
            <Stack spacing={2}>
              <Typography variant="h5" fontWeight="700" color="#333">
                Th??m chuy???n bay m???i
              </Typography>
              <Button
                variant="contained"
                onClick={handleOpenFlightForm}
                size="large"
              >
                Th??m chuy???n bay
              </Button>
              <Modal
                open={flightFormOpen}
                onClose={handleCloseFlightForm}
                aria-labelledby="create-flight-modal-title"
              >
                <Box sx={{ ...style, width: 800 }} padding={20} bgcolor="#fff">
                  <Typography
                    id="create-flight-modal-title"
                    fontWeight="700"
                    color="#333"
                    variant="h5"
                    component="h2"
                    marginBottom={4}
                  >
                    Th??ng tin chuy???n bay m???i
                  </Typography>
                  <FlightForm defaultType="create" />
                </Box>
              </Modal>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <Stack spacing={2} marginTop={5}>
        <Typography variant="h5" fontWeight="700" color="#333">
          T??m ki???m, ch???nh s???a th??ng tin chuy???n bay
        </Typography>
        <Stack direction="row" spacing={2}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Ng??y bay"
              value={date}
              onChange={(date) => handlerDateChanged(date)}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <AirportLocationSelect
            label="??i???m kh???i h??nh"
            onChange={(e) => setFromLocation(e)}
          />
          <AirportLocationSelect
            label="??i???m ?????n"
            onChange={(e) => setToLocation(e)}
          />
        </Stack>
        {renderDayFlightsTable()}
      </Stack>
    </Box>
  );
}
