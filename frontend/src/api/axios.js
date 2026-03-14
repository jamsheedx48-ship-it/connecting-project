import axios from "axios";
import { toast } from "react-toastify";

let logoutTriggered = false;

const API= axios.create({
    baseURL: "http://127.0.0.1:8000/api/"
});

API.interceptors.request.use((req)=>{
    const token=localStorage.getItem("token")
    if (token){
        req.headers.Authorization= `Bearer ${token}`
    }
    return req;
})

API.interceptors.response.use(
    (response)=>response,
    (error)=>{
        const token = localStorage.getItem("token");
        if((error.response.status === 403||error.response.status===401)&&!logoutTriggered&&token){

            logoutTriggered=true;
            localStorage.removeItem("token")
            localStorage.removeItem("username")
            toast.error("Your account blocked by admin")
            window.location.href = '/login'
            
        }
        return Promise.reject(error)
    }
)

export default API;