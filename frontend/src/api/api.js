import axios from "axios";
import { showToast } from "../utils/toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

console.log("🔗 API Base URL:", API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000, // 10 seconds timeout
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle responses with comprehensive error handling
api.interceptors.response.use(
  (response) => {
    // Optionally show success toast for mutations
    if (["post", "put", "delete"].includes(response.config.method)) {
      const successMessage = response.data?.message || "Operation successful";
      if (response.config.showSuccessToast !== false) {
        showToast(successMessage, "success");
      }
    }
    return response;
  },
  (error) => {
    // Network error (no response from server)
    if (!error.response) {
      if (error.code === "ECONNABORTED") {
        showToast("Request timeout. Please try again.", "error");
      } else if (error.code === "ERR_NETWORK") {
        console.error("🔴 Cannot connect to backend at:", API_BASE_URL);
        console.error(
          "Make sure your backend server is running on the correct port"
        );
        showToast(
          "Cannot connect to server. Please check if backend is running.",
          "error"
        );
      } else {
        showToast("Network error. Please check your connection.", "error");
      }
      return Promise.reject(error);
    }

    const { status, data } = error.response;

    // Handle different error status codes
    switch (status) {
      case 400:
        showToast(
          data?.message || "Invalid request. Please check your input.",
          "error"
        );
        break;

      case 401:
        showToast("Session expired. Please login again.", "error");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
        break;

      case 403:
        showToast(
          "You do not have permission to perform this action.",
          "error"
        );
        break;

      case 404:
        showToast(data?.message || "Resource not found.", "error");
        break;

      case 409:
        showToast(data?.message || "This resource already exists.", "error");
        break;

      case 500:
      case 502:
      case 503:
        showToast("Server error. Please try again later.", "error");
        break;

      default:
        showToast(
          data?.message || "An error occurred. Please try again.",
          "error"
        );
    }

    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getMe: () => api.get("/auth/me"),
  getAllUsers: () => api.get("/auth/users"),
  getUserDetails: (id) => api.get(`/auth/users/${id}`),
  updateUser: (id, data) => api.put(`/auth/users/${id}`, data),
  toggleUserStatus: (id) => api.put(`/auth/users/${id}/status`),
};

// Room APIs
export const roomAPI = {
  getRoomTypes: () => api.get("/rooms/room-types"),
  createRoomType: (data) => api.post("/rooms/room-types", data),
  updateRoomType: (id, data) => api.put(`/rooms/room-types/${id}`, data),
  deleteRoomType: (id) => api.delete(`/rooms/room-types/${id}`),
  getAvailableRooms: (params) => api.get("/rooms/available", { params }),
  getAllRooms: () => api.get("/rooms"),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post("/rooms", data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  updateRoomStatus: (id, status) => api.put(`/rooms/${id}/status`, { status }),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/me"),
  getBookings: () => api.get("/bookings"),
  getBookingDetails: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  updateBookingStatus: (id, status) =>
    api.put(`/bookings/${id}/status`, { status }),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
};

// Banquet APIs
export const banquetAPI = {
  getAllHalls: () => api.get("/banquet/halls"),
  createHall: (formData) => {
    return api.post("/banquet/halls", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  updateHall: (id, formData) => {
    return api.put(`/banquet/halls/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },
  deleteHall: (id) => api.delete(`/banquet/halls/${id}`),
  getAllBookings: () => api.get("/banquet/bookings"),
  getStats: () => api.get("/banquet/stats"),
};

// Restaurant APIs
export const restaurantAPI = {
  getAllTables: () => api.get("/restaurant/tables"),
  getTableById: (id) => api.get(`/restaurant/tables/${id}`),
  createTable: (data) => api.post("/restaurant/tables", data),
  updateTable: (id, data) => api.put(`/restaurant/tables/${id}`, data),
  deleteTable: (id) => api.delete(`/restaurant/tables/${id}`),
  createBooking: (data) => api.post("/restaurant/bookings", data),
  getAllBookings: () => api.get("/restaurant/bookings"),
  getMyBookings: () => api.get("/restaurant/bookings/me"),
};

export default api;
