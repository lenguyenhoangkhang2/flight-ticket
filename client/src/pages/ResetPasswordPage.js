import {
  Alert,
  Container,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { LoadingButton } from "@mui/lab";
import { useMutation } from "react-query";
import authApi from "../api/authApi";
import zodValidate from "../utils/zodValidate";
import { Link as RouterLink } from "react-router-dom";

const ResetPasswordPage = ({ type }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const { userId, passwordResetCode } = useParams();

  const sendEmailResetPasswordMutation = useMutation(
    authApi.sendEmailResetPassword
  );
  const resetPasswordMutation = useMutation(authApi.resetPassword);

  return (
    <Container maxWidth="xs">
      <Stack spacing={2}>
        {!userId || !passwordResetCode ? (
          <>
            <Typography variant="h6" fontWeight={700} color="#333">
              Gửi Email lấy lại mật khẩu
            </Typography>
            <TextField
              type="email"
              value={email}
              label="Email của tài khoản"
              onChange={(e) => setEmail(e.target.value)}
            />
            <LoadingButton
              variant="contained"
              loading={sendEmailResetPasswordMutation.isLoading}
              onClick={() => sendEmailResetPasswordMutation.mutate(email)}
            >
              Xác nhận
            </LoadingButton>
            {sendEmailResetPasswordMutation.isSuccess && (
              <Alert severity="success">
                Đã gửi đường dẫn thay đổi mật khẩu đến email của bạn
              </Alert>
            )}
          </>
        ) : (
          <>
            <Typography variant="h6" fontWeight={700} color="#333">
              Cập nhật mật khẩu mới
            </Typography>
            <TextField
              type="password"
              label="Mật khẩu mới"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={
                resetPasswordMutation.isError &&
                zodValidate(resetPasswordMutation.error.response.data, [
                  "body",
                  "password",
                ]).hasError
              }
              helperText={
                resetPasswordMutation.isError &&
                zodValidate(resetPasswordMutation.error.response.data, [
                  "body",
                  "password",
                ]).message
              }
            />
            <TextField
              type="password"
              value={passwordConfirmation}
              label="Xác nhận mật khẩu"
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              error={
                resetPasswordMutation.isError &&
                zodValidate(resetPasswordMutation.error.response.data, [
                  "body",
                  "passwordConfirmation",
                ]).hasError
              }
              helperText={
                resetPasswordMutation.isError &&
                zodValidate(resetPasswordMutation.error.response.data, [
                  "body",
                  "passwordConfirmation",
                ]).message
              }
            />
            <LoadingButton
              variant="contained"
              loading={resetPasswordMutation.isLoading}
              onClick={() =>
                resetPasswordMutation.mutate({
                  userId,
                  passwordResetCode,
                  password,
                  passwordConfirmation,
                })
              }
            >
              Xác nhận
            </LoadingButton>
            {resetPasswordMutation.isSuccess && (
              <Alert severity="success">
                Mật khẩu đã được cập nhật{" "}
                <Link as={RouterLink} to="/login">
                  Đăng nhập ngay
                </Link>
              </Alert>
            )}
          </>
        )}
      </Stack>
    </Container>
  );
};

export default ResetPasswordPage;
