import { useState, useEffect } from "react";
import { 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  XCircle,
  Calendar,
  Download,
  Search,
  TrendingUp,
  BarChart3,
  PieChart
} from "lucide-react";
import api from "../../services/api";
import { Eye } from "lucide-react";

const BASE_URL = "https://digidishbackend-production.up.railway.app";

export default function ContractReports() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/restaurants");
        setRestaurants(res.data.data.restaurants);
      } catch {
        // handle
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const getContractStatus = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (end < now) return { label: "Expired", icon: XCircle, color: "red", status: "expired" };
    if (end <= in7Days) return { label: "Expiring Soon", icon: AlertTriangle, color: "amber", status: "expiringSoon" };
    return { label: "Active", icon: CheckCircle, color: "emerald", status: "active" };
  };

  const filtered = restaurants.filter(r => {
    if (filter !== "all" && getContractStatus(r.contractEndDate).status !== filter) return false;
    if (searchTerm && !r.name.toLowerCase().includes(searchTerm.toLowerCase())) return false;
    return true;
  });

  const tabs = [
    { value: "all", label: "All Contracts", icon: FileText, count: restaurants.length },
    { value: "active", label: "Active", icon: CheckCircle, count: restaurants.filter(r => getContractStatus(r.contractEndDate).status === "active").length },
    { value: "expiringSoon", label: "Expiring Soon", icon: AlertTriangle, count: restaurants.filter(r => getContractStatus(r.contractEndDate).status === "expiringSoon").length },
    { value: "expired", label: "Expired", icon: XCircle, count: restaurants.filter(r => getContractStatus(r.contractEndDate).status === "expired").length },
  ];

  const activeCount = restaurants.filter(r => getContractStatus(r.contractEndDate).status === "active").length;
  const expiringCount = restaurants.filter(r => getContractStatus(r.contractEndDate).status === "expiringSoon").length;
  const expiredCount = restaurants.filter(r => getContractStatus(r.contractEndDate).status === "expired").length;

  return (
    <div>

      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Contract Reports</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor and manage restaurant contract status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm">Active Contracts</p>
              <p className="text-3xl font-bold mt-1">{activeCount}</p>
            </div>
            <CheckCircle className="w-10 h-10 text-white/30" strokeWidth={1.5} />
          </div>
          <div className="mt-3 pt-2 border-t border-white/20">
            <p className="text-emerald-100 text-xs">{((activeCount / restaurants.length) * 100).toFixed(0)}% of total</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-amber-100 text-sm">Expiring Soon</p>
              <p className="text-3xl font-bold mt-1">{expiringCount}</p>
            </div>
            <AlertTriangle className="w-10 h-10 text-white/30" strokeWidth={1.5} />
          </div>
          <div className="mt-3 pt-2 border-t border-white/20">
            <p className="text-amber-100 text-xs">{((expiringCount / restaurants.length) * 100).toFixed(0)}% of total</p>
          </div>
        </div>
        <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-xl p-5 text-white shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm">Expired Contracts</p>
              <p className="text-3xl font-bold mt-1">{expiredCount}</p>
            </div>
            <XCircle className="w-10 h-10 text-white/30" strokeWidth={1.5} />
          </div>
          <div className="mt-3 pt-2 border-t border-white/20">
            <p className="text-red-100 text-xs">{((expiredCount / restaurants.length) * 100).toFixed(0)}% of total</p>
          </div>
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
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:border-gray-300"
                }`}
              >
                <Icon className="w-4 h-4" strokeWidth={1.5} />
                {tab.label}
                <span className={`text-xs ${filter === tab.value ? "text-gray-300" : "text-gray-400"}`}>
                  ({tab.count})
                </span>
              </button>
            );
          })}
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search restaurants..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64 pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 text-sm"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors">
            <Download className="w-4 h-4" strokeWidth={1.5} />
            Export Report
          </button>
        </div>
      </div>


      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-gray-200 border-t-gray-900"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Restaurant</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Contract Start</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Contract End</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Days Remaining</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map((r) => {
                  const status = getContractStatus(r.contractEndDate);
                  const Icon = status.icon;
                  const daysRemaining = Math.ceil((new Date(r.contractEndDate) - new Date()) / (1000 * 60 * 60 * 24));
                  
                  return (
                    <tr key={r._id} className="hover:bg-gray-50 transition-colors group">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          {r.image ? (
                            <img
                              src={`${BASE_URL}${r.image}`}
                              alt={r.name}
                              className="w-10 h-10 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center">
                              <FileText className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-gray-900">{r.name}</p>
                            <p className="text-xs text-gray-400">{r.address}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" strokeWidth={1.5} />
                          <span>{new Date(r.contractStartDate).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {new Date(r.contractEndDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-${status.color}-50 text-${status.color}-600`}>
                          <Icon className="w-3.5 h-3.5" strokeWidth={1.5} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {status.status === "active" && daysRemaining > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-emerald-500 rounded-full"
                                style={{ width: `${Math.min((daysRemaining / 365) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600">{daysRemaining} days</span>
                          </div>
                        ) : status.status === "expiringSoon" ? (
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-amber-500 rounded-full"
                                style={{ width: `${Math.min((daysRemaining / 30) * 100, 100)}%` }}
                              ></div>
                            </div>
                            <span className="text-xs font-medium text-amber-600">{daysRemaining} days left</span>
                          </div>
                        ) : (
                          <span className="text-xs font-medium text-red-500">Expired</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-gray-400 hover:text-orange-500 transition-colors">
                          <Eye className="w-4 h-4" strokeWidth={1.5} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
