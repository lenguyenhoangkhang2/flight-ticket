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
import seatApi from "../api/seatApi";
import zodValidate from "../utils/zodValidate";
import NumberFormat from "react-number-format";

const initSeatClass = {
  className: "",
  extraFee: "",
};

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const SeatClassForm = ({
  seatClassData = initSeatClass,
  typeDefault = "view",
}) => {
  const [seatClass, setSeatClass] = useState(seatClassData);
  const [catchSeatClass, setCatchSeatClass] = useState(seatClass);
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
    setSeatClass(seatClassData);
  }, [seatClassData]);

  const queryClient = useQueryClient();
  const updateSeatClassMutate = useMutation(seatApi.updateSeatclass);
  const createSeatClassMutate = useMutation(seatApi.createSeatclass);

  const isReadOnly = type === "view";

  const handleUpdateSeatClass = () => {
    updateSeatClassMutate.mutate(seatClass, {
      onSuccess: () => {
        queryClient.invalidateQueries("seats", { active: true });
        setCatchSeatClass(seatClass);
        setOpenSnackbar({ isOpen: true, severity: "success" });
        setType("view");
        setSnackbarMessage("Cập nhật thông tin hạng ghế thành công");
      },
    });
  };

  const handleCreateSeatClass = () => {
    createSeatClassMutate.mutate(seatClass, {
      onSuccess: () => {
        setOpenSnackbar({ isOpen: true, severity: "success" });
        setSnackbarMessage("Thêm  hạng ghế thành công");
        setSeatClass(initSeatClass);
        queryClient.invalidateQueries("seats", { active: true });
      },
      onError: (error) => {
        if (
          error.response.data &&
          error.response.data.message ===
          "Amount of SeatClass has reached the limit"
        ) {
          setOpenSnackbar({ isOpen: true, severity: "error" });
          setSnackbarMessage(error.response.data.message);
        }
      },
    });
  };

  useEffect(() => {
    if (updateSeatClassMutate.isError) {
      setErrors(updateSeatClassMutate.error.response.data);
    }

    if (createSeatClassMutate.isError) {
      setErrors(createSeatClassMutate.error.response.data);
    }
  }, [updateSeatClassMutate, createSeatClassMutate]);

  useEffect(() => {
    updateSeatClassMutate.reset();
    createSeatClassMutate.reset();
    setErrors(null);
  }, [seatClass]);

  return (
    <Stack spacing={1}>
      <TextField
        value={seatClass.className}
        onChange={(e) =>
          setSeatClass({ ...seatClass, className: e.target.value })
        }
        label="Tên"
        InputProps={{
          readOnly: isReadOnly,
        }}
        size="small"
        error={errors && zodValidate(errors, ["body", "className"]).hasError}
        helperText={
          errors && zodValidate(errors, ["body", "className"]).message
        }
      />
      <NumberFormat
        size="small"
        value={seatClass.extraFee}
        customInput={TextField}
        label="Phí thêm"
        suffix=" %"
        allowNegative={false}
        inputProps={{ readOnly: isReadOnly, min: 0, max: 100 }}
        onValueChange={({ value: v }) =>
          setSeatClass({ ...seatClass, extraFee: +v })
        }
        error={errors && zodValidate(errors, ["body", "extraFee"]).hasError}
        helperText={errors && zodValidate(errors, ["body", "extraFee"]).message}
      />
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
              setSeatClass(catchSeatClass);
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
            onClick={handleUpdateSeatClass}
            disabled={_.isEqual(seatClass, catchSeatClass)}
          >
            Lưu lại
          </Button>
        </>
      )}
      {type === "create" && (
        <>
          <Stack spacing={1}>
            <Button variant="contained" onClick={handleCreateSeatClass}>
              Thêm hạng ghế
            </Button>
          </Stack>
        </>
      )}
      <Snackbar
        open={openSnackbar.isOpen}
        autoHideDuration={10000}
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

export default SeatClassForm;
