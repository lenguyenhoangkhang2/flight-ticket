import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    isAuth: false,
    token: null,
    refreshToken: null,
    user: null,
  });
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (error) {
      setError(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (token && refreshToken) {
        setAuth({ ...auth, token, refreshToken });
      }

      if (token) {
        try {
          const { data } = await authApi.getCurrentUser();
          setAuth({ ...auth, user: data });
        } catch (err) {
          setError(err);
        }
      }
    })();
  }, []);

  const setToken = (token) => {
    localStorage.setItem("token", token);

    setAuth({ ...auth, token });
  };

  const setRefreshToken = (refreshToken) => {
    localStorage.setItem("refreshToken", refreshToken);

    setAuth({ ...auth, refreshToken });
  };

  const login = async (email, password) => {
    try {
      const { data } = await authApi.login({
        email,
        password,
      });

      setToken(data.token);
      setRefreshToken(data.refreshToken);
    } catch (err) {}
  };

  const signout = () => {
    setToken(null);
    setRefreshToken(null);
    setAuth({ ...auth, user: null });
  };

  const memoedValue = useMemo(
    () => ({
      auth,
      login,
      signout,
    }),
    [auth, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
