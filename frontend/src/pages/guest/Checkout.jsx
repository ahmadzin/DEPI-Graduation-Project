import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Truck, 
  Store, 
  Utensils,
  ArrowLeft,
  CreditCard,
  Shield,
  Clock,
  MapPin,
  CheckCircle,
  ChevronLeft
} from "lucide-react";
import api from "../../services/api";
import useCart from "../../context/useCart";
import useAuth from "../../context/useAuth";
import { io } from "socket.io-client";
import toast from "react-hot-toast";

const BASE_URL = "https://digidishbackend-production.up.railway.app";

export default function Checkout() {
  const { cartItems, totalAmount, restaurantId, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [orderType, setOrderType] = useState("Delivery");
  const [loading, setLoading] = useState(false);
  const [availableServices, setAvailableServices] = useState(["Delivery", "Pickup", "Dine-in"]);

  useEffect(() => {
    if (cartItems.length === 0) {
      navigate("/cart");
    }
  }, [cartItems.length, navigate]);

  useEffect(() => {
    if (restaurantId) {
      api
        .get(`/restaurants/${restaurantId}`)
        .then((res) => {
          const services = res.data.data.restaurant.services || ["Delivery", "Pickup", "Dine-in"];
          setAvailableServices(services);
          if (!services.includes(orderType) && services.length > 0) {
            setOrderType(services[0]);
          }
        })
        .catch(() => {});
    }
  }, [restaurantId, orderType]);

  useEffect(() => {
    if (user?._id) {
      const socket = io(process.env.REACT_APP_API_URL || "${BASE_URL}");
      socket.on("connect", () => {
        socket.emit("join", user._id);
      });
      socket.on("orderStatusUpdate", (data) => {
        toast.success(data.message);
      });
      return () => socket.disconnect();
    }
  }, [user?._id]);

  if (cartItems.length === 0) {
    return null;
  }

  const handleOrder = async () => {
    if (!user) {
      toast.error("Please login to continue");
      navigate("/login");
      return;
    }

    setLoading(true);
    try {
      await api.post("/orders", {
        restaurantID: restaurantId,
        items: cartItems.map((item) => ({
          dishID: item._id,
          quantity: item.quantity,
          price: item.price,
        })),
        totalAmount,
        orderType,
      });
      clearCart();
      toast.success("Order placed successfully!");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const serviceOptions = [
    { 
      value: "Delivery", 
      label: "Delivery", 
      icon: Truck, 
      description: "Delivered to your doorstep",
      price: "3.99 LE"
    },
    { 
      value: "Pickup", 
      label: "Pickup", 
      icon: Store, 
      description: "Pick up from restaurant",
      price: "Free"
    },
    { 
      value: "Dine-in", 
      label: "Dine-in", 
      icon: Utensils, 
      description: "Enjoy at the restaurant",
      price: "Free"
    },
  ];

  const deliveryFee = orderType === "Delivery" ? 3.99 : 0;
  const tax = totalAmount * 0.05;
  const finalTotal = totalAmount + deliveryFee + tax;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <button
        onClick={() => navigate("/cart")}
        className="flex items-center gap-2 text-gray-500 hover:text-gray-700 mb-6 transition-colors group"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to cart
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-6">
          
          <div className="mb-2">
            <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-500 text-sm mt-1">Complete your order</p>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <h2 className="font-semibold text-gray-900">Delivery Method</h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {serviceOptions
                .filter((type) => availableServices.includes(type.value))
                .map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setOrderType(type.value)}
                      className={`group p-4 rounded-xl text-left transition-all duration-200 ${
                        orderType === type.value
                          ? "border-2 border-orange-500 bg-orange-50"
                          : "border border-gray-200 hover:border-orange-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <Icon className={`w-5 h-5 ${orderType === type.value ? "text-orange-500" : "text-gray-400"}`} strokeWidth={1.5} />
                        <span className={`text-xs font-semibold ${orderType === type.value ? "text-orange-500" : "text-gray-400"}`}>
                          {type.price}
                        </span>
                      </div>
                      <div className={`text-sm font-semibold ${orderType === type.value ? "text-gray-900" : "text-gray-700"}`}>
                        {type.label}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">{type.description}</div>
                    </button>
                  );
                })}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <h2 className="font-semibold text-gray-900">Order Items</h2>
            </div>
            <div className="space-y-3">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-50 rounded-lg flex items-center justify-center">
                      <span className="text-orange-500 text-sm font-bold">x{item.quantity}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-400">{item.price.toFixed(2)} LE each</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {(item.price * item.quantity).toFixed(2)} LE
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <h2 className="font-semibold text-gray-900">Payment Method</h2>
            </div>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 border border-orange-200 bg-orange-50 rounded-xl cursor-pointer">
                <input type="radio" name="payment" defaultChecked className="w-4 h-4 text-orange-500" />
                <div className="w-5 h-5 flex items-center justify-center text-lg">💰</div>
                <div>
                  <p className="font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when you receive</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                <input type="radio" name="payment" className="w-4 h-4 text-orange-500" />
                <CreditCard className="w-5 h-5 text-orange-500" strokeWidth={1.5} />
                <div>
                  <p className="font-medium text-gray-900">Credit / Debit Card</p>
                  <p className="text-xs text-gray-500">Visa, Mastercard, Amex</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 sticky top-24 text-white">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5" strokeWidth={1.5} />
              Order Summary
            </h3>
            
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-700">
              <div className="flex justify-between text-gray-300">
                <span>Subtotal</span>
                <span>{totalAmount.toFixed(2)} LE</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `${deliveryFee.toFixed(2)} LE`}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span>Tax (5%)</span>
                <span>{tax.toFixed(2)} LE</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-white font-semibold">Total</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-400">
                  {finalTotal.toFixed(2)} LE
                </span>
              </div>
            </div>
            
            <button
              onClick={handleOrder}
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-400 disabled:to-orange-500 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Place Order
                </>
              )}
            </button>
            
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-gray-400">
              <Shield className="w-3 h-3" />
              <span>Secure payment guaranteed</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
