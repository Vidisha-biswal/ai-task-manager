import axios from "axios";

const API="http://localhost:5000/api/tasks";

const getToken=()=>
    localStorage.getItem("token");

const headers=()=>({
    headers:{
        Authorization:
        `Bearer ${getToken()}`
    }
});

export const getTasks=()=>{
    axios.get(API,headers());
}

export const deleteTask=(id)=>{
    axios.delete(`${API}/${id}`,headers());
}