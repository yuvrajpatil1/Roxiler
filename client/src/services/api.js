import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      url: error.config?.url,
    });

    // Handle specific error cases
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => {
    console.log("Attempting login for:", email);
    return api.post("/auth/login", { email, password });
  },
  register: (userData) => {
    console.log("Attempting registration for:", userData.email);
    return api.post("/auth/register", userData);
  },
  getProfile: () => api.get("/auth/profile"),
  updatePassword: (passwordData) =>
    api.put("/auth/update-password", passwordData),
};

// User API
export const userAPI = {
  getDashboardStats: () => {
    console.log("Fetching dashboard stats");
    return api.get("/users/dashboard/stats");
  },
  getAllUsers: (params = {}) => {
    // Ensure default values for pagination
    const queryParams = {
      page: params.page || 1,
      limit: params.limit || 10,
      ...params,
    };
    console.log("Fetching users with params:", queryParams);
    return api.get("/users", { params: queryParams });
  },
  getUserById: (id) => api.get(`/users/${id}`),
  createUser: (userData) => api.post("/users", userData),
  updateUser: (id, userData) => api.put(`/users/${id}`, userData),
  deleteUser: (id) => api.delete(`/users/${id}`),
};

// Store API
export const storeAPI = {
  createStore: (storeData) => api.post("/stores", storeData),
  getAllStores: (params) => api.get("/stores/admin/all", { params }),
  getStoresForUser: (params) => api.get("/stores/user/list", { params }),
  getStoreById: (id) => api.get(`/stores/${id}`),
  updateStore: (id, storeData) => api.put(`/stores/${id}`, storeData),
  deleteStore: (id) => api.delete(`/stores/${id}`),
};

// Rating API
export const ratingAPI = {
  submitRating: (ratingData) => api.post("/ratings/submit", ratingData),
  getUserRating: (storeId) => api.get(`/ratings/user/${storeId}`),
  getStoreRatings: (storeId) => api.get(`/ratings/store/${storeId}`),
  getOwnerDashboard: () => api.get("/ratings/dashboard"),
  getAllRatings: (params) => api.get("/ratings/admin/all", { params }),
};
