import { Stack, Typography } from "@mui/material";
import { secondsToMinutes } from "date-fns";

const FlightDetails = ({ flight }) => {
  return (
    <Stack
      spacing={2}
      padding={2}
      bgcolor="#e3f2fd"
      borderRadius={2}
      border={1}
      width="100%"
    >
      <Typography variant="h5" fontWeight="700">
        Chi tiết chuyến bay
      </Typography>
      <Typography>
        <strong>Mã chuyến bay:</strong> {flight._id}
      </Typography>
      <Typography>
        <strong>Hãng hàng không:</strong> {flight.airline}
      </Typography>
      <Typography>
        <strong>Sân bay đi:</strong> {flight.fromLocation.name}
        <br />
        <strong>Địa điểm:</strong> {flight.fromLocation.location}
      </Typography>
      <Typography>
        <strong>Sân bay đến:</strong> {flight.toLocation.name}
        <br />
        <strong>Địa điểm:</strong> {flight.toLocation.location}
      </Typography>
      <Typography>
        <strong>Điểm dừng chân: </strong>
        {flight.stopovers.length === 0 ? "Không có" : flight.stopovers.length}
      </Typography>
      <ul style={{ marginTop: 0 }}>
        {flight.stopovers.map((stopover) => (
          <li style={{ paddingTop: "8px" }} key={stopover.airport._id}>
            <Typography>
              <strong>Sân bay: </strong>
              {stopover.airport.name}
            </Typography>
            <Typography>
              <strong>Địa điểm: </strong>
              {stopover.airport.location}
            </Typography>
            <Typography>
              <strong>Thời gian chờ: </strong>
              {secondsToMinutes(stopover.delay)} phút
            </Typography>
            <Typography>
              <strong>Ghi chú: </strong>
              {stopover.note ? stopover.note : "không có"}
            </Typography>
          </li>
        ))}
      </ul>
      <Typography>
        <strong>Hạng ghế: </strong>
        {flight.seats.length}
      </Typography>
      <ul style={{ marginTop: 0 }}>
        {flight.seats.map((seatClass) => (
          <li style={{ paddingTop: "8px" }} key={seatClass.type._id}>
            <Typography>
              <strong>Tên hạng ghế: </strong>
              {seatClass.type.className}
            </Typography>
            <Typography>
              <strong>Phí tính thêm: </strong>
              {seatClass.type.extraFee ? seatClass.type.extraFee : "không có"}
            </Typography>
            <Typography>
              <strong>Số chỗ ngồi: </strong>
              {seatClass.amount}
            </Typography>
          </li>
        ))}
      </ul>
    </Stack>
  );
};

export default FlightDetails;
