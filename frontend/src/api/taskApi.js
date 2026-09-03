import axios from "axios";
import { BASE_URL } from "../config";

const API = `${BASE_URL}/api/tasks`;


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
 * CREATE TASK
 */

export const createTask = (taskData) => {
  return axios.post(
    API,
    taskData,
    getHeaders()
  );
};


/*
 * GET TASKS
 */

export const getTasks = () => {
  return axios.get(
    API,
    getHeaders()
  );
};


/*
 * UPDATE TASK
 */

export const updateTask = (
  id,
  taskData
) => {
  return axios.put(
    `${API}/${id}`,
    taskData,
    getHeaders()
  );
};


/*
 * DELETE TASK
 */

export const deleteTask = (id) => {
  return axios.delete(
    `${API}/${id}`,
    getHeaders()
  );
};