import {
  CircularProgress,
  Grid,
  Typography,
  Stack,
  Alert,
  AlertTitle,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useCallback, useEffect, useState } from "react";
import { useQuery } from "react-query";
import airportApi from "../../api/airportApi";
import AirportForm from "../../components/AirportForm";
import _ from "lodash/fp";

const AirportPage = () => {
  const getAirportsQuery = useQuery("airports", airportApi.getAll, {
    select: (data) => data.data,
    onSuccess: (data) => setAirports(data),
  });
  const [airports, setAirports] = useState([]);
  const [airportsFiltered, setAirportsFiltered] = useState(airports);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    setAirportsFiltered(airports);
    setSearchTerm("");
  }, [airports]);

  useEffect(() => {
    setAirportsFiltered(
      _.filter(
        (airport) =>
          `${airport.name} ${airport.location} ${airport._id}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()),
        airports
      )
    );
  }, [searchTerm, airports]);

  const handleDebounceSearchTerm = useCallback(
    _.debounce(800, (value) => setSearchTerm(value)),
    []
  );

  if (getAirportsQuery.isError)
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="600px"
    >
      <Alert severity="error" variant="filled">
        <AlertTitle>Load Airport Error</AlertTitle>
        {getAirportsQuery.error.message ||
          getAirportsQuery.error.response.data.message}
      </Alert>
    </Box>;

  if (getAirportsQuery.isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="600px"
      >
        <Stack direction="row" spacing={2} display="flex" alignItems="center">
          <CircularProgress />
          <Typography variant="h5" color="primary">
            Loading...
          </Typography>
        </Stack>
      </Box>
    );
  }

  return (
    <>
      <Typography variant="h5" fontWeight="700" color="#444" marginBottom={2}>
        Thêm Sân Bay
      </Typography>
      <Grid container spacing={2} marginBottom={5}>
        <Grid item xs={4}>
          <Stack
            bgcolor="#e3f2fd"
            spacing={2}
            padding={2}
            borderRadius={2}
            border="1px solid #333"
          >
            <Stack spacing={1}>
              <Typography color="#333" fontWeight="700">
                Thông tin sân bay mới
              </Typography>
            </Stack>
            <AirportForm typeDefault="create" />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="h5" fontWeight="700" color="#444" marginBottom={2}>
        Danh sách sân bay
      </Typography>
      <TextField
        onChange={(e) => handleDebounceSearchTerm(e.target.value)}
        label="Tìm kiếm (tên, địa điểm, id sân bay)"
        sx={{ minWidth: 400, marginBottom: 2 }}
      />
      <Box
        sx={{
          padding: 5,
          border: "1px solid #555",
          maxHeight: "600px",
          overflowY: "scroll",
          marginBottom: 5,
        }}
      >
        <Grid container spacing={2}>
          {airportsFiltered.map((airport, i) => (
            <React.Fragment key={i}>
              <Grid item xs={4}>
                <Stack
                  bgcolor="#e3f2fd"
                  spacing={2}
                  padding={2}
                  borderRadius={2}
                  border="1px solid #333"
                >
                  <Stack spacing={1}>
                    <Typography color="#333" fontWeight="700">
                      Sân bay {i + 1}
                    </Typography>
                    <Typography color="#333">Mã SB: {airport._id}</Typography>
                  </Stack>
                  <AirportForm airportData={airport} />
                </Stack>
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Box>
    </>
  );
};

export default AirportPage;
