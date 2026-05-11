import { useState, useEffect } from "react";
import { 
  Package, 
  Clock, 
  CheckCircle, 
  XCircle,
  Search,
  ChevronRight,
  Coffee,
  Filter,
  Eye,
  RefreshCw
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";
import useAuth from "../../context/useAuth";
import { io } from "socket.io-client";

const BASE_URL = "https://digidishbackend-production.up.railway.app";

const statusConfig = {
  Pending: { label: "Pending", class: "bg-amber-50 text-amber-600", icon: Clock, gradient: "from-amber-500 to-amber-600" },
  Preparing: { label: "Preparing", class: "bg-blue-50 text-blue-600", icon: Package, gradient: "from-blue-500 to-blue-600" },
  Completed: { label: "Completed", class: "bg-emerald-50 text-emerald-600", icon: CheckCircle, gradient: "from-emerald-500 to-emerald-600" },
  Cancelled: { label: "Cancelled", class: "bg-red-50 text-red-600", icon: XCircle, gradient: "from-red-500 to-red-600" },
};

const nextStatus = {
  Pending: "Preparing",
  Preparing: "Completed",
};

export default function ManageOrders() {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders/my-restaurant");
      setOrders(res.data.data.orders);
    } catch (error) {
      console.error("Fetch orders error:", error);
      toast.error("Unable to fetch orders");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
    toast.success("Orders refreshed");
  };

  useEffect(() => {
    fetchOrders();
    
    let socket = null;
    if (user?.restaurantID) {
      try {
        socket = io(process.env.REACT_APP_API_URL || "${BASE_URL}");
        socket.on("connect", () => {
          socket.emit("joinRestaurant", user.restaurantID);
        });
        socket.on("newOrder", () => {
          toast.success("🎉 New order received!", {
            duration: 5000,
            icon: "🛎️",
          });
          fetchOrders();
        });
      } catch (error) {
        console.error("Socket connection error:", error);
      }
    }
    
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [user?.restaurantID]);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      toast.success(`Order status updated to ${newStatus}`);
      fetchOrders();
    } catch (error) {
      console.error("Update status error:", error);
      toast.error("Unable to update status");
    }
  };

  const filtered = orders.filter(order => {
    if (filter !== "all" && order.status !== filter) return false;
    if (searchTerm && !order._id.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { value: "all", label: "All Orders", icon: Package, count: orders.length, color: "gray" },
    { value: "Pending", label: "Pending", icon: Clock, count: orders.filter(o => o.status === "Pending").length, color: "amber" },
    { value: "Preparing", label: "Preparing", icon: Package, count: orders.filter(o => o.status === "Preparing").length, color: "blue" },
    { value: "Completed", label: "Completed", icon: CheckCircle, count: orders.filter(o => o.status === "Completed").length, color: "emerald" },
    { value: "Cancelled", label: "Cancelled", icon: XCircle, count: orders.filter(o => o.status === "Cancelled").length, color: "red" },
  ];

  const getStatusCount = (status) => {
    return orders.filter(o => o.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all incoming orders</p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-all duration-200"
        >
          <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} strokeWidth={1.5} />
          Refresh
        </button>
      </div>

      {/* Stats Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-4 text-center shadow-sm">
          <Package className="w-5 h-5 text-gray-400 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
          <p className="text-xs text-gray-500">Total</p>
        </div>
        <div className="bg-amber-50 rounded-xl p-4 text-center shadow-sm">
          <Clock className="w-5 h-5 text-amber-500 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-amber-600">{getStatusCount("Pending")}</p>
          <p className="text-xs text-amber-600">Pending</p>
        </div>
        <div className="bg-blue-50 rounded-xl p-4 text-center shadow-sm">
          <Package className="w-5 h-5 text-blue-500 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-blue-600">{getStatusCount("Preparing")}</p>
          <p className="text-xs text-blue-600">Preparing</p>
        </div>
        <div className="bg-emerald-50 rounded-xl p-4 text-center shadow-sm">
          <CheckCircle className="w-5 h-5 text-emerald-500 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-emerald-600">{getStatusCount("Completed")}</p>
          <p className="text-xs text-emerald-600">Completed</p>
        </div>
        <div className="bg-red-50 rounded-xl p-4 text-center shadow-sm">
          <XCircle className="w-5 h-5 text-red-500 mx-auto mb-2" strokeWidth={1.5} />
          <p className="text-2xl font-bold text-red-600">{getStatusCount("Cancelled")}</p>
          <p className="text-xs text-red-600">Cancelled</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => setFilter(tab.value)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  filter === tab.value
                    ? `bg-gradient-to-r from-${tab.color}-500 to-${tab.color}-600 text-white shadow-md`
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {tab.label}
                {tab.count > 0 && (
                  <span className={`text-xs ${filter === tab.value ? "text-white/80" : "text-gray-400"}`}>
                    ({tab.count})
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search by order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent text-sm transition-all"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="w-20 h-20 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Coffee className="w-10 h-10 text-gray-300" strokeWidth={1.5} />
          </div>
          <p className="text-gray-500 text-lg">No orders found</p>
          <p className="text-sm text-gray-400 mt-1">Orders will appear here once customers place them</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map((order) => {
            const StatusIcon = statusConfig[order.status]?.icon || Package;
            const statusGradient = statusConfig[order.status]?.gradient || "from-gray-500 to-gray-600";
            return (
              <div
                key={order._id}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
              >
                <div className="bg-gradient-to-r from-gray-50 to-white px-6 py-4 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 bg-gradient-to-r ${statusGradient} rounded-xl flex items-center justify-center shadow-sm`}>
                        <StatusIcon className="w-5 h-5 text-white" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="font-bold text-gray-900 text-lg">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                        <p className="text-sm text-gray-400">
                          {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium ${statusConfig[order.status]?.class}`}>
                        <StatusIcon className="w-3.5 h-3.5" strokeWidth={1.5} />
                        {statusConfig[order.status]?.label}
                      </span>
                      <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1.5 rounded-xl font-medium">
                        {order.orderType === "Delivery" && "🚚 Delivery"}
                        {order.orderType === "Pickup" && "🏃 Pickup"}
                        {order.orderType === "Dine-in" && "🍽️ Dine-in"}
                        {!order.orderType && order.orderType}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="space-y-2 mb-4 bg-gray-50 rounded-xl p-4">
                    {order.items && order.items.length > 0 ? (
                      order.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center py-1.5">
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                              <span className="text-orange-600 text-xs font-bold">{item.quantity}</span>
                            </div>
                            <span className="text-gray-700 text-sm font-medium">
                              {item.dishID?.name || "Item"}
                            </span>
                          </div>
                          <span className="font-semibold text-gray-800">
                            {((item.price || 0) * item.quantity).toFixed(2)} LE
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 text-sm text-center py-2">No items in this order</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500 text-sm">Total Amount</span>
                      <div className="h-4 w-px bg-gray-200"></div>
                      <span className="text-xs text-gray-400">{order.items?.length || 0} items</span>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-bold text-orange-500">
                        {(order.totalAmount || 0).toFixed(2)} LE
                      </span>
                    </div>
                  </div>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-400">
                    <Eye className="w-3.5 h-3.5" strokeWidth={1.5} />
                    <span>Order #{order._id.slice(-8)}</span>
                  </div>
                  <div className="flex gap-3">
                    {nextStatus[order.status] && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, nextStatus[order.status])}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-sm ${
                          nextStatus[order.status] === "Preparing"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
                            : "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white"
                        }`}
                      >
                        {nextStatus[order.status] === "Preparing" ? (
                          <>
                            <Package className="w-4 h-4" strokeWidth={1.5} />
                            Start Preparing
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                            Mark Completed
                          </>
                        )}
                      </button>
                    )}
                    {order.status === "Pending" && (
                      <button
                        onClick={() => handleUpdateStatus(order._id, "Cancelled")}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 border border-red-200 text-red-500 hover:bg-red-50 hover:border-red-300"
                      >
                        <XCircle className="w-4 h-4" strokeWidth={1.5} />
                        Cancel Order
                      </button>
                    )}
                    {order.status === "Completed" && (
                      <button
                        disabled
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-emerald-50 text-emerald-600 cursor-default"
                      >
                        <CheckCircle className="w-4 h-4" strokeWidth={1.5} />
                        Order Complete
                      </button>
                    )}
                    {order.status === "Cancelled" && (
                      <button
                        disabled
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium bg-red-50 text-red-500 cursor-default"
                      >
                        <XCircle className="w-4 h-4" strokeWidth={1.5} />
                        Order Cancelled
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {filtered.length > 0 && (
        <div className="mt-6 flex items-center justify-between text-sm text-gray-400 border-t border-gray-100 pt-4">
          <span>Showing {filtered.length} of {orders.length} orders</span>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-amber-100 text-amber-600 rounded-lg text-xs">
              {getStatusCount("Pending")} pending
            </span>
            <span className="px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-xs">
              {getStatusCount("Preparing")} preparing
            </span>
            <span className="px-2 py-1 bg-emerald-100 text-emerald-600 rounded-lg text-xs">
              {getStatusCount("Completed")} completed
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
