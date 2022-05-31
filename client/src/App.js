import { Container, createTheme } from "@mui/material";
import { Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import FlightPage from "./pages/FlightPage";
import AuthPage from "./pages/AuthPage";
import { default as AdminFlightPage } from "./pages/Admin/FlightPage";
import { default as AdminReportPage } from "./pages/Admin/ReportPage";
import { default as AdminConfigurationPage } from "./pages/Admin/ConfigurationPage";
import ProtectedRoute from "./utils/ProtectedRoute";
import { useAuth } from "./context/AuthContext";
import OrderedPage from "./pages/OrderedPage";
import UserProfilePage from "./pages/UserProfilePage";
import AirportPage from "./pages/Admin/AirportPage";
import SeatClassPage from "./pages/Admin/SeatClassPage";
import VerifyAccountPage from "./pages/VerifyAccountPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ThemeProvider } from "@mui/styles";

const theme = createTheme({});

function App() {
  const auth = useAuth();

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <div className="App">
          <Navigation />
          <section style={{ marginTop: "30px" }}>
            <Container maxWidth="lg">
              <Routes>
                <Route path="/">
                  <Route index element={<FlightPage />} />
                  <Route path="tickets" element={<FlightPage />} />
                  <Route path="login" element={<AuthPage />} />
                  <Route
                    path="signup"
                    element={<AuthPage isSignupForm={true} />}
                  />
                  <Route
                    path="verify-account/:verificationCode/:userId"
                    element={<VerifyAccountPage />}
                  />
                  <Route path="reset-password">
                    <Route index element={<ResetPasswordPage />} />
                    <Route
                      path=":userId/:passwordResetCode"
                      element={<ResetPasswordPage />}
                    />
                  </Route>
                  <Route
                    path="admin"
                    element={
                      <ProtectedRoute
                        redirectPath="/"
                        isAllowed={auth.isAuth && auth.currentUser.isAdmin}
                      />
                    }
                  >
                    <Route path="flights" element={<AdminFlightPage />} />
                    <Route path="airports" element={<AirportPage />} />
                    <Route path="reports" element={<AdminReportPage />} />
                    <Route
                      path="configs"
                      element={<AdminConfigurationPage />}
                    />
                    <Route path="seat-classes" element={<SeatClassPage />} />
                  </Route>
                </Route>
                <Route
                  path="user"
                  element={
                    <ProtectedRoute
                      redirectPath="/login"
                      isAllowed={auth.isAuth}
                    />
                  }
                >
                  <Route path="ordered" element={<OrderedPage />} />
                  <Route path="profile" element={<UserProfilePage />} />
                </Route>
              </Routes>
            </Container>
          </section>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
