import React, { forwardRef, useEffect, useState } from "react";
import {
  Alert as MuiAlert,
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  Modal,
  // Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import AirportLocationSelect from "../components/AirportLocationSelect";
import SeatClassSelect from "../components/SeatClassSelect";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import _ from "lodash/fp";
import { useMutation, useQueryClient } from "react-query";
import flightApi from "../api/flightApi";
import zodValidate from "../utils/zodValidate.js";
import NumberFormat from "react-number-format";
import { minutesToSeconds, secondsToMinutes } from "date-fns";
import { Box } from "@mui/system";
import FlightOrderTable from "./FlightOrderTable";

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

const initialData = {
  _id: "",
  airline: "",
  fromLocation: "",
  toLocation: "",
  seats: [],
  stopovers: [],
  arrivalTime: new Date(),
  departureTime: new Date(),
  price: 0,
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const FlightForm = ({
  data = initialData,
  defaultType = "view",
  showBtnOpenOrdered = false,
}) => {
  const [type, setType] = useState(defaultType);
  const [flight, setFlight] = useState({
    ...data,
    _id: data._id,
    airline: data.airline,
    fromLocation: data.fromLocation._id,
    toLocation: data.toLocation._id,
    seats: data.seats.map((seat) => ({ ...seat, type: seat.type._id })),
    stopovers: data.stopovers.map((stopover) => ({
      ...stopover,
      delay: secondsToMinutes(stopover.delay),
      airport: stopover.airport._id,
    })),
    arrivalTime: new Date(data.arrivalTime),
    departureTime: new Date(data.departureTime),
    price: data.price,
  });
  const [errors, setErrors] = useState(null);
  const [orderedTableOpen, setOrderedTableOpen] = useState(false);
  const catchFlight = useState({ ...flight })[0];

  const isReadOnly = type === "view" ? true : false;

  const queryClient = useQueryClient();
  const updateFlightMutate = useMutation(flightApi.updateFlight);
  const createFlightMutate = useMutation(flightApi.createFlight);

  const handleUpdateFlight = () => {
    updateFlightMutate.mutate(flightWithStopoverDelayToSecond(), {
      onSuccess: () => {
        queryClient.invalidateQueries("flights", { active: true });
      },
    });
  };

  const handleCreateFlight = () => {
    createFlightMutate.mutate(
      _.omit("_id", flightWithStopoverDelayToSecond()),
      {
        onSuccess: () => {
          queryClient.invalidateQueries("flights", { active: true });
          setFlight(catchFlight);
        },
      }
    );
  };

  const flightWithStopoverDelayToSecond = () => {
    const stopovers = flight.stopovers.map((stopover) => ({
      ...stopover,
      delay: minutesToSeconds(stopover.delay),
    }));

    return _.set("stopovers", stopovers, flight);
  };

  const renderBtnOpenOrdered = () => {
    if (flight.tickets?.length > 0)
      return (
        <Button
          onClick={() => setOrderedTableOpen(true)}
          sx={{ width: 220 }}
          variant="contained"
        >
          Xem ?????t tr?????c
        </Button>
      );

    return <Typography variant="body2">Ch??a c?? l?????t ?????t tr?????c n??o</Typography>;
  };

  useEffect(() => {
    setType(defaultType);
  }, [defaultType]);

  useEffect(() => {
    if (updateFlightMutate.isError) {
      setErrors(updateFlightMutate.error.response.data);
    }

    if (createFlightMutate.isError) {
      setErrors(createFlightMutate.error.response.data);
    }
  }, [updateFlightMutate, createFlightMutate]);

  useEffect(() => {
    updateFlightMutate.reset();
    createFlightMutate.reset();
    setErrors(null);
  }, [flight]);

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <Stack spacing={2}>
            {type !== "create" && (
              <TextField
                label="M?? chuy???n bay"
                value={flight._id}
                InputProps={{ readOnly: true }}
              />
            )}
            <TextField
              label="H??ng h??ng kh??ng"
              value={flight.airline}
              onChange={(e) =>
                setFlight({ ...flight, airline: e.target.value })
              }
              InputProps={{
                readOnly: isReadOnly,
              }}
              error={
                errors && zodValidate(errors, ["body", "airline"]).hasError
              }
              helperText={
                errors && zodValidate(errors, ["body", "airline"]).message
              }
            />
            <NumberFormat
              value={flight.price}
              customInput={TextField}
              label="Gi?? v??"
              suffix=" ??"
              thousandSeparator
              allowNegative={false}
              inputProps={{ readOnly: isReadOnly }}
              onValueChange={({ value: v }) =>
                setFlight({ ...flight, price: +v })
              }
              error={errors && zodValidate(errors, ["body", "price"]).hasError}
              helperText={
                errors && zodValidate(errors, ["body", "price"]).message
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={2}>
            <AirportLocationSelect
              label="??i???m kh???i h??nh"
              onChange={(e) => setFlight({ ...flight, fromLocation: e })}
              InputProps={{
                readOnly: isReadOnly,
              }}
              value={flight.fromLocation}
              notSelectAll={true}
              error={
                errors && zodValidate(errors, ["body", "fromLocation"]).hasError
              }
              helperText={
                errors && zodValidate(errors, ["body", "fromLocation"]).message
              }
            />
            <AirportLocationSelect
              label="??i???m ?????n"
              onChange={(e) => setFlight({ ...flight, toLocation: e })}
              InputProps={{
                readOnly: isReadOnly,
              }}
              value={flight.toLocation}
              notSelectAll={true}
              error={
                errors && zodValidate(errors, ["body", "toLocation"]).hasError
              }
              helperText={
                errors && zodValidate(errors, ["body", "toLocation"]).message
              }
            />
          </Stack>
        </Grid>
        <Grid item xs={4}>
          <Stack spacing={2}>
            <DateTimePicker
              label="Th???i gian ??i"
              value={flight.departureTime}
              onChange={(e) => setFlight({ ...flight, departureTime: e })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={
                    errors &&
                    zodValidate(errors, ["body", "departureTime"]).hasError
                  }
                  helperText={
                    errors &&
                    zodValidate(errors, ["body", "departureTime"]).message
                  }
                />
              )}
              readOnly={isReadOnly}
            />
            <DateTimePicker
              label="Th???i gian ?????n"
              value={flight.arrivalTime}
              onChange={(e) => setFlight({ ...flight, arrivalTime: e })}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={
                    errors &&
                    zodValidate(errors, ["body", "arrivalTime"]).hasError
                  }
                  helperText={
                    errors &&
                    zodValidate(errors, ["body", "arrivalTime"]).message
                  }
                />
              )}
              readOnly={isReadOnly}
            />
          </Stack>
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight="700">
                  ??i???m d???ng ch??n
                </Typography>
                {_.isEmpty(flight.stopovers) && (
                  <Typography color="#555">Kh??ng c?? ??i???m d???ng ch??n</Typography>
                )}
                {errors && zodValidate(errors, ["body", "stopovers"]).hasError && (
                  <Alert severity="error" variant="filled">
                    {zodValidate(errors, ["body", "stopovers"]).message}
                  </Alert>
                )}
              </Stack>
            </Grid>
          </Grid>
          {flight.stopovers.map((stopover, i) => (
            <React.Fragment key={i}>
              <Grid item xs={4}>
                <Stack>
                  <AirportLocationSelect
                    label={"??i???m d???ng th??? " + i}
                    onChange={(e) =>
                      setFlight(_.set(`stopovers[${i}].airport`, e, flight))
                    }
                    InputProps={{
                      readOnly: isReadOnly,
                    }}
                    value={stopover.airport}
                    notSelectAll={true}
                    error={
                      errors &&
                      zodValidate(errors, ["body", "stopovers", i, "airport"])
                        .hasError
                    }
                    helperText={
                      errors &&
                      zodValidate(errors, ["body", "stopovers", i, "airport"])
                        .message
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={2}>
                <Stack>
                  <NumberFormat
                    value={stopover.delay}
                    customInput={TextField}
                    label="Th???i gian ch???"
                    suffix=" ph??t"
                    thousandSeparator={false}
                    allowNegative={false}
                    inputProps={{ readOnly: isReadOnly }}
                    onValueChange={({ value: v }) =>
                      setFlight(_.set(`stopovers[${i}].delay`, +v, flight))
                    }
                    error={
                      errors &&
                      zodValidate(errors, ["stopovers", i, "delay"]).hasError
                    }
                    helperText={
                      errors &&
                      zodValidate(errors, ["stopovers", i, "delay"]).message
                    }
                  />
                </Stack>
              </Grid>
              <Grid item xs={5}>
                <TextField
                  label="Ghi ch??"
                  fullWidth
                  value={stopover.note}
                  InputProps={{ readOnly: isReadOnly }}
                  onChange={(e) =>
                    setFlight(
                      _.set(`stopovers[${i}].note`, e.target.value, flight)
                    )
                  }
                />
              </Grid>
              {type !== "view" && (
                <Grid
                  item
                  xs={1}
                  display="flex"
                  alignItems="center"
                  justifyContent="start"
                >
                  <IconButton
                    onClick={() => {
                      setFlight({
                        ...flight,
                        stopovers: flight.stopovers.filter(
                          (_, idx) => idx !== i
                        ),
                      });
                    }}
                    color="error"
                  >
                    <HighlightOffIcon />
                  </IconButton>
                </Grid>
              )}
            </React.Fragment>
          ))}
          {type !== "view" && (
            <Grid item xs={12}>
              <Button
                onClick={() =>
                  setFlight({
                    ...flight,
                    stopovers: _.concat(flight.stopovers, {
                      airport: "",
                      delay: 0,
                      note: "",
                    }),
                  })
                }
                variant="contained"
              >
                Th??m ??i???m d???ng ch??n
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight="700">
                  H???ng gh??? - v??
                </Typography>
                {_.isEmpty(flight.seats) && (
                  <Typography color="#555">Kh??ng c?? ??i???m d???ng ch??n</Typography>
                )}
                {errors && zodValidate(errors, ["body", "seats"]).hasError && (
                  <Alert severity="error" variant="filled">
                    {zodValidate(errors, ["body", "seats"]).message}
                  </Alert>
                )}
              </Stack>
            </Grid>
          </Grid>
          {flight.seats.map((seat, i) => (
            <React.Fragment key={i}>
              <Grid container item xs={12} spacing={2}>
                <Grid item xs={4}>
                  <Stack>
                    <SeatClassSelect
                      label={`H???ng gh??? - v?? (${i})`}
                      inputProps={{ readOnly: isReadOnly }}
                      value={seat.type}
                      onChange={(e) =>
                        setFlight(_.set(`seats[${i}].type`, e, flight))
                      }
                      error={
                        errors &&
                        zodValidate(errors, ["body", "seats", i, "type"])
                          .hasError
                      }
                      helperText={
                        errors &&
                        zodValidate(errors, ["body", "seats", i, "type"])
                          .message
                      }
                    />
                  </Stack>
                </Grid>
                <Grid item xs={2}>
                  <TextField
                    label="S??? l?????ng"
                    fullWidth
                    type="number"
                    inputProps={{
                      min: 0,
                      max: 100,
                      readOnly: isReadOnly,
                    }}
                    value={seat.amount}
                    onChange={(e) =>
                      setFlight(
                        _.set(`seats[${i}].amount`, +e.target.value, flight)
                      )
                    }
                    error={
                      errors &&
                      zodValidate(errors, ["body", "seats", i, "amount"])
                        .hasError
                    }
                    helperText={
                      errors &&
                      zodValidate(errors, ["body", "seats", i, "amount"])
                        .message
                    }
                  />
                </Grid>
                {type !== "view" && (
                  <Grid
                    item
                    xs={1}
                    display="flex"
                    alignItems="center"
                    justifyContent="start"
                  >
                    <IconButton
                      onClick={() => {
                        setFlight({
                          ...flight,
                          seats: flight.seats.filter((_, idx) => idx !== i),
                        });
                      }}
                      color="error"
                    >
                      <HighlightOffIcon />
                    </IconButton>
                  </Grid>
                )}
              </Grid>
            </React.Fragment>
          ))}
          {type !== "view" && (
            <Grid item xs={12}>
              <Button
                onClick={() =>
                  setFlight({
                    ...flight,
                    seats: _.concat(flight.seats, { type: "", amount: 0 }),
                  })
                }
                variant="contained"
              >
                Th??m h???ng v?? gh???
              </Button>
            </Grid>
          )}
          {showBtnOpenOrdered && (
            <Grid item xs={12}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight="700">
                  Danh s??ch ?????t tr?????c
                </Typography>
                {renderBtnOpenOrdered()}
              </Stack>
            </Grid>
          )}
        </Grid>
        <Grid item xs={12} display="flex" justifyContent="end">
          {type === "view" && (
            <Button
              size="large"
              variant="contained"
              onClick={() => setType("update")}
            >
              C???p nh???t th??ng tin
            </Button>
          )}
          {type === "update" && (
            <Stack direction="row" spacing={2}>
              <Button
                size="large"
                variant="contained"
                onClick={() => {
                  setFlight(catchFlight);
                  setType("view");
                  setErrors(null);
                }}
                color="inherit"
              >
                Ho??n t??c
              </Button>
              <Button
                size="large"
                variant="contained"
                onClick={handleUpdateFlight}
                disabled={_.isEqual(flight, catchFlight)}
              >
                L??u l???i
              </Button>
            </Stack>
          )}
          {type === "create" && (
            <>
              <Stack spacing={1}>
                {createFlightMutate.isSuccess && (
                  <Alert severity="success" variant="filled">
                    Th??m chuy???n bay th??nh c??ng
                  </Alert>
                )}
                <Button
                  size="large"
                  variant="contained"
                  onClick={handleCreateFlight}
                >
                  Th??m chuy???n bay
                </Button>
              </Stack>
            </>
          )}
        </Grid>
      </Grid>

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={updateFlightMutate.isLoading || createFlightMutate.isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <Modal
        open={orderedTableOpen}
        onClose={() => setOrderedTableOpen(false)}
        aria-labelledby="create-flight-modal-title"
      >
        <Box
          sx={{ ...style, width: "fit-content" }}
          padding={20}
          bgcolor="#fff"
        >
          <Typography
            id="create-flight-modal-title"
            fontWeight="700"
            color="#333"
            variant="h5"
            component="h2"
            marginBottom={4}
          >
            Th??ng tin ?????c tr?????c
          </Typography>
          <FlightOrderTable data={flight.tickets} />
        </Box>
      </Modal>
    </>
  );
};

export default FlightForm;
