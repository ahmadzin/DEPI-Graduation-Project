import { Link, useNavigate } from "react-router-dom";
import useCart from "../../context/useCart";
import { 
  ShoppingBag, 
  Trash2, 
  Minus, 
  Plus, 
  X, 
  ArrowRight,
  CreditCard,
  ShoppingCart,
  AlertCircle
} from "lucide-react";

export default function Cart() {
  const { cartItems, removeFromCart, updateQuantity, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-orange-100 to-orange-50 rounded-2xl flex items-center justify-center">
            <ShoppingCart className="w-12 h-12 text-orange-300" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-8">Looks like you haven't added any items to your cart yet</p>
          <Link
            to="/restaurants"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
          >
            Browse restaurants
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-500 text-sm mt-1">{cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}</p>
        </div>
        {cartItems.length > 0 && (
          <button
            onClick={clearCart}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear cart
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-100 to-orange-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6 text-orange-500" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-orange-500 font-bold text-lg mt-0.5">
                    {item.price.toFixed(2)} LE
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 bg-gray-50 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white hover:bg-gray-100 flex items-center justify-center transition-all"
                    >
                      <Minus className="w-3.5 h-3.5 text-gray-600" strokeWidth={2} />
                    </button>
                    <span className="w-8 text-center font-semibold text-gray-900">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item._id, item.quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 flex items-center justify-center transition-all"
                    >
                      <Plus className="w-3.5 h-3.5 text-white" strokeWidth={2} />
                    </button>
                  </div>
                </div>
                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-gray-300 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-gray-50 rounded-2xl p-6 sticky top-24">
            <h3 className="font-bold text-gray-900 text-lg mb-4">Order Summary</h3>
            
            <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{totalAmount.toFixed(2)} LE</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span>3.99 LE</span>
              </div>
            </div>
            
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-900 font-semibold">Total</span>
              <div className="text-right">
                <span className="text-2xl font-bold text-orange-500">
                  {(totalAmount + 3.99).toFixed(2)} LE
                </span>
              </div>
            </div>
            
            <button
              onClick={() => navigate("/checkout")}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold py-3.5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            >
              <CreditCard className="w-4 h-4" />
              Proceed to Checkout
            </button>
            
            <div className="mt-4 flex items-start gap-2 text-xs text-gray-400">
              <AlertCircle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
              <p>Taxes and delivery fees calculated at checkout</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
