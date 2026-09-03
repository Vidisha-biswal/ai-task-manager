import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { getProfile } from "../api/authApi";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("token")
  );

  const [user, setUser] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      try {
        const response = await getProfile();

        setUser(response.data);
      } catch (error) {
        console.error(
          "Failed to load user profile:",
          error
        );

        /*
         * Only remove the token when the backend
         * explicitly says that the token is invalid.
         *
         * Network errors, CORS errors, server errors,
         * etc. should NOT automatically log the user out.
         */

        const status = error.response?.status;

        if (status === 401 || status === 403) {
          localStorage.removeItem("token");
          setToken(null);
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, [token]);

  const login = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        loading,
        login,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};