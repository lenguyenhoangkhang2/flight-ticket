import { Button, Container, Grid, TextField, Typography } from "@mui/material";
import { makeStyles } from "@mui/styles";
import { useState } from "react";
import { Link } from "react-router-dom";

const useStyles = makeStyles({
  form: {
    marginBottom: 10,
  },
});

const initalState = {
  email: "",
  password: "",
  name: "",
  passwordConfirm: "",
  identityCardNumber: "",
};

export default function Auth({ isSignupForm = false }) {
  const classes = useStyles();

  const [values, setValues] = useState(initalState);

  return (
    <Container maxWidth="xs">
      <Typography
        variant="h5"
        align="center"
        marginTop={8}
        marginBottom={2}
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
                variant="outlined"
                value={values.passwordConfirm}
                label="Nhập lại mật khẩu"
                name="passwordConfirm"
                type="password"
                onChange={(e) =>
                  setValues({ ...values, passwordConfirm: e.target.value })
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
            >
              {isSignupForm ? "Đăng Ký" : "Đăng Nhập"}
            </Button>
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
