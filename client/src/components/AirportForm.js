import {
  Alert as MuiAlert,
  Button,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import _ from "lodash/fp";
import { useMutation, useQueryClient } from "react-query";
import airportApi from "../api/airportApi";
import zodValidate from "../utils/zodValidate";

const initAirport = {
  name: "",
  location: "",
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AirportForm = ({ airportData = initAirport, typeDefault = "view" }) => {
  const [airport, setAirport] = useState(airportData);
  const [catchAirport, setCatchAirport] = useState(airport);
  const [type, setType] = useState(typeDefault);
  const [errors, setErrors] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState({
    isOpen: false,
    severity: "",
  });
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar({ ...openSnackbar, isOpen: false });
  };

  useEffect(() => {
    setAirport(airportData);
  }, [airportData]);

  const queryClient = useQueryClient();
  const updateAirportMutate = useMutation(airportApi.updateAirport);
  const createAirportMutate = useMutation(airportApi.createAirport);

  const isReadOnly = type === "view";

  const handleUpdateAirport = () => {
    updateAirportMutate.mutate(airport, {
      onSuccess: () => {
        queryClient.invalidateQueries("airports", { active: true });
        setCatchAirport(airport);
        setOpenSnackbar({ isOpen: true, severity: "success" });
        setType("view");
        setSnackbarMessage("Cập nhật thông tin sân bay thành công");
      },
    });
  };

  const handleCreateAirport = () => {
    createAirportMutate.mutate(airport, {
      onSuccess: () => {
        queryClient.invalidateQueries("airports", { active: true });
        setAirport(initAirport);
        setOpenSnackbar({ isOpen: true, severity: "success" });
        setSnackbarMessage("Thêm  sân bay thành công");
      },
      onError: (error) => {
        if (
          error.response.data &&
          error.response.data.message ===
            "Amount of airports has reached the limit"
        ) {
          setOpenSnackbar({ isOpen: true, severity: "error" });
          setSnackbarMessage(error.response.data.message);
        }
      },
    });
  };

  useEffect(() => {
    if (updateAirportMutate.isError) {
      setErrors(updateAirportMutate.error.response.data);
    }

    if (createAirportMutate.isError) {
      setErrors(createAirportMutate.error.response.data);
    }
  }, [updateAirportMutate, createAirportMutate]);

  useEffect(() => {
    updateAirportMutate.reset();
    createAirportMutate.reset();
    setErrors(null);
  }, [airport]);

  return (
    <Stack spacing={1}>
      <TextField
        value={airport.name}
        onChange={(e) => setAirport({ ...airport, name: e.target.value })}
        label="Tên sân bay"
        InputProps={{
          readOnly: isReadOnly,
        }}
        size="small"
        error={errors && zodValidate(errors, ["body", "name"]).hasError}
        helperText={errors && zodValidate(errors, ["body", "name"]).message}
      />
      <TextField
        value={airport.location}
        onChange={(e) => setAirport({ ...airport, location: e.target.value })}
        label="Địa điểm"
        InputProps={{
          readOnly: isReadOnly,
        }}
        size="small"
        error={errors && zodValidate(errors, ["body", "location"]).hasError}
        helperText={errors && zodValidate(errors, ["body", "location"]).message}
      />

      {type === "view" && (
        <Button
          onClick={() => setType("update")}
          size="small"
          variant="contained"
        >
          Sửa
        </Button>
      )}
      {type === "update" && (
        <>
          <Button
            size="small"
            variant="contained"
            onClick={() => {
              setAirport(catchAirport);
              setType("view");
              setErrors(null);
            }}
            color="inherit"
          >
            Hoàn tác
          </Button>
          <Button
            size="small"
            variant="contained"
            onClick={handleUpdateAirport}
            disabled={_.isEqual(airport, catchAirport)}
          >
            Lưu lại
          </Button>
        </>
      )}
      {type === "create" && (
        <>
          <Stack spacing={1}>
            <Button
              size="large"
              variant="contained"
              onClick={handleCreateAirport}
            >
              Thêm chuyến bay
            </Button>
          </Stack>
        </>
      )}
      <Snackbar
        open={openSnackbar.isOpen}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
      >
        <Alert
          onClose={handleClose}
          severity={openSnackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Stack>
  );
};

export default AirportForm;
