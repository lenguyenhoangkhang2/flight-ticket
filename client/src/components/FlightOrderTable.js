import {
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  tableCellClasses,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { makeStyles } from "@mui/styles";
import TablePaginationActions from "@mui/material/TablePagination/TablePaginationActions";
import _ from "lodash/fp";

const StyledTableCell = styled(TableCell)(() => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#0d47a1",
    color: "#fff",
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
    borderBottom: "0.1px solid #888",
  },
}));

const useStyles = makeStyles({
  TableBody: {
    "& .paid": {
      "& .MuiTableCell-body": {
        backgroundColor: "#b9f6ca",
      },
    },
    "& .notPaid": {
      "& .MuiTableCell-body": {
        backgroundColor: "#f5f5f5",
      },
    },
    "& .notPaid:hover": {
      cursor: "pointer",

      "& .MuiTableCell-body": {
        backgroundColor: "#eeeeee",
      },
    },
    "& .notValid": {
      "& .MuiTableCell-body": {
        color: "#555",
        backgroundColor: "#ccc",
      },
    },
  },
});

const FlightOrderTable = ({ data }) => {
  const classes = useStyles();
  const [tickets, setTickets] = useState(data);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [searchTerm, setSearchTerm] = useState("");

  const emptyRows =
    page > 0
      ? Math.max(0, (1 + page) * rowsPerPage - filteredTickets.length)
      : 0;

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    setFilteredTickets(
      _.filter((ticket) => {
        let text = _.pick(["_id", "user.name", "user.email"], ticket);

        text = JSON.stringify(text);

        return text.toLowerCase().includes(searchTerm.toLowerCase());
      }, tickets)
    );
  }, [searchTerm, tickets]);

  useEffect(() => {
    setTickets(data);
  }, [data]);

  return (
    <Stack spacing={1}>
      <TextField
        onChange={(e) => setSearchTerm(e.target.value)}
        label="Tìm kiếm"
        size="small"
        sx={{ width: 300 }}
      />
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <StyledTableCell>Mã vé</StyledTableCell>
              <StyledTableCell>Ngày đặt</StyledTableCell>
              <StyledTableCell>Hạng ghế</StyledTableCell>
              <StyledTableCell>Thông tin người đặt</StyledTableCell>
              <StyledTableCell>Thành tiền</StyledTableCell>
              <StyledTableCell>Trạng thái</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.TableBody}>
            {filteredTickets.map((ticket, i) => (
              <TableRow
                className={
                  ticket.isValid
                    ? ticket.paid
                      ? "paid"
                      : "notPaid"
                    : "notValid"
                }
                key={i + "-" + ticket}
              >
                <StyledTableCell>{ticket._id}</StyledTableCell>
                <StyledTableCell>
                  {format(new Date(ticket.createdAt), "dd/MM/yyyy hh:mm a")}
                </StyledTableCell>
                <StyledTableCell>
                  <Stack spacing={1}>
                    <span>Tên: {ticket.seatClass.className}</span>
                    <span>
                      Phí thêm:&nbsp;
                      {+ticket.seatClass.extraFee !== 0
                        ? ticket.seatClass.extraFee + "%"
                        : "Không có"}
                    </span>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell>
                  <Stack spacing={1}>
                    <span>Tên: {ticket.user.name}</span>
                    <span>CMND: {ticket.user.identityCardNumber}</span>
                    <span>Email: {ticket.user.email}</span>
                  </Stack>
                </StyledTableCell>
                <StyledTableCell>
                  {Intl.NumberFormat("vn-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(ticket.price)}
                </StyledTableCell>
                <StyledTableCell>
                  {ticket.isValid
                    ? ticket.paid
                      ? "Đã thanh toán"
                      : "Chưa thanh toán"
                    : "Đã hủy"}
                </StyledTableCell>
              </TableRow>
            ))}
            {emptyRows > 0 && (
              <TableRow>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10]}
                colSpan={6}
                count={filteredTickets.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "dfasdf",
                  },
                  native: true,
                }}
                labelRowsPerPage="Hiển thị / Trang"
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default FlightOrderTable;
