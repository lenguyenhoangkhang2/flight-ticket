import {
  Alert,
  AlertTitle,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useState } from "react";
import { useQuery } from "react-query";
import reportApi from "../../api/reportApi";
import ListMonthReport from "../../components/ListMonthReport";
import ListYearReport from "../../components/ListYearReport";
import AddReportForm from "../../components/AddReportForm";
import MonthReportDialog from "../../components/MonthReportDialog";
import YearReportDialog from "../../components/YearReportDialog";

export default function ReportPage() {
  const [monthReports, setMonthReports] = useState([]);
  const [yearReports, setYearReports] = useState([]);

  const [monthReportSelected, setMonthReportSelected] = useState(null);
  const [openMonthReportDialog, setOpenMonthReportDialog] = useState(false);

  const [yearReportSelected, setYearReportSelected] = useState(null);
  const [openYearReportDialog, setOpenYearReportDialog] = useState(false);

  const getMonthReportsQuery = useQuery(
    "month-reports",
    reportApi.getAllMonthReport,
    {
      select: (data) => data.data,
      onSuccess: (data) => setMonthReports(data),
    }
  );

  const getYearReportsQuery = useQuery(
    "year-reports",
    reportApi.getAllYearReport,
    {
      select: (data) => data.data,
      onSuccess: (data) => setYearReports(data),
    }
  );

  if (getYearReportsQuery.isLoading || getMonthReportsQuery.isLoading) {
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

  if (getMonthReportsQuery.isError)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="600px"
      >
        <Alert severity="error" variant="filled">
          <AlertTitle>Loading Reports Error</AlertTitle>
          {getMonthReportsQuery.error.message ||
            getYearReportsQuery.error.message}
        </Alert>
      </Box>
    );

  return (
    <>
      <Typography variant="h5" color="#333" fontWeight="700" marginBottom={2}>
        Thêm Báo Cáo
      </Typography>
      <AddReportForm />
      <Typography
        variant="h5"
        color="#333"
        fontWeight="700"
        marginTop={5}
        marginBottom={2}
      >
        Danh Sách Báo Cáo
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}>
          <Stack
            padding={2}
            spacing={2}
            borderRadius={2}
            border="1px solid #555"
          >
            <Typography variant="h6" color="#333" fontWeight="700">
              Báo cáo tháng
            </Typography>
            <ListMonthReport
              reports={monthReports}
              onChange={(report) => {
                setMonthReportSelected(report);
                setOpenMonthReportDialog(true);
              }}
            />
          </Stack>
        </Grid>
        <Grid item xs={6}>
          <Stack
            padding={2}
            spacing={2}
            borderRadius={2}
            border="1px solid #555"
          >
            <Typography variant="h6" color="#333" fontWeight="700">
              Báo cáo năm
            </Typography>
            <ListYearReport
              reports={yearReports}
              onChange={(report) => {
                setYearReportSelected(report);
                setOpenYearReportDialog(true);
              }}
            />
          </Stack>
        </Grid>
      </Grid>
      <MonthReportDialog
        open={openMonthReportDialog}
        onUpdate={(report) => setMonthReportSelected(report)}
        report={monthReportSelected}
        onClose={() => {
          setOpenMonthReportDialog(false);
          setMonthReportSelected(null);
        }}
      />
      <YearReportDialog
        open={openYearReportDialog}
        onUpdate={(report) => setYearReportSelected(report)}
        report={yearReportSelected}
        onClose={() => {
          setOpenYearReportDialog(false);
          setYearReportSelected(null);
        }}
      />
    </>
  );
}
