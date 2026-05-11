import { Routes, Route, Navigate } from "react-router-dom";
import useAuth from "./context/useAuth";


import GuestLayout from "./layouts/GuestLayout";
import DashboardLayout from "./layouts/DashboardLayout";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


import Home from "./pages/guest/Home";
import RestaurantList from "./pages/guest/RestaurantList";
import RestaurantMenu from "./pages/guest/RestaurantMenu";
import Cart from "./pages/guest/Cart";
import Checkout from "./pages/guest/Checkout";


import SuperAdminDashboard from "./pages/superadmin/Dashboard";
import ManageRestaurants from "./pages/superadmin/ManageRestaurants";
import ContractReports from "./pages/superadmin/ContractReports";


import ManagerDashboard from "./pages/manager/Dashboard";
import ManageMenu from "./pages/manager/ManageMenu";
import ManageOrders from "./pages/manager/ManageOrders";

import HelpCenter from "./layouts/HelpCenter";

// Route Guards
function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role))
    return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      
      <Route element={<GuestLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/restaurants" element={<RestaurantList />} />
        <Route path="/restaurants/:id/menu" element={<RestaurantMenu />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
      </Route>

      
      <Route
        path="/superadmin"
        element={
          <ProtectedRoute allowedRoles={["SuperAdmin"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<SuperAdminDashboard />} />
        <Route path="restaurants" element={<ManageRestaurants />} />
        <Route path="contracts" element={<ContractReports />} />
        
      </Route>

      
      <Route
        path="/manager"
        element={
          <ProtectedRoute allowedRoles={["Manager"]}>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard />} />
        <Route path="menu" element={<ManageMenu />} />
        <Route path="orders" element={<ManageOrders />} />
        
      </Route>

      
      <Route path="*" element={<Navigate to="/" replace />} />
      <Route path="/help" element={<HelpCenter />} />
    </Routes>
  );
}
