import {
  Alert,
  AlertTitle,
  Box,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import _ from "lodash/fp";
import { useState } from "react";
import { useQuery } from "react-query";
import configApi from "../../api/configApi";
import ConfigValuesForm from "../../components/ConfigValuesForm";

const labelConfigs = {
  airportAmountMax: "Số lượng sân bay tối đa",
  seatClassAmountMax: "Số lượng hạng vé ghế tối đa",
  flightTimeMin: "Thời gian bay ngắn nhất (giây)",
  numberStopoverMax: "Số lượng điểm dừng chân tối đa",
  timeDelayMin: "Thời gian chờ tối thiểu (giây)",
  timeDelayMax: "Thời gian chờ tối đa (giây)",
  timeLimitBuyTicket: "Mua vé trước (số ngày)",
  timeLimitCancelTicket: "Hủy vé trước (số ngày)",
};

export default function ConfigurationPage() {
  const [configs, setConfigs] = useState({});

  const getConfigsQuery = useQuery("configs", configApi.getAll, {
    select: (data) => data.data,
    // onSuccess: (data) => setConfigs(data),
    onSuccess: (data) => {
      const temp = _.pick(
        [
          "airportAmountMax",
          "seatClassAmountMax",
          "flightTimeMin",
          "numberStopoverMax",
          "timeDelayMin",
          "timeDelayMax",
          "timeLimitBuyTicket",
          "timeLimitCancelTicket",
        ],
        data
      );

      Object.keys(temp).forEach((key) => {
        temp[key] = {
          value: temp[key],
          label: labelConfigs[key],
        };
      });

      setConfigs(temp);
    },
  });

  if (getConfigsQuery.isError)
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="600px"
    >
      <Alert severity="error" variant="filled">
        <AlertTitle>Load Airport Error</AlertTitle>
        {getConfigsQuery.error.message ||
          getConfigsQuery.error.response.data.message}
      </Alert>
    </Box>;

  if (getConfigsQuery.isLoading) {
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
    <Container maxWidth="sm">
      <Box
        padding={4}
        borderRadius={3}
        border="1px solid #333"
        bgcolor="#e3f2fd"
      >
        <Typography variant="h5" marginBottom={3} fontWeight="700" color="#333">
          Danh sách cấu hình
        </Typography>
        <ConfigValuesForm configValues={configs} />
      </Box>
    </Container>
  );
}
