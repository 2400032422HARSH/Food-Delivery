import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { restaurantApi } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Star, MapPin, Clock, Search, Loader2 } from "lucide-react";
import { motion, useMotionValue, useTransform, Variants } from "framer-motion";

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

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 15 }
  },
};


function RestaurantCard({ restaurant }: { restaurant: Restaurant }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // 3D Tilt effect
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement, MouseEvent>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    x.set(event.clientX - centerX);
    y.set(event.clientY - centerY);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      variants={itemVariants}
      className="perspective-1000 h-full"
    >
      <Link to={`/restaurant/${restaurant.id}`} className="block h-full cursor-pointer">
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          whileHover={{ scale: 1.05, z: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="h-full"
        >
          <Card className="h-full overflow-hidden glass border-0 bg-white/80 dark:bg-gray-900/80 transition-all duration-300 hover:shadow-[0_20px_40px_rgba(2ea,88,12,0.15)] group relative">
            {/* Restaurant Image */}
            <div className="relative h-56 overflow-hidden bg-gray-200" style={{ transform: "translateZ(30px)" }}>
              <motion.img
                src={restaurant.image}
                alt={restaurant.name}
                className="w-full h-full object-cover"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.4 }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              {!restaurant.isOpen && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-white font-bold text-lg tracking-wider px-4 py-2 border-2 border-white/50 rounded-lg transform -rotate-12 glass">
                    CLOSED
                  </span>
                </div>
              )}
              
              {/* Badge */}
              <div className="absolute top-4 right-4 glass px-3 py-1.5 rounded-full flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-orange-400 text-orange-400" />
                <span className="font-bold text-white text-sm">{restaurant.rating}</span>
                <span className="text-xs text-white/80">({restaurant.reviews})</span>
              </div>
            </div>

            <CardContent className="p-6 relative" style={{ transform: "translateZ(40px)" }}>
              <motion.div 
                initial={false}
                className="absolute -top-6 right-6 w-12 h-12 glass rounded-full flex items-center justify-center shadow-lg border border-white/20 bg-white/90"
              >
                <Clock className="w-5 h-5 text-orange-600" />
              </motion.div>
              
              {/* Restaurant Name */}
              <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-1 group-hover:text-orange-600 transition-colors">
                {restaurant.name}
              </h3>

              {/* Cuisines */}
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-4 line-clamp-1">
                {restaurant.cuisines.join(", ")}
              </p>

              {/* Stats Row */}
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <Clock className="w-4 h-4 text-orange-500" />
                  <span className="text-sm font-medium">{restaurant.deliveryTime} mins</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span className="text-sm font-bold text-orange-600">₹{restaurant.deliveryFee}</span>
                  <span className="text-xs uppercase tracking-wider">Delivery</span>
                </div>
              </div>

              {/* Order Button */}
              <motion.div whileTap={{ scale: 0.95 }}>
                <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-md shadow-orange-500/20 group-hover:shadow-orange-500/40 border-0 transition-all rounded-xl h-11 font-semibold text-base" size="default">
                  Order Now
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    </motion.div>
  );
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], rotate: [0, 180, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-24 h-24"
        >
          <div className="absolute inset-0 rounded-full border-t-4 border-orange-500 opacity-75"></div>
          <div className="absolute inset-2 rounded-full border-r-4 border-orange-400 opacity-50"></div>
          <Loader2 className="absolute inset-0 m-auto w-10 h-10 text-orange-600 animate-spin" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-neutral-950 overflow-hidden relative">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-full h-[600px] overflow-hidden -z-10 pointer-events-none">
        <motion.div 
          animate={{ x: [0, 50, 0], y: [0, 30, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[80%] rounded-full bg-orange-400/20 blur-[120px]"
        />
        <motion.div 
          animate={{ x: [0, -50, 0], y: [0, -40, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute top-[10%] -right-[10%] w-[60%] h-[70%] rounded-full bg-red-400/15 blur-[120px]"
        />
      </div>

      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative pt-20 pb-16 px-4"
      >
        <div className="container mx-auto text-center max-w-4xl relative z-10">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
            className="inline-block mb-4 px-4 py-1.5 rounded-full glass-panel border border-orange-500/20 text-orange-600 dark:text-orange-400 font-semibold text-sm shadow-lg shadow-orange-500/10"
          >
            🔥 The Best Food in Town
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 pb-2">
            Harsh Anand <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-500 text-glow">
              Food Delivery
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto font-medium">
            Elevate your dining experience with premium meals delivered directly to your door.
          </p>

          {/* Search Bar */}
          <motion.div 
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            className="max-w-2xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"></div>
            <div className="relative glass-panel rounded-2xl p-2 flex items-center gap-2 shadow-2xl border border-white/40 dark:border-white/10">
              <div className="pl-4 text-gray-400">
                <Search className="w-6 h-6" />
              </div>
              <Input
                type="text"
                placeholder="Search premium restaurants or cuisines..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 shadow-none focus-visible:ring-0 text-lg py-6 placeholder:text-gray-400 font-medium"
              />
              <Button className="hidden sm:flex bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl px-8 py-6 text-lg font-bold shadow-lg transition-transform hover:scale-105 active:scale-95">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Filters Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="sticky top-0 z-40 py-4 glass border-y border-white/20 shadow-md"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-center sm:justify-start">
            <span className="text-sm font-bold text-gray-800 dark:text-gray-200 uppercase tracking-widest hidden sm:block">Filters</span>

            {/* Cuisine Filter */}
            <div className="relative">
              <select
                value={filterCuisine}
                onChange={(e) => setFilterCuisine(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-200 cursor-pointer shadow-sm hover:bg-white/80 transition-colors"
              >
                <option value="">All Cuisines</option>
                {allCuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                ▼
              </div>
            </div>

            {/* Rating Filter */}
            <div className="relative">
              <select
                value={filterRating}
                onChange={(e) => setFilterRating(Number(e.target.value))}
                className="appearance-none pl-4 pr-10 py-2.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-gray-200 dark:border-gray-800 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 dark:text-gray-200 cursor-pointer shadow-sm hover:bg-white/80 transition-colors"
              >
                <option value={0}>All Ratings</option>
                <option value={4}>4.0+ Stars</option>
                <option value={4.5}>4.5+ Stars</option>
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                ▼
              </div>
            </div>

            <motion.div 
              initial={false}
              animate={{ opacity: (filterCuisine || filterRating > 0 || searchQuery) ? 1 : 0, scale: (filterCuisine || filterRating > 0 || searchQuery) ? 1 : 0.8 }}
            >
              {(filterCuisine || filterRating > 0 || searchQuery) && (
                <Button
                  variant="ghost"
                  className="rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 font-semibold px-6"
                  onClick={() => {
                    setFilterCuisine("");
                    setFilterRating(0);
                    setSearchQuery("");
                  }}
                >
                  Clear Filters
                </Button>
              )}
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Restaurants Grid */}
      <div className="container mx-auto px-4 py-16 relative z-10">
        {filteredRestaurants.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-24 glass-panel rounded-3xl max-w-lg mx-auto"
          >
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="text-gray-400 mb-6 drop-shadow-xl"
            >
              <MapPin className="w-24 h-24 mx-auto opacity-50 text-orange-500" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-3">
              No culinary matches found
            </h3>
            <p className="text-gray-500 text-lg">
              Try adjusting your search or filters to discover amazing food.
            </p>
            <Button 
              className="mt-8 bg-black dark:bg-white text-white dark:text-black rounded-xl px-8 hover:scale-105 transition-transform"
              onClick={() => {
                setFilterCuisine("");
                setFilterRating(0);
                setSearchQuery("");
              }}
            >
              Explore All Restaurants
            </Button>
          </motion.div>
        ) : (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredRestaurants.map((restaurant) => (
              <RestaurantCard key={restaurant.id} restaurant={restaurant} />
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}

