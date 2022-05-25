import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { styled } from "@mui/material/styles";
import { LoadingButton } from "@mui/lab";
import _ from "lodash";
import { useMutation, useQueryClient } from "react-query";
import reportApi from "../api/reportApi.js";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0d47a1",
    color: "#fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const YearReportDialog = ({ open, report, onClose, onUpdate }) => {
  const [yearReport, setYearReport] = useState(report);
  const [openSnackbar, setOpenSnackbar] = useState({
    isOpen: false,
    severity: "success",
  });
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const handleSnakckbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar({ ...openSnackbar, isOpen: false });
  };

  const queryClient = useQueryClient();
  const updateYearReportMutation = useMutation(reportApi.updateYearReport);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setYearReport(report);
  }, [report]);

  if (!yearReport) return null;

  const handleUpdateYearReport = () => {
    updateYearReportMutation.mutate(report._id, {
      onSuccess: (result) => {
        queryClient.invalidateQueries("year-reports", {
          exact: true,
          active: true,
        });
        setOpenSnackbar({
          isOpen: true,
          severity: "success",
        });
        setSnackbarMessage("Cập nhật báo cáo thành công");
        onUpdate(result.data);
      },
    });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle fontWeight="700" color="#333">
        Báo Cáo Năm {new Date(yearReport.time).getFullYear()}
      </DialogTitle>
      <DialogContent>
        <Box
          noValidate
          sx={{
            display: "flex",
            flexDirection: "column",
            m: "auto",
            width: "fit-content",
          }}
        >
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} size="small">
              <TableHead>
                <TableRow>
                  <StyledTableCell>Tháng</StyledTableCell>
                  <StyledTableCell>Số chuyến bay</StyledTableCell>
                  <StyledTableCell>Doanh thu</StyledTableCell>
                  <StyledTableCell>Tỉ lệ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.chain(yearReport.items)
                  .orderBy()
                  .map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.month}</TableCell>
                      <TableCell>{row.flightAmount}</TableCell>
                      <TableCell>
                        {Intl.NumberFormat("vn-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(row.revenue)}
                      </TableCell>
                      <TableCell>{row.rate.toFixed(2)}</TableCell>
                    </TableRow>
                  ))
                  .value()}
              </TableBody>
            </Table>
          </TableContainer>
          <LoadingButton
            size="small"
            variant="contained"
            sx={{ marginTop: 2, width: 200 }}
            onClick={handleUpdateYearReport}
            loading={updateYearReportMutation.isLoading}
          >
            Cập nhật
          </LoadingButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button size="small" variant="contained" onClick={handleClose}>
          Đóng
        </Button>
      </DialogActions>
      <Snackbar
        open={openSnackbar.isOpen}
        autoHideDuration={4000}
        onClose={handleSnakckbarClose}
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
    </Dialog>
  );
};

export default YearReportDialog;
