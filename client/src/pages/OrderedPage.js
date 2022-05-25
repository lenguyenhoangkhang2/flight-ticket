import {
  Button,
  Checkbox,
  CircularProgress,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { makeStyles } from "@mui/styles";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import FlightTable from "../components/FlightsTable";
import FlightColumns from "../utils/FlightColumns";
import CheckIcon from "@mui/icons-material/Check";
import { isBefore } from "date-fns";
import flightApi from "../api/flightApi";
import { LoadingButton } from "@mui/lab";
import { useAuth } from "../context/AuthContext";

const useStyles = makeStyles({
  table: {
    marginTop: 10,
  },
  tableHead: {
    "& .MuiTableRow-head": {
      backgroundColor: "#0288d1",
      "& .MuiTableCell-root": {
        fontWeight: "bold",
        color: "#fff",
      },
    },
    borderBottom: "none",
  },
  tableBody: {
    "& .MuiTableCell-body": {
      backgroundColor: "#fafafa",
    },
  },
  subTableHead: {
    "& .MuiTableCell-root": {
      backgroundColor: "#ff8f00",
      color: "white",
      fontWeight: "700",
    },
  },
  subTableBody: {
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

const OrderedPage = () => {
  const classes = useStyles();

  const columns = useMemo(
    () => [
      ...FlightColumns({
        expander: ({ row }) => (
          <Button
            {...row.getToggleRowExpandedProps()}
            endIcon={
              row.isExpanded ? <ArrowDropDownIcon /> : <ArrowRightIcon />
            }
            fullWidth
            size="small"
            autoCapitalize="none"
          >
            Danh sách vé
          </Button>
        ),
      }),
      {
        accessor: "tickets",
      },
    ],
    []
  );

  const { isAuth } = useAuth();

  const getOrderedQuery = useQuery(
    "user-ordered-flights",
    flightApi.getOrderedFlight,
    {
      select: (data) => data.data,
      enabled: !!isAuth,
    }
  );

  const createPaymentUrlMutate = useMutation(flightApi.createPaymentSessionUrl);

  // TicketId: [Array not paid tickets]
  // 628209e935e53feca1dbf674: ['802S89EB', '9X954HAX', 'S5HG152C']
  const [checked, setChecked] = useState({});
  const [departedFlights, setDepartedFlights] = useState([]);
  const [notDepartedFlights, setNotDepartedFlights] = useState([]);

  useEffect(() => {
    if (!getOrderedQuery.isLoading) {
      // data[1]: departed, data[2]: notDeparted
      const data = getOrderedQuery.data.reduce(
        ([p, f], flight) =>
          isBefore(new Date(flight.departureTime), new Date())
            ? [[...p, flight], f]
            : [p, [...f, flight]],
        [[], []]
      );

      setDepartedFlights(data[0]);
      setNotDepartedFlights(data[1]);
      setChecked(
        data[1].reduce(
          (a, b) => ({
            ...a,
            [b["_id"]]: b.tickets
              .filter(({ paid, isValid }) => !paid && isValid)
              .map(({ _id }) => _id),
          }),
          {}
        )
      );
    }
  }, [getOrderedQuery.data, getOrderedQuery.isLoading]);

  const handleToggle = (flightId, ticketId) => {
    const currentIndex = checked[flightId].indexOf(ticketId);

    const newChecked = { ...checked };

    if (currentIndex === -1) {
      newChecked[flightId].push(ticketId);
    } else {
      newChecked[flightId].splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const handlePayment = (flightId, ticketIds) => {
    createPaymentUrlMutate.mutate(
      { flightId, ticketIds },
      {
        onSuccess: (data) => {
          const paymentUrl = data.data.paymentUrl;
          window.location.replace(paymentUrl);
        },
      }
    );
  };

  const renderRowSubComponent = ({ row: { values }, visibleColumns }) => {
    return (
      <TableCell
        colSpan={visibleColumns.length}
        style={{ background: "#f5f5f5" }}
        padding="none"
      >
        <Box
          paddingX={5}
          paddingY={5}
          display="flex"
          justifyContent="center"
          bgcolor="#e0f2f1"
        >
          <div>
            <TableContainer>
              <Table style={{ maxWidth: 650 }}>
                <TableHead className={classes.subTableHead}>
                  <TableRow>
                    <TableCell>Mã vé</TableCell>
                    <TableCell>Hạng ghế</TableCell>
                    <TableCell>Phí thêm</TableCell>
                    <TableCell>Thành tiền</TableCell>
                    <TableCell>Trạng thái</TableCell>
                    <TableCell />
                  </TableRow>
                </TableHead>
                <TableBody className={classes.subTableBody}>
                  {values.tickets.map((ticket) => (
                    <TableRow
                      key={ticket._id}
                      className={
                        ticket.isValid
                          ? ticket.paid
                            ? "paid"
                            : "notPaid"
                          : "notValid"
                      }
                      onClick={() =>
                        ticket.isValid
                          ? handleToggle(values._id, ticket._id)
                          : null
                      }
                    >
                      <TableCell>{ticket._id}</TableCell>
                      <TableCell>{ticket.seatClass.className}</TableCell>
                      <TableCell>
                        {ticket.seatClass.extraFee
                          ? ticket.seatClass.extraFee
                          : "không có"}
                      </TableCell>
                      <TableCell>
                        {Intl.NumberFormat("vn-VN", {
                          style: "currency",
                          currency: "VND",
                        }).format(ticket.price)}
                      </TableCell>
                      <TableCell>
                        {ticket.isValid
                          ? ticket.paid
                            ? "Đã thanh toán"
                            : "Chưa thanh toán"
                          : "Đã hủy"}
                      </TableCell>
                      <TableCell>
                        {ticket.isValid ? (
                          ticket.paid ? (
                            <CheckIcon color="success" />
                          ) : (
                            <Checkbox
                              edge="start"
                              checked={
                                checked[values._id].indexOf(ticket._id) !== -1
                              }
                              disabled={ticket.paid}
                              tabIndex={-1}
                              disableRipple
                              inputProps={{ "aria-labelledby": ticket._id }}
                            />
                          )
                        ) : null}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {checked[values._id].length > 0 && (
              <Box textAlign="right">
                <Typography marginY={1} fontWeight="700" color="#ff6d00">
                  Tổng cộng:&nbsp;
                  {Intl.NumberFormat("vn-VN", {
                    style: "currency",
                    currency: "VND",
                  }).format(
                    values.tickets
                      .filter(({ _id }) => checked[values._id].includes(_id))
                      .reduce((a, b) => a + b.price, 0)
                  )}
                </Typography>
                <LoadingButton
                  variant="contained"
                  color="primary"
                  onClick={() => handlePayment(values._id, checked[values._id])}
                  loading={createPaymentUrlMutate.isLoading}
                >
                  Thanh toán
                </LoadingButton>
              </Box>
            )}
          </div>
        </Box>
      </TableCell>
    );
  };

  if (getOrderedQuery.isLoading) {
    return (
      <Box
        width="100%"
        minHeight="360"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
        <Typography variant="h6" color="blue" marginLeft={2}>
          Finding...
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Stack spacing={2}>
        <Typography variant="h5" color="#444" fontWeight="700">
          Chuyến bay sắp khởi hành
        </Typography>
        <FlightTable
          columns={columns}
          data={notDepartedFlights}
          renderRowSubComponent={renderRowSubComponent}
          hiddenColumns={["airline", "stopovers", "seats", "_id", "tickets"]}
          useStyles={useStyles}
        />
      </Stack>
      <Stack marginTop={5}>
        <Typography variant="h5" color="#444" fontWeight="700">
          Các chuyến bay đã đặt trong quá khứ
        </Typography>
        <FlightTable
          columns={columns}
          data={departedFlights}
          renderRowSubComponent={renderRowSubComponent}
          hiddenColumns={["airline", "stopovers", "seats", "_id", "tickets"]}
          useStyles={useStyles}
        />
      </Stack>
    </>
  );
};

export default OrderedPage;
