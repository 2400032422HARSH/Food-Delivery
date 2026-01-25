import "dotenv/config";
import express, { Request, Response } from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { db, User, Address, Order } from "./database";

interface AuthRequest extends Request {
  userId?: string;
}

function authenticateToken(req: AuthRequest, res: Response, next: Function) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return next();

  const payload = db.verifyToken(token);
  if (payload) {
    req.userId = payload.userId;
  }

  next();
}

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(authenticateToken);

  // Auth routes
  app.post("/api/auth/register", (req: AuthRequest, res) => {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !phone || !password || !role) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = db.registerUser({ name, email, phone, password, role });
    if (!result) {
      return res.status(400).json({ error: "Email already exists" });
    }

    res.json(result);
  });

  app.post("/api/auth/login", (req: AuthRequest, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    const result = db.loginUser(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    res.json(result);
  });

  app.get("/api/auth/me", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = db.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  });

  // Restaurant routes
  app.get("/api/restaurants", (_req, res) => {
    const restaurants = db.getRestaurants();
    res.json(restaurants);
  });

  app.get("/api/restaurants/:id", (req, res) => {
    const restaurant = db.getRestaurantById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }
    res.json(restaurant);
  });

  app.get("/api/restaurants/:id/menu", (req, res) => {
    const menuItems = db.getMenuItems(req.params.id);
    res.json(menuItems);
  });

  app.post("/api/restaurants/:id/menu", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const restaurant = db.getRestaurantById(req.params.id);
    if (!restaurant || restaurant.ownerId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const {
      name,
      description,
      price,
      category,
      isVeg,
      image,
      preparationTime,
    } = req.body;
    const menuItem = db.addMenuItem(req.params.id, {
      name,
      description,
      price,
      category,
      isVeg,
      image,
      preparationTime: preparationTime || 20,
      isAvailable: true,
    });

    res.json(menuItem);
  });

  app.put("/api/menu-items/:id", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const item = db.getMenuItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const restaurant = db.getRestaurantById(item.restaurantId);
    if (!restaurant || restaurant.ownerId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updated = db.updateMenuItem(req.params.id, req.body);
    res.json(updated);
  });

  app.delete("/api/menu-items/:id", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const item = db.getMenuItemById(req.params.id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    const restaurant = db.getRestaurantById(item.restaurantId);
    if (!restaurant || restaurant.ownerId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    db.deleteMenuItem(req.params.id);
    res.json({ success: true });
  });

  // Cart routes
  app.get("/api/cart", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const cart = db.getCart(req.userId);
    res.json(cart);
  });

  app.post("/api/cart", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { menuItemId, restaurantId, quantity, price } = req.body;
    const cart = db.addToCart(req.userId, {
      menuItemId,
      restaurantId,
      quantity,
      price,
      specialInstructions: req.body.specialInstructions || "",
    });

    res.json(cart);
  });

  app.put("/api/cart/:menuItemId", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const { quantity } = req.body;
    const cart = db.updateCartItem(req.userId, req.params.menuItemId, quantity);
    res.json(cart);
  });

  app.delete("/api/cart/:menuItemId", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const cart = db.removeFromCart(req.userId, req.params.menuItemId);
    res.json(cart);
  });

  app.post("/api/cart/clear", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    db.clearCart(req.userId);
    res.json({ success: true });
  });

  // Address routes
  app.get("/api/addresses", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const addresses = db.getAddresses(req.userId);
    res.json(addresses);
  });

  app.post("/api/addresses", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const address = db.addAddress(req.userId, req.body);
    res.json(address);
  });

  app.put("/api/addresses/:id", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const address = db.updateAddress(req.params.id, req.body);
    if (!address) {
      return res.status(404).json({ error: "Address not found" });
    }

    res.json(address);
  });

  // Order routes
  app.get("/api/orders", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = db.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    let orders;
    if (user.role === "customer") {
      orders = db.getOrdersByCustomerId(req.userId);
    } else if (user.role === "restaurant") {
      const restaurant = db.getRestaurantByOwnerId(req.userId);
      orders = restaurant ? db.getOrdersByRestaurantId(restaurant.id) : [];
    } else {
      orders = db.orders;
    }

    res.json(orders);
  });

  app.get("/api/orders/:id", (req: AuthRequest, res) => {
    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    res.json(order);
  });

  app.post("/api/orders", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const {
      restaurantId,
      items,
      totalPrice,
      deliveryFee,
      tax,
      discount,
      paymentMethod,
      deliveryAddress,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: "Order must have items" });
    }

    const order = db.createOrder({
      customerId: req.userId,
      restaurantId,
      items,
      totalPrice,
      deliveryFee,
      tax,
      discount,
      paymentMethod,
      deliveryAddress,
      status: "pending",
      estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
      actualDeliveryTime: null,
      rating: null,
      review: null,
    });

    res.json(order);
  });

  app.put("/api/orders/:id/status", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const order = db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    const restaurant = db.getRestaurantByOwnerId(req.userId);
    if (!restaurant || restaurant.id !== order.restaurantId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const updatedOrder = db.updateOrderStatus(req.params.id, req.body.status);
    res.json(updatedOrder);
  });

  app.put("/api/orders/:id/rating", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const order = db.getOrderById(req.params.id);
    if (!order || order.customerId !== req.userId) {
      return res.status(403).json({ error: "Not authorized" });
    }

    const { rating, review } = req.body;
    const updatedOrder = db.updateOrderRating(req.params.id, rating, review);
    res.json(updatedOrder);
  });

  // Coupon routes
  app.post("/api/coupons/validate", (req, res) => {
    const { code, amount } = req.body;

    const result = db.validateCoupon(code, amount);
    if (!result) {
      return res.status(400).json({ error: "Invalid or expired coupon" });
    }

    res.json(result);
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const user = db.getUserById(req.userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "admin") {
      return res.status(403).json({ error: "Not authorized" });
    }

    const stats = db.getDashboardStats();
    res.json(stats);
  });

  app.get("/api/restaurant/stats", (req: AuthRequest, res) => {
    if (!req.userId) {
      return res.status(401).json({ error: "Not authenticated" });
    }

    const restaurant = db.getRestaurantByOwnerId(req.userId);
    if (!restaurant) {
      return res.status(404).json({ error: "Restaurant not found" });
    }

    const orders = db.getOrdersByRestaurantId(restaurant.id);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    res.json({
      totalOrders: orders.length,
      todaysOrders: todaysOrders.length,
      totalRevenue: orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + o.totalPrice, 0),
      todaysRevenue: todaysOrders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + o.totalPrice, 0),
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      preparingOrders: orders.filter((o) => o.status === "preparing").length,
      readyOrders: orders.filter((o) => o.status === "ready").length,
      outForDeliveryOrders: orders.filter(
        (o) => o.status === "out_for_delivery",
      ).length,
      deliveredOrders: orders.filter((o) => o.status === "delivered").length,
      cancelledOrders: orders.filter((o) => o.status === "cancelled").length,
    });
  });

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  return app;
}
