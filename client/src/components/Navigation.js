import * as React from "react";
import {
  AppBar,
  Badge,
  Button,
  Container,
  IconButton,
  ListItemText,
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
import AirplaneTicketIcon from "@mui/icons-material/AirplaneTicket";
import { useQuery } from "react-query";
import flightApi from "../api/flightApi";
import { isAfter } from "date-fns";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const Navigation = () => {
  const { isAuth, currentUser, logout } = useAuth();
  const getOrderedQuery = useQuery(
    "user-ordered-flights",
    flightApi.getOrderedFlight,
    {
      select: (data) => data.data,
      enabled: !!isAuth,
    }
  );

  const [anchorAccountEl, setAccountAnchorEl] = React.useState(null);
  const [anchorManageEl, setAnchorManageEl] = React.useState(null);

  const handleManageMenu = (event) => {
    setAnchorManageEl(event.currentTarget);
  };

  const handleManageMenuClose = () => {
    setAnchorManageEl(null);
  };

  const handleAccountMenu = (event) => {
    setAccountAnchorEl(event.currentTarget);
  };

  const handleAccountMenuClose = () => {
    setAccountAnchorEl(null);
  };

  const logoutAccountMenuHandler = () => {
    handleAccountMenuClose();
    logout();
  };

  const getNumOfOrdered = () => {
    const { isLoading, isError, data: flights } = getOrderedQuery;

    if (isLoading) return "...";

    if (isError) return "error";

    return flights.filter((flight) =>
      isAfter(new Date(flight.departureTime), new Date())
    ).length;
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
            {isAuth && (
              <Button
                component={Link}
                to="/user/ordered"
                size="large"
                color="inherit"
                disabled={getOrderedQuery.isLoading}
                endIcon={
                  getNumOfOrdered === 0 ? (
                    <AirplaneTicketIcon />
                  ) : (
                    <Badge badgeContent={getNumOfOrdered()} color="warning">
                      <AirplaneTicketIcon />
                    </Badge>
                  )
                }
              >
                DS đặt trước
              </Button>
            )}
            {isAuth && currentUser.isAdmin && (
              <>
                <Button
                  // component={Link}
                  // to="/admin/flights"
                  size="large"
                  color="inherit"
                  onClick={handleManageMenu}
                  endIcon={<ArrowDropDownIcon />}
                >
                  quản lý
                </Button>
                <Menu
                  id="demo-positioned-menu"
                  aria-labelledby="demo-positioned-button"
                  anchorEl={anchorManageEl}
                  open={Boolean(anchorManageEl)}
                  onClose={handleManageMenuClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <MenuItem onClick={handleManageMenuClose}>
                    <ListItemText
                      style={{ textDecoration: "none", color: "inherit" }}
                      as={Link}
                      to="/admin/flights"
                    >
                      Quản lý chuyến bay
                    </ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleManageMenuClose}>
                    <ListItemText
                      style={{ textDecoration: "none", color: "inherit" }}
                      as={Link}
                      to="/admin/airports"
                    >
                      Quản lý sân bay
                    </ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleManageMenuClose}>
                    <ListItemText
                      style={{ textDecoration: "none", color: "inherit" }}
                      as={Link}
                      to="/admin/seat-classes"
                    >
                      Quản lý hạng ghế (vé)
                    </ListItemText>
                  </MenuItem>
                  <MenuItem onClick={handleManageMenuClose}>
                    <ListItemText
                      style={{ textDecoration: "none", color: "inherit" }}
                      as={Link}
                      to="/admin/configs"
                    >
                      Cài đặt cấu hình
                    </ListItemText>
                  </MenuItem>
                </Menu>
                <Button
                  component={Link}
                  to="/admin/reports"
                  size="large"
                  color="inherit"
                >
                  báo cáo
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
                onClick={handleAccountMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                sx={{ mt: "35px" }}
                id="menu-appbar"
                anchorEl={anchorAccountEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorAccountEl)}
                onClose={handleAccountMenuClose}
              >
                <MenuItem>
                  <ListItemText
                    style={{ textDecoration: "none" }}
                    as={Link}
                    to="/user/profile"
                    onClick={handleAccountMenuClose}
                  >
                    Trang cá nhân
                  </ListItemText>
                </MenuItem>
                <MenuItem onClick={logoutAccountMenuHandler}>
                  Đăng xuất
                </MenuItem>
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
