import {
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { differenceInHours, differenceInMinutes } from "date-fns";
import React, { useMemo } from "react";
import { useTable } from "react-table";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";

const useStyles = makeStyles({
  tableHead: {
    "& .MuiTableRow-head": {
      backgroundColor: "#1565c0",

      "& .MuiTableCell-root": {
        fontWeight: "bold",
        color: "#fff",
        borderBottom: "none",
      },
    },
  },
  tableBody: {
    "& .MuiTableCell-body": {
      backgroundColor: "#fafafa",
    },

    "& .MuiTableRow-root:hover": {
      "& .MuiTableCell-body": {
        backgroundColor: "#f5f5f5",
      },
    },
  },
});

const FlightsTable = ({ flights }) => {
  const classes = useStyles();

  const columns = useMemo(
    () => [
      {
        accessor: "seats",
        Cell: () => (
          <IconButton>
            <KeyboardArrowDownOutlinedIcon />
          </IconButton>
        ),
      },
      {
        Header: "HHK",
        accessor: "airline",
      },
      {
        Header: "Điểm khởi hành",
        accessor: "fromLocation",
      },
      {
        Header: "Điểm đến",
        accessor: "toLocation",
      },
      {
        Header: "Giờ đi",
        accessor: ({ departureTime }) =>
          new Date(departureTime).toLocaleString(),
        id: "departureTime",
      },
      {
        Header: "Giờ đến",
        accessor: ({ arrivalTime }) => new Date(arrivalTime).toLocaleString(),
        id: "arrivalTime",
      },
      {
        Header: "TG bay",
        accessor: ({ departureTime, arrivalTime }) => {
          const localDepartureTime = new Date(departureTime);
          const localArrivalTime = new Date(arrivalTime);

          const hours = differenceInHours(localArrivalTime, localDepartureTime);
          const minutes =
            differenceInMinutes(localArrivalTime, localDepartureTime) -
            60 * hours;

          let duration;

          if (!hours) {
            duration = minutes + "m";
          } else if (!minutes) {
            duration = hours + "h";
          } else {
            duration = `${hours}h ${minutes}m`;
          }

          return duration;
        },
        id: "duration",
      },
      {
        Header: "Giá vé",
        accessor: ({ price }) =>
          Intl.NumberFormat("vn-VN", {
            style: "currency",
            currency: "VND",
          }).format(price),
        id: "price",
      },
    ],
    []
  );

  const data = useMemo(() => flights, [flights]);

  const { getTableProps, getTableBodyProps, prepareRow, rows, headerGroups } =
    useTable({ columns, data });

  return flights.length ? (
    <TableContainer component={Paper}>
      <Table
        className={classes.table}
        aria-label="simple table"
        {...getTableProps}
      >
        <TableHead className={classes.tableHead}>
          {headerGroups.map((headerGroup) => (
            <TableRow align="center" {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <TableCell {...column.getHeaderProps()}>
                  {column.render("Header")}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableHead>
        <TableBody className={classes.tableBody} {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <React.Fragment key={i}>
                <TableRow {...row.getRowProps()}>
                  {row.cells.map((cell) => (
                    <TableCell size="small" {...cell.getCellProps()}>
                      {cell.render("Cell")}
                    </TableCell>
                  ))}
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  ) : (
    <div>Khong co</div>
  );
};

export default FlightsTable;
