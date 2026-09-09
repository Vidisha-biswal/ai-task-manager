import axios from "axios";

import { BASE_URL } from "../config";


const API =
  `${BASE_URL}/api/notifications`;


/*
 * =========================================================
 * REQUEST CONFIG
 * =========================================================
 */

const getConfig = () => ({
  headers: {
    Authorization:
      `Bearer ${localStorage.getItem("token")}`,
    "Content-Type":
      "application/json"
  }
});


/*
 * =========================================================
 * GET NOTIFICATIONS
 * =========================================================
 */

export const getNotifications =
  async () => {
    return axios.get(
      API,
      getConfig()
    );
  };


/*
 * =========================================================
 * MARK ONE AS READ
 * =========================================================
 */

export const markNotificationAsRead =
  async (id) => {
    return axios.put(
      `${API}/${id}/read`,
      {},
      getConfig()
    );
  };


/*
 * =========================================================
 * MARK ALL AS READ
 * =========================================================
 */

export const markAllNotificationsAsRead =
  async () => {
    return axios.put(
      `${API}/read-all`,
      {},
      getConfig()
    );
  };