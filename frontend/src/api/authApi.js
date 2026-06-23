import axios from "axios";

import { BASE_URL } from "../config";
const API =
 `${BASE_URL}/api/tasks`;

export const loginUser=(data)=>{
    return axios.post(`${API}/login`,data);
}

export const registerUser=(data)=>{
    return axios.post(`${API}/register`,data);
}