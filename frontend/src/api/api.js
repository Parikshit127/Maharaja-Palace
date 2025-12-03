import axios from "axios";
import { showToast } from "../utils/toast";

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  "https://maharaja-palace-xost.onrender.com/api";

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
        // Special handling for booking conflicts
        if (data?.conflictingBooking) {
          showToast(
            `${data.message} Room is booked from ${new Date(
              data.conflictingBooking.checkIn
            ).toLocaleDateString()} to ${new Date(
              data.conflictingBooking.checkOut
            ).toLocaleDateString()}`,
            "error"
          );
        } else {
          showToast(data?.message || "This resource already exists.", "error");
        }
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
  // Room Types
  getRoomTypes: () => api.get("/rooms/room-types"),
  createRoomType: (data) => api.post("/rooms/room-types", data),
  updateRoomType: (id, data) => api.put(`/rooms/room-types/${id}`, data),
  deleteRoomType: (id) => api.delete(`/rooms/room-types/${id}`),

  // Rooms
  getAllRooms: () => api.get("/rooms"),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (data) => api.post("/rooms", data),
  updateRoom: (id, data) => api.put(`/rooms/${id}`, data),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  updateRoomStatus: (id, status) => api.put(`/rooms/${id}/status`, { status }),

  // Availability & Booking Validation
  getAvailableRooms: (checkInOrParams, checkOut, guests) => {
    const params =
      typeof checkInOrParams === "object"
        ? checkInOrParams
        : { checkIn: checkInOrParams, checkOut, guests };

    return api.get("/rooms/available", { params });
  },

  getAvailableRoomTypes: (checkIn, checkOut, guests) =>
    api.get("/rooms/available-types", {
      params: { checkIn, checkOut, guests: guests || 1 },
    }),

  checkRoomAvailability: (roomId, checkIn, checkOut) =>
    api.get("/rooms/check-availability", {
      params: { roomId, checkIn, checkOut },
    }),
};

// Booking APIs
export const bookingAPI = {
  createBooking: (data) => api.post("/bookings", data),
  getMyBookings: () => api.get("/bookings/me"),
  getBookings: () => api.get("/bookings"), // Admin - get all bookings
  getAllBookings: () => api.get("/bookings"), // Alias for consistency
  getBookingDetails: (id) => api.get(`/bookings/${id}`),
  cancelBooking: (id) => api.put(`/bookings/${id}/cancel`),
  updateBookingStatus: (id, status) =>
    api.put(`/bookings/${id}/status`, { status }),
  updatePayment: (id, data) => api.put(`/bookings/${id}/payment`, data),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  validateBooking: (roomId, checkIn, checkOut) =>
    roomAPI.checkRoomAvailability(roomId, checkIn, checkOut),
};

// Banquet APIs
export const banquetAPI = {
  // Halls
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

  // Bookings - ✅ ADDED MISSING FUNCTIONS
  createBooking: (data) => api.post("/banquet/bookings", data),
  getAllBookings: () => api.get("/banquet/bookings"),
  getMyBookings: () => api.get("/banquet/bookings/me"),
  cancelBooking: (id) => api.put(`/banquet/bookings/${id}/cancel`),
  updateBookingStatus: (id, status) =>
    api.put(`/banquet/bookings/${id}/status`, { status }),
  updatePayment: (id, data) => api.put(`/banquet/bookings/${id}/payment`, data),

  // Stats
  getStats: () => api.get("/banquet/stats"),
};

// Restaurant APIs
export const restaurantAPI = {
  // Tables
  getAllTables: () => api.get("/restaurant/tables"),
  getTableById: (id) => api.get(`/restaurant/tables/${id}`),
  createTable: (data) => api.post("/restaurant/tables", data),
  updateTable: (id, data) => api.put(`/restaurant/tables/${id}`, data),
  deleteTable: (id) => api.delete(`/restaurant/tables/${id}`),

  // Bookings
  createBooking: (data) => api.post("/restaurant/bookings", data),
  getAllBookings: () => api.get("/restaurant/bookings"),
  getMyBookings: () => api.get("/restaurant/bookings/me"),
  cancelBooking: (id) => api.put(`/restaurant/bookings/${id}/cancel`),
  updateBookingStatus: (id, status) =>
    api.put(`/restaurant/bookings/${id}/status`, { status }),
  updatePayment: (id, data) =>
    api.put(`/restaurant/bookings/${id}/payment`, data),
};

export default api;
