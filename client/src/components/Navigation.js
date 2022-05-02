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

const pages = [
  { name: "tìm chuyến bay", to: "/flights" },
  { name: "vé đã mua", to: "/tickets" },
  { name: "QL chuyến bay", to: "/admin/flights", isPrivate: true },
  { name: "Báo cáo", to: "/admin/reports", isPrivate: true },
  { name: "Cấu hình", to: "/admin/configs", isPrivate: true },
];

const Navigation = () => {
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [auth, setAuth] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
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
            {pages.map((page) => {
              if (!auth && !isAdmin && page.isPrivate) return null;

              return (
                <Button
                  component={Link}
                  to={page.to}
                  size="large"
                  key={page.name}
                  color="inherit"
                >
                  {page.name}
                </Button>
              );
            })}
          </Stack>
          {auth ? (
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
                <MenuItem onClick={handleClose}>Đăng xuất</MenuItem>
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
