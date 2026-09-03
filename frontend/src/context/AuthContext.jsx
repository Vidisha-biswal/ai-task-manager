import {
  createContext,
  useContext,
  useEffect,
  useState
} from "react";

import { getProfile } from "../api/authApi";


const AuthContext =
  createContext(null);


export const AuthProvider = ({
  children
}) => {

  const [token, setToken] =
    useState(
      () =>
        localStorage.getItem("token")
    );

  const [user, setUser] =
    useState(null);

  const [loading, setLoading] =
    useState(true);


  /*
   * LOAD USER PROFILE
   *
   * When a token already exists,
   * fetch the logged-in user's
   * profile from the backend.
   */

  useEffect(() => {

    const loadUser = async () => {

      if (!token) {

        setUser(null);
        setLoading(false);

        return;
      }

      try {

        const response =
          await getProfile();

        setUser(response.data);

      } catch (error) {

        console.error(
          "Failed to load user profile:",
          error
        );

        /*
         * If the token is invalid,
         * remove it and log the user out.
         */

        localStorage.removeItem("token");
        setToken(null);
        setUser(null);

      } finally {

        setLoading(false);

      }

    };


    loadUser();

  }, [token]);


  /*
   * LOGIN
   */

  const login = (jwt) => {

    localStorage.setItem(
      "token",
      jwt
    );

    setToken(jwt);

  };


  /*
   * LOGOUT
   */

  const logout = () => {

    localStorage.removeItem(
      "token"
    );

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

  return useContext(
    AuthContext
  );

};