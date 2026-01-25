import { useState } from "react";
import { MapPin, Search, Filter, X } from "lucide-react";
import RestaurantCard from "@/components/RestaurantCard";
import { mockRestaurants } from "@shared/data";

export default function SearchRestaurants() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCuisines, setSelectedCuisines] = useState<string[]>([]);
  const [minRating, setMinRating] = useState(0);
  const [priceRange, setPriceRange] = useState("all");
  const [deliveryTime, setDeliveryTime] = useState("all");
  const [showFilters, setShowFilters] = useState(true);

  // Get unique cuisines
  const allCuisines = Array.from(
    new Set(mockRestaurants.flatMap((r) => r.cuisine))
  ).sort();

  // Filter restaurants
  const filteredRestaurants = mockRestaurants.filter((restaurant) => {
    // Search query
    if (
      searchQuery &&
      !restaurant.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !restaurant.cuisine.some((c) => c.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }

    // Cuisines
    if (selectedCuisines.length > 0) {
      if (!selectedCuisines.some((c) => restaurant.cuisine.includes(c))) {
        return false;
      }
    }

    // Rating
    if (restaurant.rating < minRating) {
      return false;
    }

    // Price Range (based on minOrder)
    if (priceRange !== "all") {
      if (priceRange === "low" && restaurant.minOrder > 300) return false;
      if (priceRange === "mid" && (restaurant.minOrder < 300 || restaurant.minOrder > 600)) return false;
      if (priceRange === "high" && restaurant.minOrder < 600) return false;
    }

    // Delivery Time
    if (deliveryTime !== "all") {
      if (deliveryTime === "fast" && restaurant.deliveryTime > 30) return false;
      if (deliveryTime === "medium" && (restaurant.deliveryTime < 30 || restaurant.deliveryTime > 45)) return false;
      if (deliveryTime === "slow" && restaurant.deliveryTime < 45) return false;
    }

    return true;
  });

  const toggleCuisine = (cuisine: string) => {
    setSelectedCuisines((prev) =>
      prev.includes(cuisine) ? prev.filter((c) => c !== cuisine) : [...prev, cuisine]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCuisines([]);
    setMinRating(0);
    setPriceRange("all");
    setDeliveryTime("all");
  };

  const hasActiveFilters =
    searchQuery || selectedCuisines.length > 0 || minRating > 0 || priceRange !== "all" || deliveryTime !== "all";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="container px-4 py-4">
          <div className="flex items-center gap-2 bg-gray-100 rounded-lg px-4 py-3">
            <Search className="w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search restaurants, cuisines, or dishes"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
            />
          </div>
        </div>
      </div>

      <div className="container px-4 py-8">
        <div className="flex gap-6">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-28">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-900">Filters</h3>
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="text-xs text-primary hover:underline font-semibold"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Rating Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Rating</h4>
                <div className="space-y-2">
                  {[0, 3.5, 4, 4.5].map((rating) => (
                    <label key={rating} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="rating"
                        value={rating}
                        checked={minRating === rating}
                        onChange={() => setMinRating(rating)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-gray-600">
                        {rating === 0 ? "All ratings" : `${rating}+ stars`}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Price Range</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All prices" },
                    { value: "low", label: "Budget (₹150-300)" },
                    { value: "mid", label: "Moderate (₹300-600)" },
                    { value: "high", label: "Premium (₹600+)" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="price"
                        value={option.value}
                        checked={priceRange === option.value}
                        onChange={() => setPriceRange(option.value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-gray-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Delivery Time Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Delivery Time</h4>
                <div className="space-y-2">
                  {[
                    { value: "all", label: "All times" },
                    { value: "fast", label: "Under 30 mins" },
                    { value: "medium", label: "30-45 mins" },
                    { value: "slow", label: "45+ mins" },
                  ].map((option) => (
                    <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="delivery"
                        value={option.value}
                        checked={deliveryTime === option.value}
                        onChange={() => setDeliveryTime(option.value)}
                        className="w-4 h-4 accent-primary"
                      />
                      <span className="text-sm text-gray-600">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Cuisines Filter */}
              <div>
                <h4 className="font-semibold text-gray-900 mb-3 text-sm">Cuisines</h4>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {allCuisines.map((cuisine) => (
                    <label key={cuisine} className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedCuisines.includes(cuisine)}
                        onChange={() => toggleCuisine(cuisine)}
                        className="w-4 h-4 accent-primary rounded"
                      />
                      <span className="text-sm text-gray-600">{cuisine}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2 flex items-center gap-2 text-gray-900 font-semibold hover:bg-gray-50 transition-colors"
              >
                <Filter className="w-4 h-4" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </button>

              {showFilters && (
                <div className="bg-white rounded-lg p-4 mt-4 space-y-4">
                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="w-full text-primary font-semibold text-sm hover:underline"
                    >
                      Clear All Filters
                    </button>
                  )}

                  {/* Mobile Cuisine Filter */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2 text-sm">Cuisines</h4>
                    <div className="flex flex-wrap gap-2">
                      {allCuisines.map((cuisine) => (
                        <button
                          key={cuisine}
                          onClick={() => toggleCuisine(cuisine)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors ${
                            selectedCuisines.includes(cuisine)
                              ? "bg-primary text-white"
                              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                          }`}
                        >
                          {cuisine}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results */}
            <div>
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900">
                  {filteredRestaurants.length} restaurants found
                </h2>
                <p className="text-gray-600 text-sm mt-1">
                  {searchQuery && `Showing results for "${searchQuery}"`}
                </p>
              </div>

              {filteredRestaurants.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map((restaurant) => (
                    <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                  ))}
                </div>
              ) : (
                <div className="bg-white rounded-lg p-12 text-center">
                  <p className="text-gray-600 text-lg mb-2">No restaurants found</p>
                  <p className="text-gray-500 text-sm">Try adjusting your filters or search query</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
