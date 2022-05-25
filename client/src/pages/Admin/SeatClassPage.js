import {
  CircularProgress,
  Grid,
  Typography,
  Stack,
  Alert,
  AlertTitle,
} from "@mui/material";
import { Box } from "@mui/system";
import React from "react";
import { useQuery } from "react-query";
import seatApi from "../../api/seatApi";
import SeatClassForm from "../../components/SeatClassForm";
import _ from "lodash/fp";

const SeatClassPage = () => {
  const getSeatClassesQuery = useQuery("seats", seatApi.getAll, {
    select: (data) => data.data,
  });

  if (getSeatClassesQuery.isError)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="600px"
      >
        <Alert severity="error" variant="filled">
          <AlertTitle>Loading Seat Classes Error</AlertTitle>
          {getSeatClassesQuery.error.message ||
            getSeatClassesQuery.error.response.data.message}
        </Alert>
      </Box>
    );

  if (getSeatClassesQuery.isLoading) {
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
        Thêm Hạng Ghế
      </Typography>
      <Grid container spacing={2} marginBottom={5}>
        <Grid item xs={3}>
          <Stack
            bgcolor="#e3f2fd"
            spacing={2}
            padding={2}
            borderRadius={2}
            border="1px solid #333"
          >
            <Stack spacing={1}>
              <Typography color="#333" fontWeight="700">
                Thông tin hạng ghế mới
              </Typography>
            </Stack>
            <SeatClassForm typeDefault="create" />
          </Stack>
        </Grid>
      </Grid>
      <Typography variant="h5" fontWeight="700" color="#444" marginBottom={2}>
        Danh sách hạng ghế
      </Typography>
      <Grid container spacing={2}>
        {getSeatClassesQuery.data.map((seatClass, i) => (
          <React.Fragment key={i}>
            <Grid item xs={3}>
              <Stack
                bgcolor="#e3f2fd"
                spacing={2}
                padding={2}
                borderRadius={2}
                border="1px solid #333"
              >
                <Stack spacing={1}>
                  <Typography color="#333" fontWeight="700">
                    Hạng ghế {i + 1}
                  </Typography>
                  <Typography color="#333" variant="body2">
                    Mã: {seatClass._id}
                  </Typography>
                </Stack>
                <SeatClassForm airportData={seatClass} />
              </Stack>
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </>
  );
};

export default SeatClassPage;
