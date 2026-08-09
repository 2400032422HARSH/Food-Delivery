const API_BASE = "/api";

export interface ApiError {
  error: string;
}

function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("authToken");
}

function setAuthToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("authToken", token);
  } else {
    localStorage.removeItem("authToken");
  }
}

async function apiCall<T>(
  method: string,
  endpoint: string,
  body?: any,
): Promise<T> {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "API request failed");
  }

  return data;
}

// Auth APIs
export const authApi = {
  register: (data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "customer" | "restaurant" | "admin";
  }) =>
    apiCall<{ user: any; token: string }>("POST", "/auth/register", data).then(
      (result) => {
        setAuthToken(result.token);
        return result;
      },
    ),

  login: (email: string, password: string) =>
    apiCall<{ user: any; token: string }>("POST", "/auth/login", {
      email,
      password,
    }).then((result) => {
      setAuthToken(result.token);
      return result;
    }),

  logout: () => setAuthToken(null),

  getMe: () => apiCall<any>("GET", "/auth/me"),
};

// Restaurant APIs
export const restaurantApi = {
  getAll: () => apiCall<any[]>("GET", "/restaurants"),
  getById: (id: string) => apiCall<any>("GET", `/restaurants/${id}`),
  getMenu: (id: string) => apiCall<any[]>("GET", `/restaurants/${id}/menu`),
  addMenuItem: (restaurantId: string, data: any) =>
    apiCall<any>("POST", `/restaurants/${restaurantId}/menu`, data),
  updateMenuItem: (id: string, data: any) =>
    apiCall<any>("PUT", `/menu-items/${id}`, data),
  deleteMenuItem: (id: string) => apiCall<any>("DELETE", `/menu-items/${id}`),
};

// Cart APIs
export const cartApi = {
  getCart: () => apiCall<any[]>("GET", "/cart"),
  addItem: (item: any) => apiCall<any[]>("POST", "/cart", item),
  updateItem: (menuItemId: string, quantity: number) =>
    apiCall<any[]>("PUT", `/cart/${menuItemId}`, { quantity }),
  removeItem: (menuItemId: string) =>
    apiCall<any[]>("DELETE", `/cart/${menuItemId}`),
  clear: () => apiCall<any>("POST", "/cart/clear"),
};

// Address APIs
export const addressApi = {
  getAll: () => apiCall<any[]>("GET", "/addresses"),
  add: (data: any) => apiCall<any>("POST", "/addresses", data),
  update: (id: string, data: any) =>
    apiCall<any>("PUT", `/addresses/${id}`, data),
};

// Order APIs
export const orderApi = {
  getAll: () => apiCall<any[]>("GET", "/orders"),
  getById: (id: string) => apiCall<any>("GET", `/orders/${id}`),
  create: (data: any) => apiCall<any>("POST", "/orders", data),
  updateStatus: (id: string, status: string) =>
    apiCall<any>("PUT", `/orders/${id}/status`, { status }),
  updateRating: (id: string, rating: number, review: string) =>
    apiCall<any>("PUT", `/orders/${id}/rating`, { rating, review }),
};

// Coupon APIs
export const couponApi = {
  validate: (code: string, amount: number) =>
    apiCall<any>("POST", "/coupons/validate", { code, amount }),
};

// Dashboard APIs
export const dashboardApi = {
  getStats: () => apiCall<any>("GET", "/dashboard/stats"),
  getRestaurantStats: () => apiCall<any>("GET", "/restaurant/stats"),
};

// Admin APIs (Mock implementations until server is ready)
export const adminApi = {
  // Users
  getUsers: () => apiCall<any[]>("GET", "/admin/users"),
  updateUserStatus: (id: string, status: "active" | "blocked") =>
    apiCall<any>("PATCH", `/admin/users/${id}/status`, { status }),

  // Restaurants
  getRestaurants: () => apiCall<any[]>("GET", "/admin/restaurants"),
  updateRestaurantStatus: (
    id: string,
    status: "pending" | "approved" | "rejected" | "blocked"
  ) => apiCall<any>("PATCH", `/admin/restaurants/${id}/status`, { status }),
  updateRestaurantDetails: (id: string, data: any) =>
    apiCall<any>("PUT", `/admin/restaurants/${id}`, data),

  // Coupons
  getCoupons: () => apiCall<any[]>("GET", "/admin/coupons"),
  createCoupon: (data: any) => apiCall<any>("POST", "/admin/coupons", data),
  updateCoupon: (id: string, data: any) =>
    apiCall<any>("PUT", `/admin/coupons/${id}`, data),
  deleteCoupon: (id: string) => apiCall<any>("DELETE", `/admin/coupons/${id}`),

  // Reports
  getAdvancedReports: (cityFilter?: string, timeFilter?: string) =>
    apiCall<any>("GET", "/admin/reports", { cityFilter, timeFilter }), // Might need query params normally, mocking for now
};

export { getAuthToken, setAuthToken };
