import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { 
  ArrowLeft, 
  MapPin, 
  Star, 
  Clock, 
  Plus,
  ShoppingBag,
  Filter,
  ChevronLeft,
  Info
} from "lucide-react";
import api from "../../services/api";
import useCart from "../../context/useCart";
import toast from "react-hot-toast";

const BASE_URL = "https://digidishbackend-production.up.railway.app";

export default function RestaurantMenu() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");
  const { addToCart, restaurantId } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [restRes, dishRes] = await Promise.all([
          api.get(`/restaurants/${id}`),
          api.get(`/dishes/restaurant/${id}`),
        ]);
        setRestaurant(restRes.data.data.restaurant);
        setDishes(dishRes.data.data.dishes);
      } catch {
        toast.error("Unable to load menu");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const categories = ["All", ...new Set(dishes.map((d) => d.category))];
  const filteredDishes = activeCategory === "All" ? dishes : dishes.filter((d) => d.category === activeCategory);

  const handleAddToCart = (dish) => {
    if (restaurantId && restaurantId !== id) {
      toast((t) => (
        <div className="bg-white rounded-xl shadow-xl p-4 max-w-sm">
          <p className="font-semibold text-gray-900 mb-2">Items from different restaurant</p>
          <p className="text-sm text-gray-500 mb-4">Adding this will clear your current cart</p>
          <div className="flex gap-3">
            <button
              onClick={() => {
                addToCart(dish, id);
                toast.dismiss(t.id);
              }}
              className="flex-1 bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Continue
            </button>
            <button
              onClick={() => toast.dismiss(t.id)}
              className="flex-1 border border-gray-200 hover:border-gray-300 px-4 py-2 rounded-lg text-sm font-medium transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ), { duration: 5000 });
      return;
    }
    addToCart(dish, id);
    toast.success(`${dish.name} added to cart`, {
      icon: '✅',
      style: {
        background: '#10b981',
        color: '#fff',
      },
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading menu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <button
        onClick={() => window.history.back()}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span>Back</span>
      </button>

      
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-8 mb-10 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full blur-3xl opacity-10"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-center gap-5">
            {restaurant?.image ? (
              <img
                src={`${BASE_URL}${restaurant.image}`}
                alt={restaurant?.name}
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
            ) : (
              <div className="w-20 h-20 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center border-4 border-white/30">
                <span className="text-3xl">🍽️</span>
              </div>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold mb-2">{restaurant?.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-orange-100">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                  <span>4.8 (500+ ratings)</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>25-35 min</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{restaurant?.address}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className="flex gap-3 overflow-x-auto pb-4 mb-8 scrollbar-hide">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activeCategory === cat
                ? "bg-gray-900 text-white shadow-md"
                : "bg-white border border-gray-200 text-gray-600 hover:border-orange-300 hover:shadow-sm"
            }`}
          >
            {cat === "All" ? "All Items" : cat}
          </button>
        ))}
      </div>

      
      {filteredDishes.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl shadow-sm">
          <Filter className="w-12 h-12 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-gray-500">No items in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish, index) => (
            <div
              key={dish._id}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 overflow-hidden"
            >
              
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {dish.image ? (
                  <img
                    src={`${BASE_URL}${dish.image}`}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-5xl">🍕</span>
                  </div>
                )}
                
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 bg-white/95 backdrop-blur text-gray-700 text-xs font-semibold rounded-lg shadow-sm">
                    {dish.category}
                  </span>
                </div>
                
                <div className="absolute bottom-3 left-3">
                  <span className="px-3 py-1.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-bold rounded-xl shadow-lg">
                    {dish.price.toFixed(2)} LE
                  </span>
                </div>
              </div>

              
              <div className="p-5">
                <h3 className="font-bold text-gray-900 text-lg mb-2 group-hover:text-orange-500 transition-colors">
                  {dish.name}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {dish.description || "Delicious dish made with fresh ingredients and authentic recipes."}
                </p>
                
                
                <button
                  onClick={() => handleAddToCart(dish)}
                  className="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl text-sm font-semibold transition-all duration-200 hover:shadow-md transform hover:scale-[1.02]"
                >
                  <Plus className="w-4 h-4" strokeWidth={2} />
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
