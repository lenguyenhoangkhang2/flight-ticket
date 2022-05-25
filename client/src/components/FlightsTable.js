import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";
import React from "react";
import { useTable, useExpanded } from "react-table";

const FlightsTable = ({
  columns: flightColumns,
  data,
  renderRowSubComponent,
  hiddenColumns,
  headerTitle,
  useStyles = () => { },
}) => {
  const classes = useStyles();

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    visibleColumns,
    // state: { expanded },
  } = useTable(
    {
      columns: flightColumns,
      data,
      initialState: {
        ...(hiddenColumns && { hiddenColumns }),
      },
    },
    useExpanded
  );

  return (
    <TableContainer component={Paper} className={classes?.table}>
      <Table aria-label="simple table" {...getTableProps}>
        {headerTitle && (
          <TableHead>
            <TableRow>
              <TableCell colSpan={visibleColumns.length} className="title">
                {headerTitle}
              </TableCell>
            </TableRow>
          </TableHead>
        )}
        <TableHead className={classes?.tableHead}>
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
        {data.length ? (
          <TableBody className={classes?.tableBody} {...getTableBodyProps()}>
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
                  {row.isExpanded ? (
                    <TableRow>
                      {renderRowSubComponent({ row, visibleColumns })}
                    </TableRow>
                  ) : null}
                </React.Fragment>
              );
            })}
          </TableBody>
        ) : (
          <TableBody>
            <TableRow>
              <TableCell colSpan={visibleColumns.length}>
                <Typography variant="h4" align="center" color="#9e9e9e">
                  Không có chuyến bay phù hợp
                </Typography>
              </TableCell>
            </TableRow>
          </TableBody>
        )}
      </Table>
    </TableContainer>
  );
};

export default FlightsTable;
