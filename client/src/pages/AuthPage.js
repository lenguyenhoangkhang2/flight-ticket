import {
  Container,
  Grid,
  TextField,
  Button,
  Typography,
  Alert,
  AlertTitle,
} from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import zodValidate from "../utils/zodValidate.js";
import authApi from "../api/authApi";

const useStyles = makeStyles({
  form: {
    marginBottom: 10,
  },
});

export default function AuthPage({ isSignupForm = false }) {
  const classes = useStyles();

  const { loading, login, error } = useAuth();

  const [values, setValues] = useState({
    email: "",
    password: "",
    name: "",
    passwordConfirmation: "",
    identityCardNumber: "",
  });
  const [signupErrors, setSignupErrors] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const errors = isSignupForm ? signupErrors : error;

  const handleOnSubmit = async (e) => {
    e.preventDefault();

    if (isSignupForm) {
      setSignupLoading(true);
      try {
        await authApi.signup(values);
        setSignupSuccess(true);
      } catch (err) {
        setSignupErrors(err);
      }

      setSignupLoading(false);
    } else {
      login(values.email, values.password);
    }
  };

  if (isSignupForm && signupSuccess) {
    return (
      <Container maxWidth="xs">
        <Typography
          variant="h5"
          align="center"
          marginTop={8}
          marginBottom={3}
          color="#212121"
          fontWeight="bold"
        >
          Đăng Ký Tài Khoản
        </Typography>

        <Alert severity="success">
          <AlertTitle>
            <Typography variant="h6">Đăng ký tài khoản thành công</Typography>
          </AlertTitle>

          <Typography variant="body1">
            Xác minh tài khoản qua email trước khi đăng nhâp
          </Typography>

          <Typography as={Link} to="/login">
            Trở về trang đăng nhập
          </Typography>
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xs">
      <Typography
        variant="h5"
        align="center"
        marginTop={8}
        marginBottom={3}
        color="#212121"
        fontWeight="bold"
      >
        {isSignupForm ? "Đăng Ký Tài Khoản" : "Đăng Nhập"}
      </Typography>
      <form className={classes.form}>
        <Grid container rowSpacing={2}>
          {isSignupForm && (
            <>
              <Grid item xs={12}>
                <TextField
                  error={
                    !!errors &&
                    zodValidate(errors.response.data, ["body", "name"]).hasError
                  }
                  helperText={
                    !!errors &&
                    zodValidate(errors.response.data, ["body", "name"]).message
                  }
                  variant="outlined"
                  value={values.name}
                  label="Họ và tên"
                  name="name"
                  type="text"
                  onChange={(e) =>
                    setValues({ ...values, name: e.target.value })
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  error={
                    !!errors &&
                    zodValidate(errors.response.data, [
                      "body",
                      "indentityCardNumber",
                    ]).hasError
                  }
                  helperText={
                    !!errors &&
                    zodValidate(errors.response.data, [
                      "body",
                      "indentityCardNumber",
                    ]).message
                  }
                  variant="outlined"
                  value={values.identityCardNumber}
                  label="Số CMND hoặc CCCD"
                  name="identityCardNumber"
                  onChange={(e) =>
                    setValues({ ...values, identityCardNumber: e.target.value })
                  }
                  type="text"
                  fullWidth
                />
              </Grid>
            </>
          )}
          <Grid item xs={12}>
            <TextField
              error={
                !!errors &&
                zodValidate(errors.response.data, ["body", "email"]).hasError
              }
              helperText={
                !!errors &&
                zodValidate(errors.response.data, ["body", "email"]).message
              }
              variant="outlined"
              label="Địa chỉ email"
              name="email"
              value={values.email}
              type="email"
              fullWidth
              onChange={(e) => setValues({ ...values, email: e.target.value })}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              error={
                !!errors &&
                zodValidate(errors.response.data, ["body", "password"]).hasError
              }
              helperText={
                !!errors &&
                zodValidate(errors.response.data, ["body", "password"]).message
              }
              variant="outlined"
              label="Mật khẩu"
              name="password"
              value={values.password}
              type="password"
              fullWidth
              onChange={(e) =>
                setValues({ ...values, password: e.target.value })
              }
            />
          </Grid>
          {isSignupForm && (
            <Grid item xs={12}>
              <TextField
                error={
                  !!errors &&
                  zodValidate(errors.response.data, [
                    "body",
                    "passwordConfirmation",
                  ]).hasError
                }
                helperText={
                  !!errors &&
                  zodValidate(errors.response.data, [
                    "body",
                    "passwordConfirmation",
                  ]).message
                }
                variant="outlined"
                value={values.passwordConfirmation}
                label="Nhập lại mật khẩu"
                name="passwordConfirmation"
                type="password"
                onChange={(e) =>
                  setValues({ ...values, passwordConfirmation: e.target.value })
                }
                fullWidth
              />
            </Grid>
          )}
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              size="large"
              onClick={handleOnSubmit}
            >
              {loading || signupLoading
                ? "Loading..."
                : isSignupForm
                ? "Đăng Ký"
                : "Đăng Nhập"}
            </Button>
            {error && zodValidate(error.response.data, ["body"]).hasError && (
              <Alert
                style={{ marginTop: 10, border: "1px solid #e53935" }}
                severity="error"
              >
                {zodValidate(error.response.data, ["body"]).message}
              </Alert>
            )}
            {isSignupForm &&
              signupErrors &&
              zodValidate(signupErrors.response.data, ["body"]).hasError && (
                <Alert
                  style={{ marginTop: 10, border: "1px solid #e53935" }}
                  severity="error"
                >
                  {zodValidate(signupErrors.response.data, ["body"]).message}
                </Alert>
              )}
          </Grid>
        </Grid>
      </form>
      {isSignupForm ? (
        <Typography>
          Đã có tài khoản&nbsp;
          <Link style={{ textDecoration: "none" }} to="/login">
            Đăng nhập
          </Link>
        </Typography>
      ) : (
        <Typography>
          Chưa có tài khoản?&nbsp;
          <Link style={{ textDecoration: "none" }} to="/signup">
            Đăng ký
          </Link>
        </Typography>
      )}
    </Container>
  );
}
