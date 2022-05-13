import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const isAuth = !!currentUser;

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

      if (token) {
        try {
          console.log("Chay vao day");
          const { data } = await authApi.getCurrentUser();

          setCurrentUser(data);
        } catch (err) {
          setError(err);
        }

        navigate("/");
      }
      setLoadingInitial(false);
    })();
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      const { data } = await authApi.login(email, password);

      const { accessToken, refreshToken } = data;

      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      try {
        const { data } = await authApi.getCurrentUser();
        setCurrentUser(data);

        navigate("/");
      } catch (err) {
        setError(err);
      }
    } catch (err) {
      setError(err);
    }

    setLoading(false);
  };

  const logout = async () => {
    try {
      await authApi.logout();

      setCurrentUser(null);

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
    } catch (err) {
      setError(err);
    }
  };

  const memoedValue = useMemo(
    () => ({
      currentUser,
      loading,
      error,
      login,
      logout,
      isAuth,
    }),
    [currentUser, loading, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  return useContext(AuthContext);
};
