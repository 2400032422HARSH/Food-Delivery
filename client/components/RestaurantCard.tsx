import { Link } from "react-router-dom";
import { Star, Clock, Truck, Tag } from "lucide-react";
import type { Restaurant } from "@shared/data";

interface RestaurantCardProps {
  restaurant: Restaurant;
  variant?: "grid" | "compact";
}

export default function RestaurantCard({ restaurant, variant = "grid" }: RestaurantCardProps) {
  if (variant === "compact") {
    return (
      <Link to={`/restaurant/${restaurant.id}`}>
        <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
          <div className="relative h-32 overflow-hidden bg-gray-200">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div className="absolute top-2 right-2 bg-white rounded-full px-2 py-1 flex items-center gap-1 shadow-sm">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-semibold text-gray-800">{restaurant.rating}</span>
            </div>
          </div>
          <div className="p-3">
            <h3 className="font-semibold text-gray-900 text-sm truncate">{restaurant.name}</h3>
            <p className="text-xs text-gray-500 truncate">{restaurant.cuisine.join(", ")}</p>
            <div className="flex items-center gap-2 mt-2 text-xs text-gray-600">
              <Clock className="w-3 h-3" />
              <span>{restaurant.deliveryTime} min</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link to={`/restaurant/${restaurant.id}`}>
      <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
        {/* Image Section */}
        <div className="relative h-48 overflow-hidden bg-gray-200">
          <img
            src={restaurant.image}
            alt={restaurant.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {restaurant.offers.length > 0 && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
              <Tag className="w-3 h-3" />
              {restaurant.offers[0].split(" ")[0]}% off
            </div>
          )}
          <div className="absolute top-3 right-3 bg-white rounded-full px-3 py-1 flex items-center gap-1 shadow-md">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="font-semibold text-gray-900">{restaurant.rating}</span>
            <span className="text-xs text-gray-500">({restaurant.reviews})</span>
          </div>
        </div>

        {/* Info Section */}
        <div className="p-4">
          <h3 className="text-lg font-bold text-gray-900 mb-1">{restaurant.name}</h3>
          <p className="text-sm text-gray-600 mb-3">{restaurant.cuisine.join(", ")}</p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <span>{restaurant.deliveryTime} mins</span>
            </div>
            <div className="flex items-center gap-1">
              <Truck className="w-4 h-4 text-gray-400" />
              <span>₹{restaurant.deliveryFee}</span>
            </div>
            <span className="text-xs text-gray-500">{restaurant.distance} km away</span>
          </div>

          {/* Min Order */}
          <p className="text-xs text-gray-500">Min order ₹{restaurant.minOrder}</p>
        </div>
      </div>
    </Link>
  );
}
