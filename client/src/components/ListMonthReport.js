import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { format, isSameYear } from "date-fns";
import _ from "lodash";
import { useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { LoadingButton } from "@mui/lab";
import { useMutation, useQueryClient } from "react-query";
import reportApi from "../api/reportApi";

const ListMonthReport = ({ reports, onChange }) => {
  const [year, setYear] = useState(new Date());
  const [openDeleteReportDialog, setOpenDeleteReportDialog] = useState(false);
  const [deletedReportIdSelected, setDeletedReportIdSelected] = useState(null);

  const [selectedIdx, setSelectedIdx] = useState(null);

  const queryClient = useQueryClient();
  const deleteReportMutation = useMutation(reportApi.deleteMonthReport);

  if (reports.length === 0) {
    return <Typography>Chưa có báo cáo tháng</Typography>;
  }

  const handleClickDeleteReportButton = (e, reportId) => {
    e.stopPropagation();
    setDeletedReportIdSelected(reportId);
    setOpenDeleteReportDialog(true);
  };

  const handleCloseDeleteReportDialog = () => {
    setOpenDeleteReportDialog(false);
    setDeletedReportIdSelected(null);
  };

  const handleDeleteReport = () => {
    deleteReportMutation.mutate(deletedReportIdSelected, {
      onSuccess: () => {
        queryClient.invalidateQueries("month-reports");
        setOpenDeleteReportDialog(false);
        setDeletedReportIdSelected(null);
      },
    });
  };

  const renderReportItemText = (report) => {
    const time = new Date(report.time);
    const createdAt = new Date(report.createdAt);
    const updatedAt = new Date(report.updatedAt);

    return (
      <>
        <ListItemText>
          <Typography variant="body2" fontWeight="700">
            Báo cáo
          </Typography>
          Tháng {time.getMonth() + 1}/{time.getFullYear()}
        </ListItemText>
        <ListItemText>
          <Typography variant="body2" fontWeight="700">
            Ngày tạo
          </Typography>
          {format(createdAt, "P")}
        </ListItemText>
        <ListItemText>
          <Typography variant="body2" fontWeight="700">
            Cập nhập lần cuối
          </Typography>
          {format(updatedAt, "P")}
        </ListItemText>
        <ListItemIcon>
          <IconButton
            onClick={(e) => handleClickDeleteReportButton(e, report._id)}
            sx={{ "&:hover": { color: "red" } }}
          >
            <DeleteIcon />
          </IconButton>
        </ListItemIcon>
      </>
    );
  };

  return (
    <>
      <DatePicker
        views={["year"]}
        maxDate={new Date()}
        label="Báo cáo thuộc năm"
        value={year}
        onChange={(e) => setYear(e)}
        renderInput={(params) => (
          <TextField {...params} sx={{ width: 200 }} size="small" />
        )}
      />
      <List
        sx={{ maxHeight: 300, overflowY: "scroll", border: "0.5px solid #888" }}
      >
        {_.chain(reports)
          .filter(({ time }) => isSameYear(new Date(time), year))
          .sortBy(({ time }) => new Date(time))
          .map((report, i) => (
            <ListItemButton
              key={i}
              selected={selectedIdx === i}
              onClick={() => {
                setSelectedIdx(i);
                onChange(report);
              }}
            >
              {renderReportItemText(report)}
            </ListItemButton>
          ))
          .value()}
      </List>
      <Dialog
        open={openDeleteReportDialog}
        onClose={handleClickDeleteReportButton}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Xác nhận xóa báo cáo này?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Báo cáo sẽ bị xóa hoàn toàn khỏi cơ sở dữ liệu
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteReportDialog}
            variant="contained"
            color="inherit"
          >
            Hủy
          </Button>
          <LoadingButton
            onClick={handleDeleteReport}
            color="error"
            variant="contained"
            autoFocus
            loading={deleteReportMutation.isLoading}
          >
            Xóa
          </LoadingButton>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ListMonthReport;
