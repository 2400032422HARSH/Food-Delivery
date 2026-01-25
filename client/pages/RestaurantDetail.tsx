import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { restaurantApi, cartApi } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Star,
  Clock,
  MapPin,
  Loader2,
  ShoppingCart,
  Plus,
  Minus,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  image: string;
  preparationTime: number;
}

interface Restaurant {
  id: string;
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
  offers: string[];
  menu: MenuItem[];
}

export default function RestaurantDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!id) return;
    loadRestaurant();
  }, [id]);

  const loadRestaurant = async () => {
    try {
      const data = await restaurantApi.getById(id!);
      setRestaurant(data);
      if (data.menu.length > 0) {
        const firstCategory = Array.from(
          new Set(data.menu.map((m: MenuItem) => m.category)),
        )[0];
        setSelectedCategory(firstCategory as string);
      }
    } catch (error) {
      console.error("Failed to load restaurant", error);
      toast({
        title: "Error",
        description: "Failed to load restaurant details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (item: MenuItem) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to login to add items to cart",
      });
      navigate("/login");
      return;
    }

    const quantity = quantities[item.id] || 1;

    try {
      await cartApi.addItem({
        menuItemId: item.id,
        restaurantId: restaurant!.id,
        quantity,
        price: item.price,
        specialInstructions: "",
      });

      toast({
        title: "Added to cart",
        description: `${item.name} x${quantity} added`,
      });

      setQuantities({ ...quantities, [item.id]: 0 });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add item to cart",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-orange-600 animate-spin" />
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="text-gray-600 mb-4">Restaurant not found</p>
            <Button
              onClick={() => navigate("/")}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Go Back
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const categories = Array.from(
    new Set(restaurant.menu.map((m) => m.category)),
  );
  const itemsInCategory = restaurant.menu.filter(
    (m) => m.category === selectedCategory,
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Restaurant Header */}
      <div className="sticky top-20 z-30 bg-white border-b">
        <div className="container px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {restaurant.name}
              </h1>
              <p className="text-sm text-gray-600">
                {restaurant.cuisines.join(", ")}
              </p>
            </div>
            <Button
              onClick={() => navigate("/cart")}
              className="bg-orange-600 hover:bg-orange-700 gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Cart
            </Button>
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Restaurant Image */}
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-80 object-cover rounded-lg shadow-md mb-6"
            />

            {/* Restaurant Info */}
            <div className="grid grid-cols-3 gap-4 mb-8 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                  <span className="font-bold text-lg">{restaurant.rating}</span>
                </div>
                <p className="text-xs text-gray-500">
                  ({restaurant.reviews} reviews)
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  <Clock className="w-4 h-4 text-gray-600" />
                  <span className="font-bold">
                    {restaurant.deliveryTime} min
                  </span>
                </div>
                <p className="text-xs text-gray-500">Delivery time</p>
              </div>
              <div>
                <div className="font-bold mb-1">₹{restaurant.deliveryFee}</div>
                <p className="text-xs text-gray-500">Delivery fee</p>
              </div>
            </div>

            {/* Offers */}
            {restaurant.offers.length > 0 && (
              <div className="mb-8 bg-orange-50 p-4 rounded-lg border border-orange-200">
                <h3 className="font-bold text-gray-900 mb-3">Special Offers</h3>
                <div className="space-y-2">
                  {restaurant.offers.map((offer, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="text-orange-600 font-bold">•</span>
                      <span className="text-sm text-gray-700">{offer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Restaurant Details */}
            <div className="grid grid-cols-2 gap-4 mb-8 bg-white p-6 rounded-lg shadow-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Opening Hours</p>
                <p className="font-semibold text-gray-900">
                  {restaurant.isOpen ? "Open" : "Closed"}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Delivery Address</p>
                <p className="font-semibold text-gray-900">{restaurant.city}</p>
              </div>
            </div>

            {/* Menu */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Menu</h2>

              {/* Category Tabs */}
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="mb-6"
              >
                <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0 border-b">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="rounded-none border-b-2 border-transparent data-[state=active]:border-orange-600 data-[state=active]:bg-transparent"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {categories.map((category) => (
                  <TabsContent key={category} value={category}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {restaurant.menu
                        .filter((m) => m.category === category)
                        .map((item) => (
                          <Card
                            key={item.id}
                            className="overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="flex">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-32 h-32 object-cover"
                              />
                              <CardContent className="flex-1 p-4 flex flex-col justify-between">
                                <div>
                                  <div className="flex items-start justify-between mb-2">
                                    <div className="flex-1">
                                      <h3 className="font-bold text-gray-900">
                                        {item.name}
                                      </h3>
                                      <div className="flex items-center gap-2 mb-1">
                                        {item.isVeg ? (
                                          <Badge className="bg-green-100 text-green-700 border-0">
                                            Veg
                                          </Badge>
                                        ) : (
                                          <Badge className="bg-red-100 text-red-700 border-0">
                                            Non-Veg
                                          </Badge>
                                        )}
                                      </div>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-600 line-clamp-2">
                                    {item.description}
                                  </p>
                                  <p className="text-lg font-bold text-orange-600 mt-2">
                                    ₹{item.price}
                                  </p>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                                  <span className="text-xs text-gray-500">
                                    {item.preparationTime} min
                                  </span>
                                  <div className="flex items-center gap-1">
                                    {quantities[item.id] > 0 ? (
                                      <div className="flex items-center gap-2">
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            setQuantities({
                                              ...quantities,
                                              [item.id]: Math.max(
                                                0,
                                                (quantities[item.id] || 0) - 1,
                                              ),
                                            })
                                          }
                                        >
                                          <Minus className="w-3 h-3" />
                                        </Button>
                                        <span className="w-6 text-center text-sm font-semibold">
                                          {quantities[item.id]}
                                        </span>
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          onClick={() =>
                                            setQuantities({
                                              ...quantities,
                                              [item.id]:
                                                (quantities[item.id] || 0) + 1,
                                            })
                                          }
                                        >
                                          <Plus className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    ) : (
                                      <Button
                                        size="sm"
                                        onClick={() => {
                                          setQuantities({
                                            ...quantities,
                                            [item.id]: 1,
                                          });
                                        }}
                                        className="bg-orange-600 hover:bg-orange-700"
                                      >
                                        Add
                                      </Button>
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </div>

                            {quantities[item.id] > 0 && (
                              <div className="bg-orange-50 border-t px-4 py-2">
                                <Button
                                  onClick={() => addToCart(item)}
                                  className="w-full bg-orange-600 hover:bg-orange-700 text-sm"
                                  size="sm"
                                >
                                  Add {quantities[item.id]} to Cart
                                </Button>
                              </div>
                            )}
                          </Card>
                        ))}
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-32">
              <CardContent className="p-6 space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                  <span className="text-sm font-medium">Open Now</span>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Min. Order</p>
                    <p className="font-bold text-gray-900">
                      ₹{restaurant.minOrder}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Delivery</p>
                    <p className="font-bold text-gray-900">
                      ₹{restaurant.deliveryFee} ({restaurant.deliveryTime} min)
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="text-sm text-gray-900">
                      {restaurant.address}
                    </p>
                  </div>
                </div>

                <Button
                  onClick={() => navigate("/cart")}
                  className="w-full bg-orange-600 hover:bg-orange-700 gap-2"
                  size="lg"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Go to Cart
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
