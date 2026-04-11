import axios from "axios";

let logoutTriggered = false;

const API = axios.create({
    baseURL: "http://127.0.0.1:8000/api/"
});

API.interceptors.request.use((req) => {
    const token = localStorage.getItem("token");
    if (token) {
        req.headers.Authorization = `Bearer ${token}`;
    }
    return req;
});

API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const status = error.response?.status;
        const token = localStorage.getItem("token");
        const refresh = localStorage.getItem("refresh");
        const originalRequest = error.config;

        // ── 401: Try token refresh ──────────────────────────────────────────
        if (status === 401 && !originalRequest._retry && refresh) {
            originalRequest._retry = true;
            try {
                const res = await axios.post(
                    "http://127.0.0.1:8000/api/accounts/token/refresh/",
                    { refresh }
                );
                const newAccessToken = res.data.access;
                localStorage.setItem("token", newAccessToken);
                API.defaults.headers.Authorization = `Bearer ${newAccessToken}`;
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                if (!logoutTriggered) {
                    logoutTriggered = true;
                    localStorage.removeItem("token");
                    localStorage.removeItem("refresh");
                    localStorage.removeItem("username");

                    const refreshDetail = refreshError.response?.data?.detail || "";
                    if (
                        refreshError.response?.status === 401 &&
                        refreshDetail.toLowerCase().includes("active")
                    ) {
                        // ✅ blocked user
                        localStorage.setItem("flashMessage", "Your account has been blocked by admin.");
                    } else {
                        // ✅ session expired
                        localStorage.setItem("flashMessage", "Session expired. Please log in again.");
                    }

                    setTimeout(() => {
                        window.location.replace("/login");
                    }, 100);
                    setTimeout(() => { logoutTriggered = false; }, 3000);
                }
                return Promise.reject(refreshError);
            }
        }

        // ── 403: Account blocked ────────────────────────────────────────────
        if (status === 403 && !logoutTriggered && token) {
            logoutTriggered = true;
            localStorage.removeItem("token");
            localStorage.removeItem("refresh");
            localStorage.removeItem("username");
            // ✅ Store flash message, show after redirect
            localStorage.setItem("flashMessage", "Your account has been blocked by admin.");
            setTimeout(() => {
                window.location.replace("/login");
            }, 100);
            setTimeout(() => { logoutTriggered = false; }, 3000);
        }

        return Promise.reject(error);
    }
);

export default API;