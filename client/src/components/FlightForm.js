import React, { forwardRef, useEffect, useState } from "react";
import {
  Alert as MuiAlert,
  Backdrop,
  Button,
  CircularProgress,
  Grid,
  IconButton,
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

const FlightForm = ({ data = initialData, defaultType = "view" }) => {
  const [type, setType] = useState(defaultType);
  const [flight, setFlight] = useState({
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
                label="Mã chuyến bay"
                value={flight._id}
                InputProps={{ readOnly: true }}
              />
            )}
            <TextField
              label="Hãng hàng không"
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
              label="Giá vé"
              suffix=" đ"
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
              label="Điểm khởi hành"
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
              label="Điểm đến"
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
              label="Thời gian đi"
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
              label="Thời gian đến"
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
                  Điểm dừng chân
                </Typography>
                {_.isEmpty(flight.stopovers) && (
                  <Typography color="#555">Không có điểm dừng chân</Typography>
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
                    label={"Điểm dừng thứ " + i}
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
                    label="Giá vé"
                    suffix=" phút"
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
                  label="Ghi chú"
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
                Thêm điểm dừng chân
              </Button>
            </Grid>
          )}
        </Grid>
        <Grid container item xs={12} spacing={2}>
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={6}>
              <Stack spacing={1}>
                <Typography variant="body2" fontWeight="700">
                  Hạng ghế - vé
                </Typography>
                {_.isEmpty(flight.seats) && (
                  <Typography color="#555">Không có điểm dừng chân</Typography>
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
                      label={`Hạng ghế - vé (${i})`}
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
                    label="Số lượng"
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
                Thêm hạng vé ghế
              </Button>
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
              Cập nhật thông tin
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
                Hoàn tác
              </Button>
              <Button
                size="large"
                variant="contained"
                onClick={handleUpdateFlight}
                disabled={_.isEqual(flight, catchFlight)}
              >
                Lưu lại
              </Button>
            </Stack>
          )}
          {type === "create" && (
            <>
              <Stack spacing={1}>
                {createFlightMutate.isSuccess && (
                  <Alert severity="success" variant="filled">
                    Thêm chuyến bay thành công
                  </Alert>
                )}
                <Button
                  size="large"
                  variant="contained"
                  onClick={handleCreateFlight}
                >
                  Thêm chuyến bay
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
    </>
  );
};

export default FlightForm;
