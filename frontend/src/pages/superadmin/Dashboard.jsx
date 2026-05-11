import { useState, useEffect } from "react";
import { 
  Store, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Activity,
  Award
} from "lucide-react";
import api from "../../services/api";

export default function SuperAdminDashboard() {
  const [stats, setStats] = useState({
    totalRestaurants: 0,
    activeRestaurants: 0,
    expiringSoon: 0,
    expired: 0,
  });
  const [recentRestaurants, setRecentRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/restaurants");
        const restaurants = res.data.data.restaurants;
        const now = new Date();
        const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

        // دالة للتحقق من حالة العقد
        const getContractStatus = (endDate) => {
          const end = new Date(endDate);
          if (end < now) return "Expired";
          if (end <= in7Days) return "Expiring soon";
          return "Active";
        };

        const activeCount = restaurants.filter(r => getContractStatus(r.contractEndDate) === "Active").length;
        const expiringSoonCount = restaurants.filter(r => getContractStatus(r.contractEndDate) === "Expiring soon").length;
        const expiredCount = restaurants.filter(r => getContractStatus(r.contractEndDate) === "Expired").length;

        setStats({
          totalRestaurants: restaurants.length,
          activeRestaurants: activeCount,
          expiringSoon: expiringSoonCount,
          expired: expiredCount,
        });
        setRecentRestaurants(restaurants.slice(0, 5));
      } catch {
        // handle error
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      label: "Total Restaurants",
      value: stats.totalRestaurants,
      icon: Store,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      label: "Active Restaurants",
      value: stats.activeRestaurants,
      icon: CheckCircle,
      color: "from-emerald-500 to-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Expiring Soon",
      value: stats.expiringSoon,
      icon: AlertTriangle,
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Expired Contracts",
      value: stats.expired,
      icon: XCircle,
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
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
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back, Admin 👋</p>
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
              <div className="mt-3 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full w-${Math.min((card.value / stats.totalRestaurants) * 100, 100)}% bg-gradient-to-r ${card.color} rounded-full`}></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white rounded-xl border border-gray-100 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <h3 className="font-semibold text-gray-900">Contract Status Distribution</h3>
          </div>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Active Contracts</span>
                <span className="font-medium text-gray-900">{stats.activeRestaurants}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(stats.activeRestaurants / stats.totalRestaurants) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Expiring Soon</span>
                <span className="font-medium text-gray-900">{stats.expiringSoon}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(stats.expiringSoon / stats.totalRestaurants) * 100}%` }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Expired Contracts</span>
                <span className="font-medium text-gray-900">{stats.expired}</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-red-500 rounded-full" style={{ width: `${(stats.expired / stats.totalRestaurants) * 100}%` }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
