import jwt from "jsonwebtoken";

const JWT_SECRET = "harsh-anand-secret-key-change-in-production";

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  password: string;
  role: "customer" | "restaurant" | "admin";
  addresses: Address[];
  createdAt: Date;
}

export interface Address {
  id: string;
  userId: string;
  type: "home" | "work" | "other";
  name: string;
  mobile: string;
  house: string;
  street: string;
  landmark: string;
  city: string;
  pincode: string;
  isDefault: boolean;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  isAvailable: boolean;
  preparationTime: number;
}

export interface RestaurantProfile {
  id: string;
  ownerId: string;
  name: string;
  cuisines: string[];
  image: string;
  rating: number;
  reviews: number;
  deliveryTime: number;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  address: string;
  city: string;
  phone: string;
  openingHours: string;
  closingHours: string;
  offers: string[];
  menu: MenuItem[];
}

export interface CartItem {
  menuItemId: string;
  restaurantId: string;
  quantity: number;
  price: number;
  specialInstructions: string;
}

export interface Order {
  id: string;
  customerId: string;
  restaurantId: string;
  items: CartItem[];
  totalPrice: number;
  deliveryFee: number;
  tax: number;
  discount: number;
  paymentMethod: "COD" | "CARD" | "UPI";
  deliveryAddress: Address;
  status:
    | "pending"
    | "accepted"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "cancelled";
  createdAt: Date;
  estimatedDeliveryTime: Date;
  actualDeliveryTime: Date | null;
  rating: number | null;
  review: string | null;
}

export interface Coupon {
  id: string;
  code: string;
  discount: number;
  minAmount: number;
  maxUses: number;
  uses: number;
  expiryDate: Date;
}

class Database {
  users: User[] = [];
  addresses: Address[] = [];
  restaurants: RestaurantProfile[] = [];
  menuItems: MenuItem[] = [];
  orders: Order[] = [];
  coupons: Coupon[] = [];
  carts: Record<string, CartItem[]> = {};

  constructor() {
    this.seed();
  }

  generateId(prefix: string): string {
    return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  hashPassword(password: string): string {
    return Buffer.from(password).toString("base64");
  }

  generateToken(userId: string): string {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
  }

  verifyToken(token: string): { userId: string } | null {
    try {
      return jwt.verify(token, JWT_SECRET) as { userId: string };
    } catch {
      return null;
    }
  }

  seed() {
    // Seed users
    const customerUser: User = {
      id: "cust-1",
      name: "Rajesh Kumar",
      email: "rajesh@example.com",
      phone: "9876543210",
      password: this.hashPassword("password123"),
      role: "customer",
      addresses: [],
      createdAt: new Date(),
    };

    const restaurantOwner: User = {
      id: "rest-owner-1",
      name: "Priya Sharma",
      email: "priya@anand.com",
      phone: "9876543211",
      password: this.hashPassword("password123"),
      role: "restaurant",
      addresses: [],
      createdAt: new Date(),
    };

    const admin: User = {
      id: "admin-1",
      name: "Admin User",
      email: "admin@harshanandfood.com",
      phone: "9876543212",
      password: this.hashPassword("password123"),
      role: "admin",
      addresses: [],
      createdAt: new Date(),
    };

    this.users = [customerUser, restaurantOwner, admin];

    // Seed addresses
    const address1: Address = {
      id: "addr-1",
      userId: "cust-1",
      type: "home",
      name: "Home",
      mobile: "9876543210",
      house: "123",
      street: "MG Road",
      landmark: "Near Forum Mall",
      city: "Bangalore",
      pincode: "560001",
      isDefault: true,
    };
    this.addresses = [address1];
    customerUser.addresses.push(address1);

    // Seed restaurants
    const restaurant: RestaurantProfile = {
      id: "anand",
      ownerId: "rest-owner-1",
      name: "Anand Restaurant",
      cuisines: ["Indian", "North Indian"],
      image:
        "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop",
      rating: 4.6,
      reviews: 1240,
      deliveryTime: 30,
      deliveryFee: 40,
      minOrder: 200,
      isOpen: true,
      address: "123 Food Street, Downtown",
      city: "Bangalore",
      phone: "9876543211",
      openingHours: "11:00 AM",
      closingHours: "11:00 PM",
      offers: [
        "30% off on orders above ₹500",
        "Free delivery on orders above ₹350",
      ],
      menu: [],
    };

    this.restaurants.push(restaurant);

    // Seed menu items
    const menuData = [
      {
        name: "Butter Chicken",
        description: "Tender chicken in creamy tomato gravy",
        price: 350,
        category: "Main Course",
        isVeg: false,
        image:
          "https://images.unsplash.com/photo-1603894584373-5ac82b2ae655?w=400&h=300&fit=crop",
        preparationTime: 25,
      },
      {
        name: "Paneer Tikka",
        description: "Grilled cottage cheese with spices",
        price: 280,
        category: "Appetizer",
        isVeg: true,
        image:
          "https://images.unsplash.com/photo-1599599810694-b5ac4dd5ccda?w=400&h=300&fit=crop",
        preparationTime: 15,
      },
      {
        name: "Biryani",
        description: "Fragrant basmati rice with meat",
        price: 320,
        category: "Main Course",
        isVeg: false,
        image:
          "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
        preparationTime: 30,
      },
      {
        name: "Garlic Naan",
        description: "Soft flatbread with garlic butter",
        price: 80,
        category: "Bread",
        isVeg: true,
        image:
          "https://images.unsplash.com/photo-1565557623814-dea706bce4f5?w=400&h=300&fit=crop",
        preparationTime: 8,
      },
      {
        name: "Mango Lassi",
        description: "Refreshing yogurt mango drink",
        price: 120,
        category: "Beverage",
        isVeg: true,
        image:
          "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
        preparationTime: 5,
      },
    ];

    menuData.forEach((item) => {
      const menuItem: MenuItem = {
        id: this.generateId("item"),
        restaurantId: restaurant.id,
        ...item,
        isAvailable: true,
      };
      this.menuItems.push(menuItem);
      restaurant.menu.push(menuItem);
    });

    // Seed more restaurants
    const extraRestaurants: RestaurantProfile[] = [
      {
        id: "burger-joint",
        ownerId: "rest-owner-1",
        name: "Burger Joint",
        cuisines: ["American", "Fast Food"],
        image: "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=600&h=400&fit=crop",
        rating: 4.2,
        reviews: 856,
        deliveryTime: 25,
        deliveryFee: 30,
        minOrder: 150,
        isOpen: true,
        address: "45 Main St, City Center",
        city: "Bangalore",
        phone: "9876543212",
        openingHours: "10:00 AM",
        closingHours: "11:00 PM",
        offers: ["Free Fries on orders above ₹200"],
        menu: [],
      },
      {
        id: "pizza-heaven",
        ownerId: "rest-owner-1",
        name: "Pizza Heaven",
        cuisines: ["Italian", "Pizza"],
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&h=400&fit=crop",
        rating: 4.7,
        reviews: 2100,
        deliveryTime: 40,
        deliveryFee: 50,
        minOrder: 300,
        isOpen: true,
        address: "78 Oak Avenue",
        city: "Bangalore",
        phone: "9876543213",
        openingHours: "12:00 PM",
        closingHours: "12:00 AM",
        offers: ["20% off on all Pizzas"],
        menu: [],
      },
      {
        id: "sushi-master",
        ownerId: "rest-owner-1",
        name: "Sushi Master",
        cuisines: ["Japanese", "Sushi"],
        image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=600&h=400&fit=crop",
        rating: 4.9,
        reviews: 540,
        deliveryTime: 45,
        deliveryFee: 80,
        minOrder: 500,
        isOpen: false,
        address: "9th Block Sushi St",
        city: "Bangalore",
        phone: "9876543214",
        openingHours: "5:00 PM",
        closingHours: "11:00 PM",
        offers: [],
        menu: [],
      },
      {
        id: "healthy-bites",
        ownerId: "rest-owner-1",
        name: "Healthy Bites",
        cuisines: ["Healthy Food", "Salads"],
        image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&h=400&fit=crop",
        rating: 4.5,
        reviews: 320,
        deliveryTime: 20,
        deliveryFee: 20,
        minOrder: 100,
        isOpen: true,
        address: "Wellness Park, Phase 1",
        city: "Bangalore",
        phone: "9876543215",
        openingHours: "8:00 AM",
        closingHours: "9:00 PM",
        offers: ["Loyalty Points available"],
        menu: [],
      },
      {
        id: "south-spice",
        ownerId: "rest-owner-1",
        name: "South Spice",
        cuisines: ["South Indian"],
        image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=600&h=400&fit=crop",
        rating: 4.4,
        reviews: 1800,
        deliveryTime: 30,
        deliveryFee: 15,
        minOrder: 50,
        isOpen: true,
        address: "Indiranagar 100ft road",
        city: "Bangalore",
        phone: "9876543216",
        openingHours: "7:00 AM",
        closingHours: "10:00 PM",
        offers: ["Breakfast combo at ₹99"],
        menu: [],
      }
    ];

    const extraMenuData: Record<string, Omit<MenuItem, "id" | "restaurantId">[]> = {
      "burger-joint": [
        { name: "Classic Cheeseburger", description: "Juicy beef patty with cheese", price: 150, category: "Burgers", isVeg: false, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", preparationTime: 10, isAvailable: true },
        { name: "Veggie Burger", description: "Plant-based patty with lettuce", price: 130, category: "Burgers", isVeg: true, image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=400&h=300&fit=crop", preparationTime: 10, isAvailable: true },
        { name: "French Fries", description: "Crispy golden fries", price: 80, category: "Sides", isVeg: true, image: "https://images.unsplash.com/photo-1573080496159-009ab97ea80f?w=400&h=300&fit=crop", preparationTime: 5, isAvailable: true },
      ],
      "pizza-heaven": [
        { name: "Margherita Pizza", description: "Classic cheese and tomato", price: 299, category: "Pizza", isVeg: true, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop", preparationTime: 20, isAvailable: true },
        { name: "Pepperoni Pizza", description: "Loaded with pepperoni", price: 399, category: "Pizza", isVeg: false, image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400&h=300&fit=crop", preparationTime: 20, isAvailable: true },
      ],
      "sushi-master": [
        { name: "California Roll", description: "Crab, avocado, and cucumber", price: 450, category: "Sushi", isVeg: false, image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=300&fit=crop", preparationTime: 15, isAvailable: true },
        { name: "Spicy Tuna Roll", description: "Tuna with spicy mayo", price: 500, category: "Sushi", isVeg: false, image: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=400&h=300&fit=crop", preparationTime: 15, isAvailable: true },
      ],
      "healthy-bites": [
        { name: "Quinoa Salad", description: "Fresh greens with quinoa", price: 250, category: "Salads", isVeg: true, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop", preparationTime: 10, isAvailable: true },
        { name: "Green Smoothie", description: "Spinach, kale, and apple", price: 150, category: "Beverages", isVeg: true, image: "https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=400&h=300&fit=crop", preparationTime: 5, isAvailable: true },
      ],
      "south-spice": [
        { name: "Masala Dosa", description: "Crispy crepe with potato filling", price: 90, category: "Breakfast", isVeg: true, image: "https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=400&h=300&fit=crop", preparationTime: 10, isAvailable: true },
        { name: "Idli Sambar", description: "Steamed rice cakes with lentil soup", price: 60, category: "Breakfast", isVeg: true, image: "https://images.unsplash.com/photo-1589301760014-d929f39ce9b0?w=400&h=300&fit=crop", preparationTime: 5, isAvailable: true },
      ]
    };

    extraRestaurants.forEach((rest) => {
      this.restaurants.push(rest);
      extraMenuData[rest.id].forEach((item) => {
        const menuItem: MenuItem = {
          id: this.generateId("item"),
          restaurantId: rest.id,
          ...item,
        };
        this.menuItems.push(menuItem);
        rest.menu.push(menuItem);
      });
    });

    // Seed coupons
    this.coupons = [
      {
        id: "coupon-1",
        code: "WELCOME50",
        discount: 50,
        minAmount: 200,
        maxUses: 100,
        uses: 10,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      {
        id: "coupon-2",
        code: "FIRST30",
        discount: 30,
        minAmount: 150,
        maxUses: 50,
        uses: 5,
        expiryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    ];
  }

  // User operations
  registerUser(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
    role: "customer" | "restaurant" | "admin";
  }): { user: User; token: string } | null {
    if (this.users.find((u) => u.email === data.email)) return null;

    const user: User = {
      id: this.generateId(data.role.substring(0, 3)),
      ...data,
      password: this.hashPassword(data.password),
      addresses: [],
      createdAt: new Date(),
    };

    this.users.push(user);
    const token = this.generateToken(user.id);
    return { user, token };
  }

  loginUser(
    email: string,
    password: string,
  ): { user: User; token: string } | null {
    const user = this.users.find(
      (u) => u.email === email && u.password === this.hashPassword(password),
    );
    if (!user) return null;

    const token = this.generateToken(user.id);
    return { user, token };
  }

  getUserById(userId: string): User | null {
    return this.users.find((u) => u.id === userId) || null;
  }

  // Address operations
  addAddress(userId: string, address: Omit<Address, "id" | "userId">): Address {
    const newAddress: Address = {
      ...address,
      id: this.generateId("addr"),
      userId,
    };

    this.addresses.push(newAddress);
    const user = this.getUserById(userId);
    if (user) user.addresses.push(newAddress);

    return newAddress;
  }

  updateAddress(addressId: string, data: Partial<Address>): Address | null {
    const address = this.addresses.find((a) => a.id === addressId);
    if (!address) return null;

    Object.assign(address, data);
    return address;
  }

  getAddresses(userId: string): Address[] {
    return this.addresses.filter((a) => a.userId === userId);
  }

  // Restaurant operations
  getRestaurants(): RestaurantProfile[] {
    return this.restaurants;
  }

  getRestaurantById(id: string): RestaurantProfile | null {
    return this.restaurants.find((r) => r.id === id) || null;
  }

  getRestaurantByOwnerId(ownerId: string): RestaurantProfile | null {
    return this.restaurants.find((r) => r.ownerId === ownerId) || null;
  }

  getRestaurantsByOwnerId(ownerId: string): RestaurantProfile[] {
    return this.restaurants.filter((r) => r.ownerId === ownerId);
  }

  updateRestaurant(
    id: string,
    data: Partial<RestaurantProfile>,
  ): RestaurantProfile | null {
    const restaurant = this.getRestaurantById(id);
    if (!restaurant) return null;

    Object.assign(restaurant, data);
    return restaurant;
  }

  // Menu operations
  getMenuItems(restaurantId: string): MenuItem[] {
    return this.menuItems.filter((m) => m.restaurantId === restaurantId);
  }

  getMenuItemById(id: string): MenuItem | null {
    return this.menuItems.find((m) => m.id === id) || null;
  }

  addMenuItem(
    restaurantId: string,
    data: Omit<MenuItem, "id" | "restaurantId">,
  ): MenuItem {
    const menuItem: MenuItem = {
      ...data,
      id: this.generateId("item"),
      restaurantId,
    };

    this.menuItems.push(menuItem);
    const restaurant = this.getRestaurantById(restaurantId);
    if (restaurant) restaurant.menu.push(menuItem);

    return menuItem;
  }

  updateMenuItem(id: string, data: Partial<MenuItem>): MenuItem | null {
    const item = this.getMenuItemById(id);
    if (!item) return null;

    Object.assign(item, data);
    return item;
  }

  deleteMenuItem(id: string): boolean {
    const index = this.menuItems.findIndex((m) => m.id === id);
    if (index === -1) return false;

    const item = this.menuItems[index];
    this.menuItems.splice(index, 1);

    const restaurant = this.getRestaurantById(item.restaurantId);
    if (restaurant) {
      const restIndex = restaurant.menu.findIndex((m) => m.id === id);
      if (restIndex !== -1) restaurant.menu.splice(restIndex, 1);
    }

    return true;
  }

  // Cart operations
  getCart(userId: string): CartItem[] {
    return this.carts[userId] || [];
  }

  addToCart(userId: string, item: CartItem): CartItem[] {
    if (!this.carts[userId]) this.carts[userId] = [];

    const existingIndex = this.carts[userId].findIndex(
      (i) =>
        i.menuItemId === item.menuItemId &&
        i.restaurantId === item.restaurantId,
    );

    if (existingIndex !== -1) {
      this.carts[userId][existingIndex].quantity += item.quantity;
    } else {
      this.carts[userId].push(item);
    }

    return this.carts[userId];
  }

  removeFromCart(userId: string, menuItemId: string): CartItem[] {
    if (!this.carts[userId]) return [];

    this.carts[userId] = this.carts[userId].filter(
      (i) => i.menuItemId !== menuItemId,
    );
    return this.carts[userId];
  }

  updateCartItem(
    userId: string,
    menuItemId: string,
    quantity: number,
  ): CartItem[] {
    if (!this.carts[userId]) return [];

    const item = this.carts[userId].find((i) => i.menuItemId === menuItemId);
    if (item) {
      if (quantity <= 0) {
        return this.removeFromCart(userId, menuItemId);
      }
      item.quantity = quantity;
    }

    return this.carts[userId];
  }

  clearCart(userId: string): void {
    this.carts[userId] = [];
  }

  // Order operations
  createOrder(data: Omit<Order, "id" | "createdAt">): Order {
    const order: Order = {
      ...data,
      id: this.generateId("ORD"),
      createdAt: new Date(),
    };

    this.orders.push(order);
    this.clearCart(data.customerId);
    return order;
  }

  getOrdersByCustomerId(customerId: string): Order[] {
    return this.orders.filter((o) => o.customerId === customerId);
  }

  getOrdersByRestaurantId(restaurantId: string): Order[] {
    return this.orders.filter((o) => o.restaurantId === restaurantId);
  }

  getOrderById(id: string): Order | null {
    return this.orders.find((o) => o.id === id) || null;
  }

  updateOrderStatus(orderId: string, status: Order["status"]): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.status = status;
    if (status === "delivered") {
      order.actualDeliveryTime = new Date();
    }

    return order;
  }

  updateOrderRating(
    orderId: string,
    rating: number,
    review: string,
  ): Order | null {
    const order = this.getOrderById(orderId);
    if (!order) return null;

    order.rating = rating;
    order.review = review;
    return order;
  }

  // Coupon operations
  validateCoupon(code: string, amount: number): { discount: number } | null {
    const coupon = this.coupons.find((c) => c.code === code);
    if (!coupon) return null;
    if (coupon.uses >= coupon.maxUses) return null;
    if (coupon.expiryDate < new Date()) return null;
    if (amount < coupon.minAmount) return null;

    coupon.uses += 1;
    return { discount: coupon.discount };
  }

  // Stats
  getDashboardStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todaysOrders = this.orders.filter((o) => {
      const orderDate = new Date(o.createdAt);
      orderDate.setHours(0, 0, 0, 0);
      return orderDate.getTime() === today.getTime();
    });

    return {
      totalUsers: this.users.filter((u) => u.role === "customer").length,
      totalRestaurants: this.restaurants.length,
      totalOrders: this.orders.length,
      todaysOrders: todaysOrders.length,
      totalRevenue: this.orders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + o.totalPrice, 0),
      todaysRevenue: todaysOrders
        .filter((o) => o.status === "delivered")
        .reduce((sum, o) => sum + o.totalPrice, 0),
      activeOrders: this.orders.filter((o) =>
        [
          "pending",
          "accepted",
          "preparing",
          "ready",
          "out_for_delivery",
        ].includes(o.status),
      ).length,
      cancelledOrders: this.orders.filter((o) => o.status === "cancelled")
        .length,
    };
  }
}

export const db = new Database();
