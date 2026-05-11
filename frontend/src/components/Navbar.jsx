import { Link, useNavigate } from "react-router-dom";
import { 
  Store, 
  ShoppingBag, 
  LogIn, 
  UserPlus, 
  LayoutDashboard,
  LogOut,
  Heart,
  Menu,
  X
} from "lucide-react";
import useAuth from "../context/useAuth";
import useCart from "../context/useCart";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (user?.role === "SuperAdmin") return "/superadmin";
    if (user?.role === "Manager") return "/manager";
    return "/";
  };

  return (
    <nav className="bg-white/95 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-200 transition-transform group-hover:scale-105">
              <span className="text-white text-lg font-bold">D</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              DigiDish
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/restaurants"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-all duration-200 font-medium"
            >
              <Store className="w-4 h-4" strokeWidth={1.5} />
              <span>Restaurants</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-all duration-200 font-medium"
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.5} />
              <span>Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-3 min-w-[20px] h-5 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold rounded-full flex items-center justify-center px-1.5 shadow-md">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Section */}
            {user ? (
              <div className="flex items-center gap-4 ml-3">
                {(user.role === "SuperAdmin" || user.role === "Manager") && (
                  <Link
                    to={getDashboardPath()}
                    className="flex items-center gap-2 text-sm bg-gray-900 text-white px-4 py-2 rounded-xl hover:bg-gray-800 transition-all duration-200 shadow-sm"
                  >
                    <LayoutDashboard className="w-4 h-4" strokeWidth={1.5} />
                    <span>Dashboard</span>
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full flex items-center justify-center">
                    <span className="text-orange-600 text-sm font-semibold">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-red-500 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" strokeWidth={1.5} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-all duration-200 font-medium px-3 py-2 rounded-xl hover:bg-gray-50"
                >
                  <LogIn className="w-4 h-4" strokeWidth={1.5} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2 rounded-xl font-medium transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <UserPlus className="w-4 h-4" strokeWidth={1.5} />
                  <span>Sign up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 space-y-3">
            <Link
              to="/restaurants"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-2 py-2.5 text-gray-600 hover:bg-orange-50 rounded-xl transition-all"
            >
              <Store className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">Restaurants</span>
            </Link>
            <Link
              to="/cart"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-2 py-2.5 text-gray-600 hover:bg-orange-50 rounded-xl transition-all"
            >
              <ShoppingBag className="w-5 h-5" strokeWidth={1.5} />
              <span className="font-medium">Cart</span>
              {totalItems > 0 && (
                <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </Link>
            {user ? (
              <>
                {(user.role === "SuperAdmin" || user.role === "Manager") && (
                  <Link
                    to={getDashboardPath()}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-2 py-2.5 bg-gray-900 text-white rounded-xl transition-all"
                  >
                    <LayoutDashboard className="w-5 h-5" strokeWidth={1.5} />
                    <span className="font-medium">Dashboard</span>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 px-2 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all w-full"
                >
                  <LogOut className="w-5 h-5" strokeWidth={1.5} />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-2 py-2.5 text-gray-600 hover:bg-orange-50 rounded-xl transition-all"
                >
                  <LogIn className="w-5 h-5" strokeWidth={1.5} />
                  <span className="font-medium">Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-2 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-xl transition-all"
                >
                  <UserPlus className="w-5 h-5" strokeWidth={1.5} />
                  <span className="font-medium">Sign up</span>
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
