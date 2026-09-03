import axios from "axios";

import { BASE_URL } from "../config";

const API = `${BASE_URL}/api/auth`;


/*
 * COMMON HEADERS
 */

const getHeaders = () => {

  const token =
    localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };

};


/*
 * REGISTER
 */

export const registerUser = (userData) => {

  return axios.post(
    `${API}/register`,
    userData
  );

};


/*
 * LOGIN
 */

export const loginUser = (userData) => {

  return axios.post(
    `${API}/login`,
    userData
  );

};


/*
 * GET USER PROFILE
 */

export const getProfile = () => {

  return axios.get(
    `${API}/profile`,
    getHeaders()
  );

};