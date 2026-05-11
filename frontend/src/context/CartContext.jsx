import { createContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);


  const addToCart = (dish, restId) => {
    // لو في أطباق من مطعم تاني — امسح الكارت
    if (restaurantId && restaurantId !== restId) {
      setCartItems([]);
      setRestaurantId(restId);
    }

    if (!restaurantId) setRestaurantId(restId);

    setCartItems((prev) => {
      const existing = prev.find((item) => item._id === dish._id);
      if (existing) {
        return prev.map((item) =>
          item._id === dish._id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { ...dish, quantity: 1 }];
    });
  };


  const removeFromCart = (dishId) => {
    setCartItems((prev) => prev.filter((item) => item._id !== dishId));
    if (cartItems.length === 1) setRestaurantId(null);
  };


  const updateQuantity = (dishId, quantity) => {
    if (quantity < 1) return removeFromCart(dishId);
    setCartItems((prev) =>
      prev.map((item) => (item._id === dishId ? { ...item, quantity } : item)),
    );
  };


  const clearCart = () => {
    setCartItems([]);
    setRestaurantId(null);
  };


  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalAmount,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
