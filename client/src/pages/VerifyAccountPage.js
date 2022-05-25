import { Alert, AlertTitle, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { useEffect } from "react";
import { useMutation } from "react-query";
import { useParams, Link } from "react-router-dom";
import authApi from "../api/authApi";

const VerifyAccountPage = () => {
  const { verificationCode, userId } = useParams();

  const verifyAccountMutation = useMutation(authApi.verifyAccount);

  useEffect(() => {
    verifyAccountMutation.mutate({ verificationCode, userId });
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        m: "auto",
        width: "fit-content",
      }}
    >
      <Typography
        variant="h5"
        color="#333"
        align="center"
        fontWeight="700"
        marginBottom={2}
      >
        Xác minh tài khoản qua email
      </Typography>
      {verifyAccountMutation.isLoading && (
        <Alert severity="info">
          <AlertTitle>Đang Xác Minh</AlertTitle>
          <CircularProgress />
        </Alert>
      )}
      {verifyAccountMutation.isSuccess && (
        <Alert severity="success">
          <AlertTitle>Xác minh tài khoản thành công</AlertTitle>
          <Typography as={Link} to="/login">
            Đăng nhập ngay
          </Typography>
        </Alert>
      )}
      {verifyAccountMutation.isError && (
        <Alert severity="error">
          <AlertTitle>Không thể xác minh</AlertTitle>
          {verifyAccountMutation.error.response.data ||
            verifyAccountMutation.error.response.data.message}
        </Alert>
      )}
    </Box>
  );
};

export default VerifyAccountPage;
