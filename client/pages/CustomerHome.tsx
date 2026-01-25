import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { restaurantApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Clock, TrendingDown, Loader2 } from "lucide-react";

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
}

export default function CustomerHome() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCuisine, setFilterCuisine] = useState("");
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants = async () => {
    try {
      const data = await restaurantApi.getAll();
      setRestaurants(data);
    } catch (error) {
      console.error("Failed to load restaurants", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredRestaurants = restaurants.filter((r) => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.cuisines.some((c) =>
        c.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCuisine = !filterCuisine || r.cuisines.includes(filterCuisine);
    const matchesRating = r.rating >= filterRating;

    return matchesSearch && matchesCuisine && matchesRating;
  });

  const allCuisines = Array.from(
    new Set(restaurants.flatMap((r) => r.cuisines)),
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-orange-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white py-12 px-4">
        <div className="container">
          <h1 className="text-4xl font-bold mb-2">Harsh Anand Food Delivery</h1>
          <p className="text-orange-100 mb-6">
            Order from your favorite restaurants
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl">
            <Input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-white border-b border-gray-200 sticky top-20 z-40">
        <div className="container px-4 py-4">
          <div className="flex flex-wrap gap-3 items-center">
            <span className="text-sm font-semibold text-gray-700">Filter:</span>

            {/* Cuisine Filter */}
            <select
              value={filterCuisine}
              onChange={(e) => setFilterCuisine(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">All Cuisines</option>
              {allCuisines.map((cuisine) => (
                <option key={cuisine} value={cuisine}>
                  {cuisine}
                </option>
              ))}
            </select>

            {/* Rating Filter */}
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(Number(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value={0}>All Ratings</option>
              <option value={4}>4.0+</option>
              <option value={4.5}>4.5+</option>
            </select>

            {(filterCuisine || filterRating > 0 || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setFilterCuisine("");
                  setFilterRating(0);
                  setSearchQuery("");
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className="container px-4 py-8">
        {filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <MapPin className="w-16 h-16 mx-auto opacity-50" />
            </div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No restaurants found
            </h3>
            <p className="text-gray-500">
              Try adjusting your search or filters
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="group"
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
                  {/* Restaurant Image */}
                  <div className="relative h-48 overflow-hidden bg-gray-200">
                    <img
                      src={restaurant.image}
                      alt={restaurant.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                    {!restaurant.isOpen && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-semibold">Closed</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    {/* Restaurant Name */}
                    <h3 className="font-bold text-lg text-gray-900 mb-1">
                      {restaurant.name}
                    </h3>

                    {/* Cuisines */}
                    <p className="text-sm text-gray-600 mb-3">
                      {restaurant.cuisines.join(", ")}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-200">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                        <span className="font-semibold text-sm">
                          {restaurant.rating}
                        </span>
                        <span className="text-xs text-gray-500">
                          ({restaurant.reviews})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 text-gray-600">
                        <Clock className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          {restaurant.deliveryTime} min
                        </span>
                      </div>
                    </div>

                    {/* Meta Info */}
                    <div className="space-y-1 text-xs text-gray-600 mb-3">
                      <div className="flex items-center justify-between">
                        <span>Min. Order:</span>
                        <span className="font-medium">
                          ₹{restaurant.minOrder}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Delivery Fee:</span>
                        <span className="font-medium">
                          ₹{restaurant.deliveryFee}
                        </span>
                      </div>
                    </div>

                    {/* Order Button */}
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      size="sm"
                    >
                      Order Now
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
