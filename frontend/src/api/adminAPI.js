import axios from "axios";
import { toast } from "react-toastify";

let logoutTriggered = false;

const AdminAPI = axios.create({
  baseURL: "http://127.0.0.1:8000/api/admin/",
});

AdminAPI.interceptors.request.use((req) => {
  const token = localStorage.getItem("AdminToken");
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

AdminAPI.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response) return Promise.reject(error);

    const status = error.response.status;
    const token = localStorage.getItem("AdminToken");
    const refresh = localStorage.getItem("AdminRefresh");
    const originalRequest = error.config;

    // ── 401: Try token refresh ──────────────────────────────────────────
    if (status === 401 && !originalRequest._retry && refresh) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          "http://127.0.0.1:8000/api/accounts/token/refresh/",
          { refresh },
        );
        const newAccessToken = res.data.access;
        localStorage.setItem("AdminToken", newAccessToken);
        AdminAPI.defaults.headers.common["Authorization"] =`Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return AdminAPI(originalRequest);
      } catch (refreshError) {
        if (!logoutTriggered) {
          logoutTriggered = true;
          localStorage.removeItem("AdminToken");
          localStorage.removeItem("AdminRefresh");
          localStorage.removeItem("username");

          // ✅ Check WHY refresh failed
          const refreshStatus = refreshError.response?.status;
          const refreshDetail = refreshError.response?.data?.detail || "";

          if (
            refreshStatus === 401 &&
            refreshDetail.toLowerCase().includes("active")
          ) {
            localStorage.setItem(
              "flashMessage",
              "Your account has been blocked by admin.",
            );
          } else {
            localStorage.setItem(
              "flashMessage",
              "Session expired. Please log in again.",
            );
          }

          setTimeout(() => {
            window.location.replace("/admin");
          }, 100);
          setTimeout(() => {
            logoutTriggered = false;
          }, 3000);
        }
        return Promise.reject(refreshError);
      }
    }

    // ── 403: Account blocked / not admin ───────────────────────────────
    if (status === 403 && !logoutTriggered && token) {

      logoutTriggered = true;
      localStorage.removeItem("AdminToken");
      localStorage.removeItem("AdminRefresh");
      localStorage.removeItem("username");
      // ✅ Store flash message, show it on the login page after redirect
      localStorage.setItem(
        "flashMessage",
        "Your account has been blocked by admin.",
      );
      setTimeout(() => {
        window.location.replace("/admin");
      }, 100);
      setTimeout(() => {
        logoutTriggered = false;
      }, 3000);
    }

    return Promise.reject(error);
  },
);

export default AdminAPI;
