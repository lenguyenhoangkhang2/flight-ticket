import { Container } from "@mui/material";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Navigation from "./components/Navigation";
import FlightPage from "./pages/FlightPage";
import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import { default as AdminFlightPage } from "./pages/Admin/FlightPage";
import { default as AdminReportPage } from "./pages/Admin/ReportPage";
import { default as AdminConfigurationPage } from "./pages/Admin/Configuration";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navigation />
        <Container maxWidth="lg">
          <Routes>
            <Route path="/">
              <Route index element={<Home />} />
              <Route path="flights" element={<FlightPage />} />
              <Route path="tickets" element={<FlightPage />} />
              <Route path="login" element={<AuthPage />} />
              <Route path="signup" element={<AuthPage isSignupForm={true} />} />
              <Route path="admin">
                <Route path="flights" element={<AdminFlightPage />} />
                <Route path="reports" element={<AdminReportPage />} />
                <Route path="configs" element={<AdminConfigurationPage />} />
              </Route>
            </Route>
          </Routes>
        </Container>
      </BrowserRouter>
    </div>
  );
}

export default App;
