import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  Store, 
  MapPin, 
  Star, 
  Clock, 
  ChevronRight,
  Search,
  Filter,
  Sparkles
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const BASE_URL = "https://digidishbackend-production.up.railway.app";

export default function RestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchRestaurants = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res.data.data.restaurants);
      } catch (err) {
        toast.error("Unable to load restaurants");
      } finally {
        setLoading(false);
      }
    };
    fetchRestaurants();
  }, []);

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div className="mb-10 text-center">
        <div className="inline-flex items-center gap-2 bg-orange-100 rounded-full px-4 py-1.5 mb-4">
          <Sparkles className="w-4 h-4 text-orange-600" />
          <span className="text-sm font-medium text-orange-600">Hungry? Order now</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
          Discover the best <span className="text-orange-500">restaurants</span>
        </h1>
        <p className="text-gray-500 max-w-md mx-auto">
          Hand-picked restaurants with the highest ratings
        </p>
      </div>

      
      <div className="max-w-md mx-auto mb-10">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search by restaurant name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent shadow-sm transition-all"
          />
        </div>
      </div>

      {filteredRestaurants.length === 0 ? (
        <div className="text-center py-20">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Store className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 text-lg">No restaurants found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredRestaurants.map((restaurant, index) => (
            <Link
              key={restaurant._id}
              to={`/restaurants/${restaurant._id}/menu`}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
            >
              
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {restaurant.image ? (
                  <img
                    src={`${BASE_URL}${restaurant.image}`}
                    alt={restaurant.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Store className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
                  </div>
                )}

                <div className="absolute top-3 right-3">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-semibold backdrop-blur-sm ${
                    restaurant.status === "Active" 
                      ? "bg-emerald-500 text-white shadow-sm" 
                      : "bg-gray-500 text-white"
                  }`}>
                    {restaurant.status === "Active" ? "Open" : "Closed"}
                  </span>
                </div>

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </div>

              <div className="p-5">
                <h2 className="font-bold text-gray-900 text-lg mb-1 group-hover:text-orange-500 transition-colors line-clamp-1">
                  {restaurant.name}
                </h2>
                <div className="flex items-center gap-1 text-sm text-gray-500 mb-3">
                  <MapPin className="w-3.5 h-3.5" strokeWidth={1.5} />
                  <span className="line-clamp-1">{restaurant.address}</span>
                </div>
                
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                      <span className="text-sm font-medium text-gray-700">4.8</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-xs text-gray-400">20-30 min</span>
                    </div>
                  </div>
                  <div className="text-orange-500 opacity-0 group-hover:opacity-100 transition-all duration-200 transform translate-x-0 group-hover:translate-x-0">
                    <ChevronRight className="w-4 h-4" strokeWidth={2} />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
