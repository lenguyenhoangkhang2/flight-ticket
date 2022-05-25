import {
  Alert as MuiAlert,
  Button,
  Grid,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import { forwardRef, useEffect, useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import configApi from "../api/configApi";
import zodValidate from "../utils/zodValidate";
import _ from "lodash/fp";

const initConfigValues = {
  airportAmountMax: 0,
  seatClassAmountMax: 0,
  flightTimeMin: 0,
  numberStopoverMax: 0,
  timeDelayMin: 0,
  timeDelayMax: 0,
  timeLimitBuyTicket: 0,
  timeLimitCancelTicket: 0,
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const AirportForm = ({
  configValues = initConfigValues,
  typeDefault = "view",
}) => {
  const [configs, setConfigs] = useState(configValues);
  const [catchConfigs, setCatchConfigs] = useState(configs);
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

  // console.log(
  //   Object.keys(
  //     _.pick(
  //       [
  //         "airportAmountMax",
  //         "seatClassAmountMax",
  //         "flightTimeMin",
  //         "numberStopoverMax",
  //         "timeDelayMin",
  //         "timeDelayMax",
  //         "timeLimitBuyTicket",
  //         "timeLimitCancelTicket",
  //       ],
  //       configs
  //     )
  //   )
  // );

  useEffect(() => {
    setConfigs(configValues);
  }, [configValues]);

  const queryClient = useQueryClient();
  const updateAirportMutate = useMutation(configApi.updateConfig);

  const isReadOnly = type === "view";

  const handleUpdateConfigs = () => {
    updateAirportMutate.mutate(_.mapValues("value", configs), {
      onSuccess: () => {
        queryClient.invalidateQueries("airports", { active: true });
        setCatchConfigs(configs);
        setOpenSnackbar({ isOpen: true, severity: "success" });
        setType("view");
        setSnackbarMessage("Cập nhật thông số cấu hình ứng dụng");
      },
    });
  };

  useEffect(() => {
    if (updateAirportMutate.isError) {
      setErrors(updateAirportMutate.error.response.data);
    }
  }, [updateAirportMutate]);

  useEffect(() => {
    if (updateAirportMutate.isError) {
      updateAirportMutate.reset();
    }
    setErrors(null);
  }, [configs]);

  return (
    <Stack spacing={2}>
      <Grid container spacing={2}>
        {Object.keys(configs).map((configName, i) => (
          <Grid item xs={6} key={i}>
            <TextField
              value={configs[configName].value}
              onChange={(e) =>
                setConfigs(
                  _.set(`${configName}.value`, +e.target.value, configs)
                )
              }
              label={configs[configName].label}
              type="number"
              fullWidth
              InputProps={{
                readOnly: isReadOnly,
              }}
              error={
                errors && zodValidate(errors, ["body", configName]).hasError
              }
              helperText={
                errors && zodValidate(errors, ["body", configName]).message
              }
            />
          </Grid>
        ))}
      </Grid>
      {type === "view" && (
        <Button onClick={() => setType("update")} variant="contained">
          Sửa
        </Button>
      )}
      {type === "update" && (
        <>
          <Button
            variant="contained"
            onClick={() => {
              setConfigs(catchConfigs);
              setType("view");
              setErrors(null);
            }}
            color="inherit"
          >
            Hoàn tác
          </Button>
          <Button
            variant="contained"
            onClick={handleUpdateConfigs}
            disabled={_.isEqual(configs, catchConfigs)}
          >
            Lưu lại
          </Button>
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
