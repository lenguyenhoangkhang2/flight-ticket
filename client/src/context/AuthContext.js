import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import authApi from "../api/authApi";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    setError(null);
  }, [location.pathname]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await authApi.getCurrentUser();

        setCurrentUser(data);
      } finally {
        setLoadingInitial(false);
      }
    })();
  }, []);

  const login = async (email, password) => {
    setLoading(true);

    try {
      await authApi.login(email, password);

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
      navigate("/login");
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
      isAuth: !!currentUser,
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
