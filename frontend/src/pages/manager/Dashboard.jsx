import { useState, useEffect } from "react";
import { 
  Coffee, 
  Package, 
  Clock, 
  CheckCircle,
  TrendingUp,
  DollarSign,
  Users,
  Star,
  Calendar,
  Activity,
  Award,
  Eye
} from "lucide-react";
import api from "../../services/api";
import useAuth from "../../context/useAuth";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalDishes: 0,
    totalOrders: 0,
    pending: 0,
    completed: 0,
  });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [dishRes, orderRes] = await Promise.all([
          api.get(`/dishes/restaurant/${user.restaurantID}`),
          api.get("/orders/my-restaurant"),
        ]);
        const orders = orderRes.data.data.orders;
        setStats({
          totalDishes: dishRes.data.data.dishes.length,
          totalOrders: orders.length,
          pending: orders.filter((o) => o.status === "Pending").length,
          completed: orders.filter((o) => o.status === "Completed").length,
        });
        setRecentOrders(orders.slice(0, 5));
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [user]);

  const cards = [
    {
      label: "Total Dishes",
      value: stats.totalDishes,
      icon: Coffee,
      color: "from-blue-500 to-blue-600",
    },
    {
      label: "Total Orders",
      value: stats.totalOrders,
      icon: Package,
      color: "from-purple-500 to-purple-600",
    },
    {
      label: "Pending Orders",
      value: stats.pending,
      icon: Clock,
      color: "from-amber-500 to-amber-600",
    },
    {
      label: "Completed Orders",
      value: stats.completed,
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-12 h-12 border-3 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
     
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-white text-lg">🍕</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-500 text-sm">Welcome back, {user?.name} 👨‍🍳</p>
          </div>
        </div>
      </div>

      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md transition-all duration-200 group"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-sm`}>
                  <Icon className="w-5 h-5 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Recent Orders</h3>
            <button className="text-sm text-orange-500 hover:text-orange-600 font-medium">View all</button>
          </div>
          <div className="space-y-3">
            {recentOrders.map((order) => (
              <div key={order._id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                  order.status === 'Pending' ? 'bg-amber-100' :
                  order.status === 'Preparing' ? 'bg-blue-100' :
                  order.status === 'Completed' ? 'bg-emerald-100' : 'bg-red-100'
                }`}>
                  {order.status === 'Pending' && <Clock className="w-4 h-4 text-amber-600" />}
                  {order.status === 'Preparing' && <Package className="w-4 h-4 text-blue-600" />}
                  {order.status === 'Completed' && <CheckCircle className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900 text-sm">#{order._id.slice(-6)}</p>
                  <p className="text-xs text-gray-400 capitalize">{order.status}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{order.totalAmount.toFixed(2)} LE</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
              </div>
            ))}
            {recentOrders.length === 0 && (
              <div className="text-center py-8">
                <Package className="w-10 h-10 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
                <p className="text-gray-400 text-sm">No orders yet</p>
              </div>
            )}
          </div>
        </div>

        
        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <h3 className="font-semibold text-gray-900">Restaurant Performance</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Completion Rate</span>
                <span className="font-medium text-gray-900">
                  {stats.totalOrders ? Math.round((stats.completed / stats.totalOrders) * 100) : 0}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${stats.totalOrders ? (stats.completed / stats.totalOrders) * 100 : 0}%` }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
