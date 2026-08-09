export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  isVeg: boolean;
  isSpicy: boolean;
  preparationTime: number;
  rating: number;
  reviews: number;
}

export interface Restaurant {
  id: string;
  name: string;
  cuisine: string[];
  rating: number;
  reviews: number;
  image: string;
  logo: string;
  deliveryTime: number;
  deliveryFee: number;
  minOrder: number;
  isOpen: boolean;
  address: string;
  city: string;
  openingHours: string;
  closingHours: string;
  offers: string[];
  distance: number;
  menu: MenuItem[];
  topDishes: MenuItem[];
  status: "pending" | "approved" | "rejected" | "blocked"; // New admin status
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
  role: "customer" | "restaurant" | "admin";
  status: "active" | "blocked"; // New admin status
}

// New Coupon Interface
export interface Coupon {
  id: string;
  code: string;
  discountPercentage: number;
  maxDiscount: number;
  minOrderAmount: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  applicableRestaurants: string[]; // array of restaurant IDs, or empty for all
}

export interface Address {
  id: string;
  type: "home" | "work" | "other";
  address: string;
  city: string;
  coordinates: { lat: number; lng: number };
  isDefault: boolean;
}

export interface CartItem {
  id: string;
  menuItemId: string;
  restaurantId: string;
  quantity: number;
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
  appliedCoupon: string | null;
  discount: number;
  paymentMethod: "COD" | "CARD" | "UPI";
  deliveryAddress: Address;
  orderStatus: "pending" | "accepted" | "preparing" | "ready" | "out_for_delivery" | "delivered" | "cancelled";
  createdAt: Date;
  estimatedDeliveryTime: Date;
  actualDeliveryTime: Date | null;
  rating: number | null;
  review: string | null;
}

const menuItems: Record<string, MenuItem[]> = {
  anand: [
    {
      id: "1",
      name: "Butter Chicken",
      description: "Tender chicken pieces in a creamy tomato-based gravy",
      price: 350,
      image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae655?w=400&h=300&fit=crop",
      category: "Main Course",
      isVeg: false,
      isSpicy: false,
      preparationTime: 25,
      rating: 4.7,
      reviews: 238,
    },
    {
      id: "2",
      name: "Paneer Tikka",
      description: "Grilled cottage cheese cubes with Indian spices",
      price: 280,
      image: "https://images.unsplash.com/photo-1599599810694-b5ac4dd5ccda?w=400&h=300&fit=crop",
      category: "Appetizer",
      isVeg: true,
      isSpicy: true,
      preparationTime: 15,
      rating: 4.6,
      reviews: 156,
    },
    {
      id: "3",
      name: "Biryani",
      description: "Fragrant basmati rice cooked with marinated meat and spices",
      price: 320,
      image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop",
      category: "Main Course",
      isVeg: false,
      isSpicy: false,
      preparationTime: 30,
      rating: 4.8,
      reviews: 412,
    },
    {
      id: "4",
      name: "Garlic Naan",
      description: "Soft flatbread brushed with garlic butter",
      price: 80,
      image: "https://images.unsplash.com/photo-1565557623814-dea706bce4f5?w=400&h=300&fit=crop",
      category: "Bread",
      isVeg: true,
      isSpicy: false,
      preparationTime: 8,
      rating: 4.5,
      reviews: 89,
    },
    {
      id: "5",
      name: "Mango Lassi",
      description: "Refreshing yogurt-based mango drink",
      price: 120,
      image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=300&fit=crop",
      category: "Beverage",
      isVeg: true,
      isSpicy: false,
      preparationTime: 5,
      rating: 4.4,
      reviews: 67,
    },
  ],
  spice_route: [
    {
      id: "6",
      name: "Tandoori Chicken",
      description: "Marinated chicken grilled in tandoor oven",
      price: 380,
      image: "https://images.unsplash.com/photo-1565557623814-dea706bce4f5?w=400&h=300&fit=crop",
      category: "Main Course",
      isVeg: false,
      isSpicy: true,
      preparationTime: 28,
      rating: 4.7,
      reviews: 234,
    },
    {
      id: "7",
      name: "Dal Makhani",
      description: "Creamy black lentils slow-cooked with spices",
      price: 240,
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
      category: "Main Course",
      isVeg: true,
      isSpicy: false,
      preparationTime: 20,
      rating: 4.5,
      reviews: 145,
    },
    {
      id: "8",
      name: "Samosa",
      description: "Crispy triangular pastry filled with potatoes and peas",
      price: 60,
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=300&fit=crop",
      category: "Appetizer",
      isVeg: true,
      isSpicy: true,
      preparationTime: 10,
      rating: 4.6,
      reviews: 192,
    },
  ],
  pasta_paradise: [
    {
      id: "9",
      name: "Spaghetti Carbonara",
      description: "Creamy pasta with bacon and parmesan",
      price: 380,
      image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop",
      category: "Pasta",
      isVeg: false,
      isSpicy: false,
      preparationTime: 20,
      rating: 4.6,
      reviews: 178,
    },
    {
      id: "10",
      name: "Margherita Pizza",
      description: "Classic pizza with tomato, mozzarella, and basil",
      price: 340,
      image: "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
      category: "Pizza",
      isVeg: true,
      isSpicy: false,
      preparationTime: 22,
      rating: 4.7,
      reviews: 256,
    },
    {
      id: "11",
      name: "Tiramisu",
      description: "Italian dessert with coffee and mascarpone",
      price: 180,
      image: "https://images.unsplash.com/photo-1571115764595-644a12c40220?w=400&h=300&fit=crop",
      category: "Dessert",
      isVeg: true,
      isSpicy: false,
      preparationTime: 5,
      rating: 4.8,
      reviews: 134,
    },
  ],
  burger_house: [
    {
      id: "12",
      name: "Classic Burger",
      description: "Juicy beef patty with lettuce, tomato, and special sauce",
      price: 320,
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
      category: "Burger",
      isVeg: false,
      isSpicy: false,
      preparationTime: 15,
      rating: 4.5,
      reviews: 312,
    },
    {
      id: "13",
      name: "Veggie Burger",
      description: "Plant-based patty with fresh vegetables",
      price: 280,
      image: "https://images.unsplash.com/photo-1585238341710-4d4487c3b966?w=400&h=300&fit=crop",
      category: "Burger",
      isVeg: true,
      isSpicy: false,
      preparationTime: 12,
      rating: 4.4,
      reviews: 89,
    },
    {
      id: "14",
      name: "Cheese Fries",
      description: "Crispy fries topped with melted cheese and bacon",
      price: 160,
      image: "https://images.unsplash.com/photo-1585238341710-4d4487c3b966?w=400&h=300&fit=crop",
      category: "Sides",
      isVeg: false,
      isSpicy: false,
      preparationTime: 10,
      rating: 4.6,
      reviews: 201,
    },
  ],
};

export const mockRestaurants: Restaurant[] = [
  {
    id: "anand",
    name: "Anand Restaurant",
    cuisine: ["Indian", "North Indian", "Mughlai"],
    rating: 4.6,
    reviews: 1240,
    image: "https://images.unsplash.com/photo-1567521464027-f127ff144326?w=600&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=100&h=100&fit=crop",
    deliveryTime: 30,
    deliveryFee: 40,
    minOrder: 200,
    isOpen: true,
    address: "123 Food Street, Downtown",
    city: "Bangalore",
    openingHours: "11:00 AM",
    closingHours: "11:00 PM",
    offers: ["30% off on orders above ₹500", "Free delivery on orders above ₹350"],
    distance: 2.5,
    menu: menuItems.anand,
    topDishes: menuItems.anand.slice(0, 3),
    status: "approved",
  },
  {
    id: "spice_route",
    name: "Spice Route",
    cuisine: ["Indian", "Chinese", "Continental"],
    rating: 4.5,
    reviews: 890,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=100&h=100&fit=crop",
    deliveryTime: 35,
    deliveryFee: 50,
    minOrder: 250,
    isOpen: true,
    address: "456 Spice Lane, MG Road",
    city: "Bangalore",
    openingHours: "12:00 PM",
    closingHours: "10:30 PM",
    offers: ["₹100 off on first order", "Buy 1 Get 1 on selected items"],
    distance: 3.2,
    menu: menuItems.spice_route,
    topDishes: menuItems.spice_route.slice(0, 2),
    status: "approved",
  },
  {
    id: "pasta_paradise",
    name: "Pasta Paradise",
    cuisine: ["Italian", "Continental"],
    rating: 4.7,
    reviews: 654,
    image: "https://images.unsplash.com/photo-1504674900967-8e6efff92b11?w=600&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=100&h=100&fit=crop",
    deliveryTime: 28,
    deliveryFee: 60,
    minOrder: 300,
    isOpen: true,
    address: "789 Italian Plaza, Koramangala",
    city: "Bangalore",
    openingHours: "11:30 AM",
    closingHours: "10:00 PM",
    offers: ["Extra 20% off on pasta orders"],
    distance: 4.1,
    menu: menuItems.pasta_paradise,
    topDishes: menuItems.pasta_paradise.slice(0, 2),
    status: "blocked",
  },
  {
    id: "burger_house",
    name: "Burger House",
    cuisine: ["Fast Food", "American", "Continental"],
    rating: 4.4,
    reviews: 1123,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=400&fit=crop",
    logo: "https://images.unsplash.com/photo-1611003228941-98852ba62227?w=100&h=100&fit=crop",
    deliveryTime: 20,
    deliveryFee: 30,
    minOrder: 150,
    isOpen: true,
    address: "321 Burger Street, Whitefield",
    city: "Bangalore",
    openingHours: "10:00 AM",
    closingHours: "11:59 PM",
    offers: ["₹50 off on orders above ₹400"],
    distance: 5.3,
    menu: menuItems.burger_house,
    topDishes: menuItems.burger_house.slice(0, 2),
    status: "pending",
  },
];

export const mockUsers: User[] = [
  {
    id: "user1",
    name: "John Doe",
    email: "john@example.com",
    phone: "9876543210",
    role: "customer",
    status: "active",
    addresses: [
      {
        id: "addr1",
        type: "home",
        address: "123 Main Street, Apt 4B",
        city: "Bangalore",
        coordinates: { lat: 12.9716, lng: 77.5946 },
        isDefault: true,
      },
    ],
  },
  {
    id: "user2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543211",
    role: "customer",
    status: "blocked",
    addresses: [],
  },
  {
    id: "admin1",
    name: "Harsh Anand",
    email: "admin@anand.com",
    phone: "9999999999",
    role: "admin",
    status: "active",
    addresses: [],
  }
];

export const mockCoupons: Coupon[] = [
  {
    id: "C1",
    code: "WELCOME50",
    discountPercentage: 50,
    maxDiscount: 100,
    minOrderAmount: 200,
    validFrom: new Date().toISOString(),
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: true,
    applicableRestaurants: [],
  },
  {
    id: "C2",
    code: "FESTIVE20",
    discountPercentage: 20,
    maxDiscount: 200,
    minOrderAmount: 500,
    validFrom: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    validUntil: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    isActive: false,
    applicableRestaurants: ["anand", "spice_route"],
  }
];

export const mockOrders: Order[] = [
  {
    id: "ORD-001",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "1", menuItemId: "1", restaurantId: "anand", quantity: 2, specialInstructions: "" },
      { id: "2", menuItemId: "4", restaurantId: "anand", quantity: 1, specialInstructions: "Extra butter" },
    ],
    totalPrice: 710,
    deliveryFee: 40,
    tax: 100,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "UPI",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "delivered",
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    estimatedDeliveryTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
    actualDeliveryTime: new Date(Date.now() - 23 * 60 * 60 * 1000),
    rating: 5,
    review: "Excellent food and service!",
  },
  {
    id: "ORD-002",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "3", menuItemId: "3", restaurantId: "anand", quantity: 1, specialInstructions: "" },
    ],
    totalPrice: 320,
    deliveryFee: 40,
    tax: 50,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "COD",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "delivered",
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000),
    estimatedDeliveryTime: new Date(Date.now() - 19 * 60 * 60 * 1000),
    actualDeliveryTime: new Date(Date.now() - 19 * 60 * 60 * 1000),
    rating: 4,
    review: "Good quality biryani",
  },
  {
    id: "ORD-003",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "4", menuItemId: "2", restaurantId: "anand", quantity: 3, specialInstructions: "Less spicy" },
    ],
    totalPrice: 840,
    deliveryFee: 40,
    tax: 120,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "CARD",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "delivered",
    createdAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
    estimatedDeliveryTime: new Date(Date.now() - 17 * 60 * 60 * 1000),
    actualDeliveryTime: new Date(Date.now() - 17 * 60 * 60 * 1000),
    rating: 5,
    review: "Fresh and delicious paneer tikka",
  },
  {
    id: "ORD-004",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "5", menuItemId: "1", restaurantId: "anand", quantity: 1, specialInstructions: "" },
      { id: "6", menuItemId: "5", restaurantId: "anand", quantity: 2, specialInstructions: "" },
    ],
    totalPrice: 590,
    deliveryFee: 40,
    tax: 85,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "UPI",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "out_for_delivery",
    createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
    estimatedDeliveryTime: new Date(Date.now() + 30 * 60 * 1000),
    actualDeliveryTime: null,
    rating: null,
    review: null,
  },
  {
    id: "ORD-005",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "7", menuItemId: "4", restaurantId: "anand", quantity: 2, specialInstructions: "Extra garlic" },
    ],
    totalPrice: 160,
    deliveryFee: 40,
    tax: 24,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "COD",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "ready",
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
    actualDeliveryTime: null,
    rating: null,
    review: null,
  },
  {
    id: "ORD-006",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "8", menuItemId: "2", restaurantId: "anand", quantity: 2, specialInstructions: "" },
    ],
    totalPrice: 560,
    deliveryFee: 40,
    tax: 80,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "CARD",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "preparing",
    createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60 * 1000),
    actualDeliveryTime: null,
    rating: null,
    review: null,
  },
  {
    id: "ORD-007",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "9", menuItemId: "3", restaurantId: "anand", quantity: 1, specialInstructions: "" },
      { id: "10", menuItemId: "4", restaurantId: "anand", quantity: 1, specialInstructions: "" },
    ],
    totalPrice: 400,
    deliveryFee: 40,
    tax: 60,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "UPI",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "pending",
    createdAt: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    estimatedDeliveryTime: new Date(Date.now() + 50 * 60 * 1000),
    actualDeliveryTime: null,
    rating: null,
    review: null,
  },
  {
    id: "ORD-008",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "11", menuItemId: "1", restaurantId: "anand", quantity: 1, specialInstructions: "Less salt" },
    ],
    totalPrice: 350,
    deliveryFee: 40,
    tax: 50,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "COD",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "cancelled",
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
    estimatedDeliveryTime: new Date(Date.now() - 11 * 60 * 60 * 1000),
    actualDeliveryTime: null,
    rating: null,
    review: null,
  },
  {
    id: "ORD-009",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "12", menuItemId: "5", restaurantId: "anand", quantity: 3, specialInstructions: "" },
    ],
    totalPrice: 360,
    deliveryFee: 40,
    tax: 54,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "CARD",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "delivered",
    createdAt: new Date(Date.now() - 15 * 60 * 60 * 1000),
    estimatedDeliveryTime: new Date(Date.now() - 14 * 60 * 60 * 1000),
    actualDeliveryTime: new Date(Date.now() - 14 * 60 * 60 * 1000),
    rating: 4,
    review: "Fresh mango lassi",
  },
  {
    id: "ORD-010",
    customerId: "user1",
    restaurantId: "anand",
    items: [
      { id: "13", menuItemId: "2", restaurantId: "anand", quantity: 1, specialInstructions: "" },
    ],
    totalPrice: 280,
    deliveryFee: 40,
    tax: 40,
    appliedCoupon: null,
    discount: 0,
    paymentMethod: "UPI",
    deliveryAddress: mockUsers[0].addresses[0],
    orderStatus: "delivered",
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
    estimatedDeliveryTime: new Date(Date.now() - 7 * 60 * 60 * 1000),
    actualDeliveryTime: new Date(Date.now() - 7 * 60 * 60 * 1000),
    rating: 5,
    review: "Amazing paneer tikka!",
  },
];
