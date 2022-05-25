import { useQuery } from "react-query";
import airportApi from "../api/airportApi";
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

const AirportLocationSelect = ({
  label,
  value = "all",
  onChange,
  InputProps,
  notSelectAll = false,
  ...props
}) => {
  const [location, setLocation] = useState(value);

  const {
    isLoading: isAirportsLoading,
    data: airports,
    isError: isAirportsError,
  } = useQuery("airports", airportApi.getAll, {
    select: (data) => data.data,
  });

  useEffect(() => {
    setLocation(value);
  }, [value]);

  if (isAirportsLoading) {
    return (
      <LoadingButton size="small" loading variant="outlined" disabled>
        disabled
      </LoadingButton>
    );
  }

  return (
    <FormControl sx={{ minWidth: 220 }} error={isAirportsError || props.error}>
      <InputLabel id={`${label}Location-select-label`}>
        {isAirportsLoading ? "Loading..." : label}
      </InputLabel>
      <Select
        labelId={`${label}Location-select-label`}
        value={location}
        label={isAirportsLoading ? "Loading..." : label}
        autoWidth
        onChange={(e) => {
          setLocation(e.target.value);
          onChange(e.target.value);
        }}
        inputProps={InputProps}
        MenuProps={MenuProps}
      >
        <MenuItem value="all" disabled={notSelectAll}>
          Tất cả
        </MenuItem>
        {!isAirportsError &&
          airports.map((airport) => (
            <MenuItem key={airport._id} value={airport._id}>
              {airport.name}
            </MenuItem>
          ))}
      </Select>
      {(isAirportsError || props.error) && (
        <FormHelperText>
          {props.helperText || "Loading location error"}
        </FormHelperText>
      )}
    </FormControl>
  );
};

export default AirportLocationSelect;
