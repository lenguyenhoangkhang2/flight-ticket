import * as React from "react";
import {
  AppBar,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import LoginIcon from "@mui/icons-material/Login";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navigation = () => {
  const { isAuth, currentUser, logout } = useAuth();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    handleClose();
    logout();
  };

  return (
    <AppBar position="static">
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          <Button variant="h6" component={Link} to="/">
            <Typography variant="h6" noWrap>
              FLIGHT TICKET
            </Typography>
          </Button>
          <Stack direction="row" flexGrow={1} marginX={1} spacing={1}>
            <Button component={Link} to="/flights" size="large" color="inherit">
              tìm chuyến bay
            </Button>
            {isAuth && currentUser.isAdmin && (
              <>
                <Button
                  component={Link}
                  to="/admin/flights"
                  size="large"
                  color="inherit"
                >
                  quản lý chuyến bay
                </Button>
                <Button
                  component={Link}
                  to="/admin/flights"
                  size="large"
                  color="inherit"
                >
                  báo cáo
                </Button>
                <Button
                  component={Link}
                  to="/admin/flights"
                  size="large"
                  color="inherit"
                >
                  cấu hình
                </Button>
              </>
            )}
          </Stack>
          {isAuth ? (
            <div>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                sx={{ mt: "35px" }}
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>Thông tin tài khoản</MenuItem>
                <MenuItem onClick={logoutHandler}>Đăng xuất</MenuItem>
              </Menu>
            </div>
          ) : (
            <Button
              startIcon={<LoginIcon />}
              color="inherit"
              component={Link}
              to="/login"
            >
              Đăng Nhập
            </Button>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navigation;
