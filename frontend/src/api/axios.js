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
    async (error)=>{
        const status = error.response?.status;
        const token = localStorage.getItem("token");
        const refresh= localStorage.getItem("refresh");
        const originalRequest = error.config;

        if(status===401 && !originalRequest._retry && refresh){
            originalRequest._retry= true;

            try{
                const res= await axios.post(
                    "http://127.0.0.1:8000/api/accounts/token/refresh/",
                    {refresh:refresh}
                );

                const newAccessToken=res.data.access;
                localStorage.setItem("token",newAccessToken);

                API.defaults.headers.Authorization= `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization= `Bearer ${newAccessToken}`;

                return API(originalRequest);

            }catch(refreshError){
                if(!logoutTriggered){
                    logoutTriggered=true;
                    localStorage.removeItem("token")
                    localStorage.removeItem("refresh")
                    localStorage.removeItem("username")

                    toast.error("Session expired. Please log in again.");
                    window.location.href = "/login";
                }
                return Promise.reject(refreshError)
            }
        }

        if(status===403 && !logoutTriggered && token){
            logoutTriggered=true
            localStorage.removeItem("token")
            localStorage.removeItem("refresh")
            localStorage.removeItem("username")

            toast.error("Your account blocked by admin");
            window.location.href = "/login";
        }

        return Promise.reject(error)
    }
)

export default API;