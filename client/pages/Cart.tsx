import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  cartApi,
  orderApi,
  restaurantApi,
  couponApi,
  addressApi,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Minus, Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface CartItem {
  menuItemId: string;
  restaurantId: string;
  quantity: number;
  price: number;
  specialInstructions: string;
}

interface Address {
  id: string;
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

export default function Cart() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [restaurantData, setRestaurantData] = useState<any>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "CARD" | "UPI">(
    "COD",
  );
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: "home" as const,
    name: "",
    mobile: "",
    house: "",
    street: "",
    landmark: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    loadCart();
    loadAddresses();
  }, [user, navigate]);

  const loadCart = async () => {
    try {
      const items = await cartApi.getCart();
      setCartItems(items);

      if (items.length > 0) {
        const restaurant = await restaurantApi.getById(items[0].restaurantId);
        setRestaurantData(restaurant);
      }
    } catch (error) {
      console.error("Failed to load cart", error);
    } finally {
      setLoading(false);
    }
  };

  const loadAddresses = async () => {
    try {
      const addrs = await addressApi.getAll();
      setAddresses(addrs);
      const defaultAddr = addrs.find((a) => a.isDefault);
      if (defaultAddr) {
        setSelectedAddress(defaultAddr);
      }
    } catch (error) {
      console.error("Failed to load addresses", error);
    }
  };

  const updateQuantity = async (menuItemId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        const updated = await cartApi.removeItem(menuItemId);
        setCartItems(updated);
      } else {
        const updated = await cartApi.updateItem(menuItemId, quantity);
        setCartItems(updated);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update cart",
        variant: "destructive",
      });
    }
  };

  const removeItem = async (menuItemId: string) => {
    try {
      const updated = await cartApi.removeItem(menuItemId);
      setCartItems(updated);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove item",
        variant: "destructive",
      });
    }
  };

  const applyCoupon = async () => {
    try {
      const result = await couponApi.validate(couponCode, subtotal);
      setDiscount(result.discount);
      toast({
        title: "Success",
        description: `Coupon applied! You saved ₹${result.discount}`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Invalid coupon",
        variant: "destructive",
      });
    }
  };

  const addNewAddress = async () => {
    try {
      const addr = await addressApi.add(newAddress);
      setAddresses([...addresses, addr]);
      setSelectedAddress(addr);
      setShowAddressForm(false);
      setNewAddress({
        type: "home",
        name: "",
        mobile: "",
        house: "",
        street: "",
        landmark: "",
        city: "",
        pincode: "",
      });
      toast({
        title: "Success",
        description: "Address added",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add address",
        variant: "destructive",
      });
    }
  };

  const placeOrder = async () => {
    if (!selectedAddress) {
      toast({
        title: "Error",
        description: "Please select a delivery address",
        variant: "destructive",
      });
      return;
    }

    if (cartItems.length === 0) {
      toast({
        title: "Error",
        description: "Your cart is empty",
        variant: "destructive",
      });
      return;
    }

    setPlacing(true);
    try {
      const order = await orderApi.create({
        restaurantId: restaurantData.id,
        items: cartItems,
        totalPrice: total,
        deliveryFee: 40,
        tax: tax,
        discount: discount,
        paymentMethod: paymentMethod,
        deliveryAddress: selectedAddress,
      });

      await cartApi.clear();
      toast({
        title: "Success",
        description: "Order placed! Tracking it now...",
      });

      navigate(`/orders`);
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to place order",
        variant: "destructive",
      });
    } finally {
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container px-4">
          <div className="bg-white rounded-lg p-12 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Your cart is empty
            </h1>
            <p className="text-gray-600 mb-8">
              Add some delicious food to get started!
            </p>
            <Button
              onClick={() => navigate("/")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Browse Restaurants
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const tax = Math.round(subtotal * 0.05);
  const deliveryFee = 40;
  const total = subtotal + tax + deliveryFee - discount;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {/* Restaurant Info */}
            {restaurantData && (
              <Card>
                <CardContent className="p-4 flex items-center gap-4">
                  <img
                    src={restaurantData.image}
                    alt={restaurantData.name}
                    className="w-16 h-16 rounded-lg object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{restaurantData.name}</h3>
                    <p className="text-sm text-gray-600">
                      {restaurantData.cuisines.join(", ")}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Items List */}
            <Card>
              <CardHeader>
                <CardTitle>Items ({cartItems.length})</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex items-center justify-between pb-4 border-b last:border-b-0"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900">
                        {item.menuItemId}
                      </p>
                      <p className="text-sm text-gray-500">₹{item.price}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity - 1)
                        }
                      >
                        <Minus className="w-4 h-4" />
                      </Button>
                      <span className="w-8 text-center font-semibold">
                        {item.quantity}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          updateQuantity(item.menuItemId, item.quantity + 1)
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="text-right min-w-24">
                      <p className="font-semibold text-gray-900">
                        ₹{(item.price * item.quantity).toLocaleString()}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(item.menuItemId)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Coupon Section */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Apply Coupon</CardTitle>
              </CardHeader>
              <CardContent className="flex gap-2">
                <Input
                  placeholder="Enter coupon code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={discount > 0}
                />
                <Button
                  onClick={applyCoupon}
                  disabled={!couponCode || discount > 0}
                  className="bg-orange-600 hover:bg-orange-700"
                >
                  Apply
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Checkout Sidebar */}
          <div className="space-y-6">
            {/* Address Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {addresses.length > 0 ? (
                  <div className="space-y-2">
                    {addresses.map((addr) => (
                      <label
                        key={addr.id}
                        className="flex items-start gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                      >
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddress?.id === addr.id}
                          onChange={() => setSelectedAddress(addr)}
                          className="mt-1"
                        />
                        <div className="text-sm">
                          <p className="font-semibold text-gray-900">
                            {addr.name}
                          </p>
                          <p className="text-gray-600">
                            {addr.house}, {addr.street}, {addr.city}{" "}
                            {addr.pincode}
                          </p>
                          {addr.landmark && (
                            <p className="text-xs text-gray-500">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No saved addresses. Add one below.
                    </AlertDescription>
                  </Alert>
                )}

                {showAddressForm ? (
                  <div className="space-y-3 border-t pt-4">
                    <input
                      type="text"
                      placeholder="Address Name"
                      value={newAddress.name}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="tel"
                      placeholder="Phone"
                      value={newAddress.mobile}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, mobile: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="House/Flat"
                      value={newAddress.house}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, house: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Street"
                      value={newAddress.street}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, street: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Landmark (optional)"
                      value={newAddress.landmark}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          landmark: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="City"
                      value={newAddress.city}
                      onChange={(e) =>
                        setNewAddress({ ...newAddress, city: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <input
                      type="text"
                      placeholder="Pincode"
                      value={newAddress.pincode}
                      onChange={(e) =>
                        setNewAddress({
                          ...newAddress,
                          pincode: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 border rounded-lg text-sm"
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={addNewAddress}
                        className="flex-1 bg-orange-600 hover:bg-orange-700"
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowAddressForm(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setShowAddressForm(true)}
                    className="w-full"
                  >
                    + Add Address
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Payment Method</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(["COD", "CARD", "UPI"] as const).map((method) => (
                  <label
                    key={method}
                    className="flex items-center gap-3 p-2 rounded hover:bg-gray-50 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="payment"
                      checked={paymentMethod === method}
                      onChange={() => setPaymentMethod(method)}
                    />
                    <span className="text-sm font-medium">
                      {method === "COD"
                        ? "Cash on Delivery"
                        : method === "CARD"
                          ? "Card/Debit"
                          : "UPI"}
                    </span>
                  </label>
                ))}
              </CardContent>
            </Card>

            {/* Price Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">
                    ₹{subtotal.toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (5%)</span>
                  <span className="font-medium">₹{tax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">₹{deliveryFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-₹{discount}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-lg text-orange-600">
                    ₹{total.toLocaleString()}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button
              onClick={placeOrder}
              disabled={!selectedAddress || placing}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white py-6 text-base font-semibold"
            >
              {placing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Placing Order...
                </>
              ) : (
                "Place Order"
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
