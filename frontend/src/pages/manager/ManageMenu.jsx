import { useState, useEffect } from "react";
import { 
  Plus, 
  Edit, 
  Trash2, 
  X, 
  Upload,
  Coffee,
  Search,
  ChevronDown,
  Image as ImageIcon,
  AlertCircle
} from "lucide-react";
import api from "../../services/api";
import useAuth from "../../context/useAuth";
import toast from "react-hot-toast";

const BASE_URL = "https://digidishbackend-production.up.railway.app";

const emptyForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  image: null,
};

const categories = [
  { value: "Starters", label: "Starters", icon: "🥗" },
  { value: "Main Course", label: "Main Course", icon: "🍛" },
  { value: "Sides", label: "Sides", icon: "🍟" },
  { value: "Desserts", label: "Desserts", icon: "🍰" },
  { value: "Drinks", label: "Drinks", icon: "🥤" },
];

export default function ManageMenu() {
  const { user } = useAuth();
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [imagePreview, setImagePreview] = useState(null);

  const fetchDishes = async () => {
    try {
      const res = await api.get(`/restaurants/${user.restaurantID}/dishes`);
      setDishes(res.data.data.dishes);
    } catch {
      toast.error("Unable to fetch dishes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDishes();
  }, []);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const submitData = new FormData();
      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("price", formData.price);
      submitData.append("category", formData.category);
      submitData.append("restaurantID", user.restaurantID);
      if (formData.image) {
        submitData.append("image", formData.image);
      }

      if (editId) {
        await api.patch(
          `/restaurants/${user.restaurantID}/dishes/${editId}`,
          submitData,
          { headers: { "Content-Type": undefined } }
        );
        toast.success("Dish updated successfully");
      } else {
        await api.post(`/restaurants/${user.restaurantID}/dishes`, submitData, {
          headers: { "Content-Type": undefined },
        });
        toast.success("Dish added successfully");
      }
      setShowForm(false);
      setFormData(emptyForm);
      setImagePreview(null);
      setEditId(null);
      fetchDishes();
    } catch (err) {
      toast.error(err.response?.data?.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (dish) => {
    setFormData({
      name: dish.name,
      description: dish.description,
      price: dish.price,
      category: dish.category,
      image: null,
    });
    setImagePreview(dish.image ? `${BASE_URL}${dish.image}` : null);
    setEditId(dish._id);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this dish?")) return;
    try {
      await api.delete(`/restaurants/${user.restaurantID}/dishes/${id}`);
      toast.success("Dish deleted successfully");
      fetchDishes();
    } catch {
      toast.error("Unable to delete dish");
    }
  };

  const filteredDishes = dishes.filter(d =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.value === category);
    return cat?.icon || "🍽️";
  };

  return (
    <div>
      
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
          <p className="text-gray-500 text-sm mt-1">{dishes.length} total dishes</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditId(null);
            setFormData(emptyForm);
            setImagePreview(null);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-md"
        >
          {showForm ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
          {showForm ? "Cancel" : "Add Dish"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-lg mb-8">
          <h2 className="font-semibold text-gray-900 text-lg mb-5 flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              {editId ? <Edit className="w-4 h-4 text-white" /> : <Plus className="w-4 h-4 text-white" />}
            </div>
            {editId ? "Edit Dish" : "Add New Dish"}
          </h2>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dish Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all"
                placeholder="e.g., Margherita Pizza"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <div className="relative">
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white"
                >
                  <option value="" disabled>Select category</option>
                  {categories.map(cat => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (USD) *
              </label>
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                required
                min="0"
                step="0.01"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <input
                type="text"
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
                placeholder="Brief description of the dish"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dish Image
              </label>
              <div className="relative">
                <input
                  type="file"
                  name="image"
                  accept="image/*"
                  onChange={handleChange}
                  className="hidden"
                  id="dish-image"
                />
                <label
                  htmlFor="dish-image"
                  className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 text-sm cursor-pointer hover:bg-gray-50 transition-colors w-fit"
                >
                  <Upload className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                  <span>{formData.image ? formData.image.name : "Upload image"}</span>
                </label>
              </div>
              {imagePreview && (
                <div className="mt-3">
                  <img src={imagePreview} alt="Preview" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                </div>
              )}
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-orange-300 disabled:to-orange-400 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-md"
              >
                {submitting ? "Saving..." : editId ? "Save Changes" : "Add Dish"}
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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" strokeWidth={1.5} />
          <input
            type="text"
            placeholder="Search dishes..."
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
      ) : filteredDishes.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <Coffee className="w-12 h-12 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
          <p className="text-gray-500 text-lg">No dishes found</p>
          <p className="text-sm text-gray-400 mt-1">Click "Add Dish" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDishes.map((dish) => (
            <div
              key={dish._id}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200">
                {dish.image ? (
                  <img
                    src={`${BASE_URL}${dish.image}`}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-gray-300" strokeWidth={1.5} />
                    <span className="text-xs text-gray-400 mt-2">No image</span>
                  </div>
                )}
                
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1.5 bg-white/95 backdrop-blur text-gray-700 text-xs font-medium rounded-xl shadow-sm flex items-center gap-1">
                    <span>{getCategoryIcon(dish.category)}</span>
                    <span>{dish.category}</span>
                  </span>
                </div>
              </div>

              
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-gray-900 text-lg group-hover:text-orange-500 transition-colors">
                    {dish.name}
                  </h3>
                  <span className="font-bold text-orange-500 text-xl">
                    {dish.price.toFixed(2)} LE
                  </span>
                </div>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {dish.description || "No description available"}
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(dish)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 py-2.5 rounded-xl transition-all duration-200"
                  >
                    <Edit className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dish._id)}
                    className="flex-1 flex items-center justify-center gap-2 text-sm bg-red-50 hover:bg-red-100 text-red-500 py-2.5 rounded-xl transition-all duration-200"
                  >
                    <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
