import { useQuery } from "react-query";
import seatApi from "../api/seatApi.js";
import LoadingButton from "@mui/lab/LoadingButton";

import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 220,
    },
  },
  anchorOrigin: { vertical: "bottom", horizontal: "left" },
  transformOrigin: { vertical: "top", horizontal: "left" },
};

const SeatClassSelect = ({
  label,
  value = "",
  onChange,
  inputProps,
  ...props
}) => {
  const [seatId, setSeatId] = useState(value);

  useEffect(() => {
    setSeatId(value);
  }, [value]);

  const {
    isLoading: isSeatsLoading,
    data: seats,
    isError: isSeatsError,
  } = useQuery("seats", seatApi.getAll, {
    select: (data) => data.data,
  });

  if (isSeatsLoading) {
    return (
      <LoadingButton size="small" loading variant="outlined" disabled>
        disabled
      </LoadingButton>
    );
  }

  return (
    <FormControl sx={{ minWidth: 220 }} error={isSeatsError || props.error}>
      <InputLabel id={`${label}Seat-select-label`}>
        {isSeatsLoading ? "Loading..." : label}
      </InputLabel>
      <Select
        labelId={`${label}Seat-select-label`}
        value={seatId}
        label={isSeatsLoading ? "Loading..." : label}
        autoWidth
        onChange={(e) => {
          setSeatId(e.target.value);
          onChange(e.target.value);
        }}
        inputProps={{ ...inputProps }}
        MenuProps={MenuProps}
        defaultValue=""
      >
        <MenuItem value="" disabled></MenuItem>
        {!isSeatsError &&
          seats.map((seat) => (
            <MenuItem key={seat._id} value={seat._id}>
              {seat.className}
            </MenuItem>
          ))}
      </Select>
      {(isSeatsError || props.error) && (
        <FormHelperText>
          {props.helperText || "Loading location error"}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default SeatClassSelect;
