import axios from "axios";
import { BASE_URL } from "../config";
const API =
 `${BASE_URL}/api/tasks`;
 const config = () => ({
    headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`
    }
});

 export const generatePlan = (taskData) => {
    return axios.post(`${API}/planner`, taskData, config());
};

 export const generatePriority = (taskData) => {
    return axios.post(`${API}/priority`, taskData, config());
};

 export const generateInsights = (taskData) => {
    return axios.post(`${API}/insights`, taskData, config());
};
