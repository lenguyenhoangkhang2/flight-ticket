import { Alert, AlertTitle, Stack, TextField, Typography } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";
import SendIcon from "@mui/icons-material/Send";
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import { isBefore } from "date-fns";
import { useMutation, useQueryClient } from "react-query";
import zodValidate from "../utils/zodValidate";
import flightApi from "../api/flightApi";

const OrderFlightForm = ({ flight }) => {
  const { isAuth } = useAuth();
  const addOrderMutate = useMutation(flightApi.addOrder);
  const queryClient = useQueryClient();

  const [listOrders, setListOrders] = useState(
    flight.seats.map((seat) => ({
      seatClassId: seat.type._id,
      amount: 0,
      price: 0,
    }))
  );

  const handleFlightOrder = (e) => {
    e.preventDefault();

    addOrderMutate.mutate(
      { flightId: flight._id, orders: listOrders },
      {
        onSuccess: () => queryClient.invalidateQueries("user-ordered-flights"),
      }
    );
  };

  const handleOrderAmountChanged = (e, i) => {
    addOrderMutate.reset();

    const temp = [...listOrders];
    temp[i].amount = +e.target.value;
    temp[i].price =
      Math.round(
        (((flight.price * (100 + flight.seats[i].type.extraFee)) / 100) *
          listOrders[i].amount) /
        10000
      ) * 10000;
    setListOrders(temp);
  };

  if (isBefore(new Date(flight.departureTime), new Date())) {
    return (
      <Alert variant="outlined" severity="warning">
        Không thể đặt vé. Chuyến bay đã khởi hành
      </Alert>
    );
  }

  return (
    <form onSubmit={handleFlightOrder}>
      {isAuth ? (
        <Stack spacing={1}>
          <Typography fontWeight="700" color="#424242">
            Chọn số lượng
          </Typography>
          {flight.seats.map((seatClass, i) => (
            <React.Fragment key={seatClass.type._id}>
              <TextField
                style={{ marginTop: 15 }}
                type="number"
                name="seatOrderAmount"
                label={seatClass.type.className}
                fullWidth={true}
                size="small"
                InputProps={{
                  inputProps: { min: 0 },
                }}
                value={+listOrders[i].amount}
                onChange={(e) => handleOrderAmountChanged(e, i)}
                helperText={
                  addOrderMutate.isError
                    ? zodValidate(addOrderMutate.error.response.data, [
                      "body",
                      i,
                      "amount",
                    ]).message
                    : `Thành tiền: ${Intl.NumberFormat("vn-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(listOrders[i].price)}`
                }
                error={
                  addOrderMutate.isError &&
                  zodValidate(addOrderMutate.error.response.data, [
                    "body",
                    i,
                    "amount",
                  ]).hasError
                }
              />
            </React.Fragment>
          ))}
          <Typography marginBottom={2} fontWeight="700" color="#ff6d00">
            Tổng cộng:&nbsp;
            {Intl.NumberFormat("vn-VN", {
              style: "currency",
              currency: "VND",
            }).format(listOrders.reduce((a, b) => a + b.price, 0))}
          </Typography>
          <LoadingButton
            loading={addOrderMutate.isLoading}
            variant="contained"
            type="submit"
            loadingPosition="start"
            startIcon={<SendIcon />}
            fullWidth
          >
            Đặc trước
          </LoadingButton>
          {addOrderMutate.isError &&
            zodValidate(addOrderMutate.error.response.data, []).hasError && (
              <Alert
                severity="warning"
                style={{ marginTop: 10, border: "1px solid #888" }}
              >
                {zodValidate(addOrderMutate.error.response.data, []).message}
              </Alert>
            )}
          {addOrderMutate.isSuccess && (
            <Alert
              severity="success"
              style={{ marginTop: 10, border: "1px solid #888" }}
            >
              Đặt trước vé thành công
            </Alert>
          )}
        </Stack>
      ) : (
        <Alert severity="warning" variant="outlined">
          <AlertTitle>Chưa đăng nhập</AlertTitle>
          Đăng nhập trước khi đặt chỗ <br />
          <Typography
            as={Link}
            to="/login"
            style={{ textDecoration: "none" }}
            fontWeight="700"
          >
            Đăng nhập
          </Typography>
        </Alert>
      )}
    </form>
  );
};

export default OrderFlightForm;
