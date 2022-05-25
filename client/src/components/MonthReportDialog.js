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
  Typography,
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

const MonthReportDialog = ({ open, report, onClose, onUpdate }) => {
  const [monthReport, setMonthReport] = useState(report);
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
  const updateMonthReportMutation = useMutation(reportApi.updateMonthReport);

  const handleClose = () => {
    onClose();
  };

  useEffect(() => {
    setMonthReport(report);
  }, [report]);

  if (!monthReport) return null;

  const handleUpdateMonthReport = () => {
    updateMonthReportMutation.mutate(report._id, {
      onSuccess: (result) => {
        queryClient.invalidateQueries("month-reports", {
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
        Báo Cáo Tháng {new Date(monthReport.time).getMonth() + 1}/
        {new Date(monthReport.time).getFullYear()}
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
                  <StyledTableCell>Mã chuyến bay</StyledTableCell>
                  <StyledTableCell>Số vé bán</StyledTableCell>
                  <StyledTableCell>Doanh thu</StyledTableCell>
                  <StyledTableCell>Tỉ lệ</StyledTableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {_.chain(monthReport.items)
                  .orderBy()
                  .map((row, i) => (
                    <TableRow key={i}>
                      <TableCell>{row.flightId}</TableCell>
                      <TableCell>{row.ticketSelledAmount}</TableCell>
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
                {monthReport.items.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Typography align="center">
                        Không có chuyến bay
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <LoadingButton
            size="small"
            variant="contained"
            sx={{ marginTop: 2, width: 200 }}
            onClick={handleUpdateMonthReport}
            loading={updateMonthReportMutation.isLoading}
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

export default MonthReportDialog;
