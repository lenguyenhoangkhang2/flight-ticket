import { LoadingButton } from "@mui/lab";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import reportApi from "../api/reportApi";
import zodValidate from "../utils/zodValidate";

const AddReportForm = () => {
  const [type, setType] = useState("");
  const [timeReport, setTimeReport] = useState(new Date());
  const [errors, setErrors] = useState(null);

  const queryClient = useQueryClient();
  const addMonthReportMutation = useMutation(reportApi.createMonthReport);
  const addYearReportMutation = useMutation(reportApi.createYearReport);

  const handleCreateReport = () => {
    if (type === "month")
      addMonthReportMutation.mutate(timeReport, {
        onSuccess: () => {
          queryClient.invalidateQueries("month-reports");
        },
        onError: (error) => {
          if (error.response.status === 400) setErrors(error.response.data);
        },
      });

    if (type === "year")
      addYearReportMutation.mutate(timeReport, {
        onSuccess: () => {
          queryClient.invalidateQueries("year-reports");
        },
        onError: (error) => {
          if (error.response.status === 400) setErrors(error.response.data);
        },
      });
  };

  return (
    <Stack spacing={2} marginBottom={2} onClick={() => setErrors(null)}>
      <Stack direction="row" spacing={2}>
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="add-report-type">Loại báo cáo</InputLabel>
          <Select
            labelId="add-report-type"
            value={type}
            label="Loại báo cáo"
            onChange={(e) => setType(e.target.value)}
          >
            <MenuItem value="month">Tháng</MenuItem>
            <MenuItem value="year">Năm</MenuItem>
          </Select>
        </FormControl>
        {type !== "" && (
          <>
            <DatePicker
              views={type === "month" ? ["month", "year"] : ["year"]}
              maxDate={new Date()}
              label={type === "month" ? "Chọn tháng" : "Chọn năm"}
              value={timeReport}
              onChange={(e) => setTimeReport(e)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  error={
                    errors && zodValidate(errors, ["body", "time"]).hasError
                  }
                  helperText={
                    errors && zodValidate(errors, ["body", "time"]).message
                  }
                />
              )}
            />
          </>
        )}
      </Stack>
      {type !== "" && (
        <LoadingButton
          loading={
            addMonthReportMutation.isLoading || addYearReportMutation.isLoading
          }
          variant="contained"
          color="primary"
          sx={{ width: 150 }}
          onClick={handleCreateReport}
        >
          Thêm
        </LoadingButton>
      )}
    </Stack>
  );
};

export default AddReportForm;
