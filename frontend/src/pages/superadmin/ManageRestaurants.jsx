import { useState, useEffect, useCallback } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload,
  Store,
  MapPin,
  Mail,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronDown,
  Search,
  Power,
  AlertCircle
} from "lucide-react";
import api from "../../services/api";
import toast from "react-hot-toast";

const emptyForm = {
  name: "",
  address: "",
  managerId: "",
  managerEmail: "",
  contractStartDate: "",
  contractEndDate: "",
  image: null,
  services: ["Delivery", "Dine-in", "Pickup"],
};

const BASE_URL = "https://digidishbackend-production.up.railway.app";

const formatDateForInput = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toISOString().split("T")[0];
};

const serviceOptions = [
  { value: "Delivery", label: "Delivery", icon: "🚚" },
  { value: "Pickup", label: "Pickup", icon: "🏃" },
  { value: "Dine-in", label: "Dine-in", icon: "🍽️" },
];

export default function ManageRestaurants() {
  const [restaurants, setRestaurants] = useState([]);
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fetchRestaurants = useCallback(async () => {
    try {
      const res = await api.get("/restaurants");
      setRestaurants(res.data.data.restaurants);
    } catch {
      toast.error("Unable to fetch restaurants");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchManagers = useCallback(async () => {
    try {
      const res = await api.get("/users/managers");
      setManagers(res.data.data.managers);
    } catch {
      toast.error("Unable to fetch managers");
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      await Promise.all([fetchRestaurants(), fetchManagers()]);
    };
    loadData();
  }, [fetchRestaurants, fetchManagers]);

  const handleChange = (e) => {
    if (e.target.name === "image") {
      const file = e.target.files[0];
      setFormData((prev) => ({ ...prev, image: file }));
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setImagePreview(reader.result);
        reader.readAsDataURL(file);
      } else {
        setImagePreview(null);
      }
    } else {
      setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  };

  const handleServiceChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(value)
        ? prev.services.filter(s => s !== value)
        : [...prev.services, value],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("address", formData.address);
      submitData.append("contractStartDate", formData.contractStartDate);
      submitData.append("contractEndDate", formData.contractEndDate);
      formData.services.forEach(s => submitData.append("services", s));
      if (formData.image) submitData.append("image", formData.image);

      if (editId) {
        await api.patch(`/restaurants/${editId}`, submitData, {
          headers: { "Content-Type": undefined },
        });
        toast.success("Restaurant updated successfully");
      } else {
        if (formData.managerId) submitData.append("managerId", formData.managerId);
        if (formData.managerEmail) submitData.append("managerEmail", formData.managerEmail);
        await api.post("/restaurants", submitData, {
          headers: { "Content-Type": undefined },
        });
        toast.success("Restaurant created successfully");
      }
      setShowForm(false);
      setFormData(emptyForm);
      setImagePreview(null);
      setEditId(null);
      fetchRestaurants();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const getContractStatus = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    if (end < now) return { label: "Expired", icon: XCircle, class: "text-red-600 bg-red-50" };
    if (end <= in7Days) return { label: "Expiring soon", icon: AlertTriangle, class: "text-amber-600 bg-amber-50" };
    return { label: "Active", icon: CheckCircle, class: "text-emerald-600 bg-emerald-50" };
  };

  const getDisplayStatus = (restaurant) => {
    const contract = getContractStatus(restaurant.contractEndDate);
    if (contract.label === "Expired") return "Expired";
    return restaurant.status;
  };

  const handleEdit = (restaurant) => {
    const contract = getContractStatus(restaurant.contractEndDate);
    if (contract.label === "Expired") {
      toast.error("Cannot edit restaurant with expired contract");
      return;
    }
    setFormData({
      name: restaurant.name,
      address: restaurant.address,
      managerId: restaurant.managerID ? restaurant.managerID._id : "",
      managerEmail: "",
      contractStartDate: formatDateForInput(restaurant.contractStartDate),
      contractEndDate: formatDateForInput(restaurant.contractEndDate),
      image: null,
      services: restaurant.services || ["Delivery", "Dine-in", "Pickup"],
    });
    setImagePreview(restaurant.image ? `${BASE_URL}${restaurant.image}` : null);
    setEditId(restaurant._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id, restaurant) => {
    const contract = getContractStatus(restaurant.contractEndDate);
    if (contract.label === "Expired") {
      toast.error("Cannot delete restaurant with expired contract. Please renew contract first.");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this restaurant? This action cannot be undone.")) return;
    try {
      await api.delete(`/restaurants/${id}`);
      toast.success("Restaurant deleted successfully");
      fetchRestaurants();
    } catch {
      toast.error("Unable to delete restaurant");
    }
  };

  const handleToggleStatus = async (id, currentStatus, restaurant) => {
    const contract = getContractStatus(restaurant.contractEndDate);
    if (contract.label === "Expired") {
      toast.error("Cannot change status of restaurant with expired contract");
      return;
    }
    try {
      const newStatus = currentStatus === "Active" ? "Suspended" : "Active";
      await api.patch(`/restaurants/${id}/status`, { status: newStatus });
      toast.success(`Restaurant ${newStatus === "Active" ? "activated" : "suspended"} successfully`);
      fetchRestaurants();
    } catch {
      toast.error("Unable to change status");
    }
  };

  const filteredRestaurants = restaurants.filter(r =>
    r.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Restaurant Management</h1>
          <p className="text-gray-500 text-sm mt-1">{restaurants.length} total restaurants</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setFormData(emptyForm);
            setImagePreview(null);
            setEditId(null);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Restaurant"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg mb-8">
          <h2 className="font-semibold text-gray-900 text-lg mb-5 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              {editId ? <Edit className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </div>
            {editId ? "Edit Restaurant" : "Add New Restaurant"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="e.g., Pizza Paradise"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address *
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="123 Main St, City"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Manager
              </label>
              {managers.length > 0 && (
                <div className="relative mb-3">
                  <select
                    value={formData.managerId}
                    onChange={(e) => setFormData(prev => ({ ...prev, managerId: e.target.value, managerEmail: "" }))}
                    disabled={!!editId}
                    className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white disabled:bg-gray-50"
                  >
                    <option value="">Select existing manager</option>
                    {managers.map(manager => (
                      <option key={manager._id} value={manager._id}>
                        {manager.name} — {manager.email}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
              )}
              <input
                type="email"
                name="managerEmail"
                value={formData.managerEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, managerEmail: e.target.value, managerId: "" }))}
                disabled={!!editId}
                placeholder="Or enter email to assign as manager"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 disabled:bg-gray-50"
              />
              {editId && (
                <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Manager cannot be changed from here
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract Start Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="contractStartDate"
                  value={formData.contractStartDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contract End Date *
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="date"
                  name="contractEndDate"
                  value={formData.contractEndDate}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Restaurant Logo
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="restaurant-image"
                />
                <label
                  htmlFor="restaurant-image"
                  className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 transition-colors w-fit"
                >
                  <Upload className="w-4 h-4 text-gray-400" />
                  <span>{formData.image ? formData.image.name : "Upload logo"}</span>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-gray-200" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Services
              </label>
              <div className="flex flex-wrap gap-4">
                {serviceOptions.map(service => (
                  <label key={service.value} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.services.includes(service.value)}
                      onChange={() => handleServiceChange(service.value)}
                      className="w-4 h-4 rounded border-gray-300 text-orange-500 focus:ring-orange-400"
                    />
                    <span className="text-sm text-gray-700">
                      {service.icon} {service.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-md"
              >
                {submitting ? "Saving..." : editId ? "Save Changes" : "Create Restaurant"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setFormData(emptyForm);
                  setImagePreview(null);
                  setEditId(null);
                }}
                className="px-6 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-6">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search restaurants..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400 text-sm"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-3 border-orange-200 border-t-orange-500"></div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Restaurant</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Address</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Manager</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Contract</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredRestaurants.map((r) => {
                  const contract = getContractStatus(r.contractEndDate);
                  const ContractIcon = contract.icon;
                  const displayStatus = getDisplayStatus(r);
                  const isContractExpired = displayStatus === "Expired";
                  
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
                            <div className="w-10 h-10 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                              <Store className="w-5 h-5 text-gray-400" />
                            </div>
                          )}
                          <span className="font-semibold text-gray-900">{r.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5" />
                          <span>{r.address}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-500">
                        {r.managerID ? (
                          <div className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            <span>{r.managerID.name}</span>
                          </div>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium ${contract.class}`}>
                          <ContractIcon className="w-3.5 h-3.5" />
                          {contract.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium ${
                          displayStatus === "Active" 
                            ? "bg-emerald-50 text-emerald-600" 
                            : displayStatus === "Expired"
                            ? "bg-red-50 text-red-600"
                            : "bg-gray-100 text-gray-500"
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${
                            displayStatus === "Active" ? "bg-emerald-500" : "bg-gray-400"
                          }`}></div>
                          {displayStatus === "Active" ? "Active" : displayStatus === "Expired" ? "Contract Expired" : "Suspended"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(r)}
                            disabled={isContractExpired}
                            className={`p-2 rounded-lg transition-all ${
                              isContractExpired 
                                ? "text-gray-300 cursor-not-allowed" 
                                : "text-gray-400 hover:text-orange-500 hover:bg-orange-50"
                            }`}
                            title={isContractExpired ? "Cannot edit expired contract" : "Edit"}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          
                          {!isContractExpired && (
                            <button
                              onClick={() => handleToggleStatus(r._id, r.status, r)}
                              className={`p-2 rounded-lg transition-all ${
                                r.status === "Active" 
                                  ? "text-gray-400 hover:text-amber-500 hover:bg-amber-50" 
                                  : "text-gray-400 hover:text-emerald-500 hover:bg-emerald-50"
                              }`}
                              title={r.status === "Active" ? "Suspend" : "Activate"}
                            >
                              <Power className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(r._id, r)}
                            disabled={isContractExpired}
                            className={`p-2 rounded-lg transition-all ${
                              isContractExpired 
                                ? "text-gray-300 cursor-not-allowed" 
                                : "text-gray-400 hover:text-red-500 hover:bg-red-50"
                            }`}
                            title={isContractExpired ? "Cannot delete expired contract" : "Delete"}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
