import axios from "axios";

import { BASE_URL } from "../config";
const API =
 `${BASE_URL}/api/tasks`;
const getToken=()=>
    localStorage.getItem("token");

const headers=()=>({
    headers:{
        Authorization:
        `Bearer ${getToken()}`
    }
});

export const createTask = (taskData) => {
    return axios.post(API, taskData, headers());
};
export const getTasks=()=>{
    return axios.get(API,headers());
}
export const updateTask = (id, taskData) => {
    return axios.put(`${API}/${id}`, taskData, headers());
};

export const deleteTask=(id)=>{
    return axios.delete(`${API}/${id}`,headers());
}