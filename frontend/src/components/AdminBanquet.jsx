import { useState, useEffect } from "react";
import { banquetAPI } from "../api/api";
import {
  Plus,
  Edit,
  Trash2,
  Loader,
  Save,
  X,
  ImagePlus,
  AlertCircle,
  Users,
  DollarSign,
} from "lucide-react";

export const AdminBanquet = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    basePrice: "",
    description: "",
    amenities: "",
    capacityTheater: "",
    capacityCocktail: "",
    capacityBanquet: "",
    images: [],
  });

  useEffect(() => {
    loadHalls();
  }, []);

  const loadHalls = async () => {
    setLoading(true);
    try {
      const response = await banquetAPI.getAllHalls();
      setHalls(response.data.banquetHalls || []);
    } catch (error) {
      console.error("Failed to load halls:", error);
      setError("Failed to load banquet halls");
    }
    setLoading(false);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      basePrice: "",
      description: "",
      amenities: "",
      capacityTheater: "",
      capacityCocktail: "",
      capacityBanquet: "",
      images: [],
    });
    setError("");
  };

  const handleCreate = () => {
    setEditingHall(null);
    resetForm();
    setShowForm(true);
  };

  const handleEdit = (hall) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      basePrice: hall.basePrice,
      description: hall.description,
      amenities: hall.amenities?.join(", ") || "",
      capacityTheater: hall.capacity?.theater || "",
      capacityCocktail: hall.capacity?.cocktail || "",
      capacityBanquet: hall.capacity?.banquet || "",
      images: [],
    });
    setShowForm(true);
    setError("");
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      images: files,
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSaving(true);

    try {
      const submitData = new FormData();

      submitData.append("name", formData.name);
      submitData.append("description", formData.description);
      submitData.append("basePrice", formData.basePrice);
      submitData.append(
        "amenities",
        JSON.stringify(
          formData.amenities
            .split(",")
            .map((a) => a.trim())
            .filter((a) => a)
        )
      );
      submitData.append(
        "capacity",
        JSON.stringify({
          theater: Number(formData.capacityTheater) || 0,
          cocktail: Number(formData.capacityCocktail) || 0,
          banquet: Number(formData.capacityBanquet) || 0,
        })
      );

      formData.images.forEach((img) => {
        submitData.append("images", img);
      });

      if (editingHall) {
        await banquetAPI.updateHall(editingHall._id, submitData);
      } else {
        await banquetAPI.createHall(submitData);
      }

      alert("Hall saved successfully!");
      setShowForm(false);
      resetForm();
      await loadHalls();
    } catch (error) {
      console.error("Save error:", error);
      setError(error.response?.data?.message || "Error saving hall");
    }

    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this hall?")) return;

    try {
      await banquetAPI.deleteHall(id);
      alert("Hall deleted successfully!");
      await loadHalls();
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting hall");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <Loader className="animate-spin w-12 h-12 text-[#B8860B] mx-auto mb-4" />
          <p className="text-[#6a6a6a] font-semibold">Loading banquet halls...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37] mb-2">
            Banquet Halls Management
          </h2>
          <p className="text-[#6a6a6a]">{halls.length} hall{halls.length !== 1 ? 's' : ''} available</p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white rounded-xl hover:shadow-lg hover:shadow-[#B8860B]/30 transition-all duration-300 font-semibold"
          onClick={handleCreate}
        >
          <Plus size={20} /> Add New Hall
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-gradient-to-br from-white to-[#FBF9F4] p-8 rounded-2xl shadow-[0_8px_32px_rgba(184,134,11,0.15)] border border-[#B8860B]/20 space-y-6 mb-8"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-serif text-[#2a2a2a]">
              {editingHall ? "Edit Hall" : "Add New Hall"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              type="button"
              className="p-2 hover:bg-[#B8860B]/10 rounded-full transition-colors"
            >
              <X size={24} className="text-[#B8860B]" />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded flex items-center gap-3">
              <AlertCircle size={20} />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                Hall Name *
              </label>
              <input
                required
                className="w-full border-2 border-[#B8860B]/20 p-3 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all"
                placeholder="Enter hall name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                Description *
              </label>
              <textarea
                required
                rows={4}
                className="w-full border-2 border-[#B8860B]/20 p-3 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all"
                placeholder="Describe the hall features and ambiance"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                Base Price (₹) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[#B8860B]" />
                <input
                  required
                  type="number"
                  className="w-full border-2 border-[#B8860B]/20 p-3 pl-10 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all"
                  placeholder="e.g., 50000"
                  value={formData.basePrice}
                  onChange={(e) =>
                    setFormData({ ...formData, basePrice: e.target.value })
                  }
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                Amenities
              </label>
              <input
                className="w-full border-2 border-[#B8860B]/20 p-3 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all"
                placeholder="AC, Projector, Wifi (comma separated)"
                value={formData.amenities}
                onChange={(e) =>
                  setFormData({ ...formData, amenities: e.target.value })
                }
              />
            </div>
          </div>

          <div className="bg-[#B8860B]/5 p-6 rounded-xl">
            <h4 className="text-lg font-semibold text-[#2a2a2a] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[#B8860B]" />
              Capacity Configuration
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                  Theater Style
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-[#B8860B]/20 p-3 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all"
                  placeholder="e.g., 200"
                  value={formData.capacityTheater}
                  onChange={(e) =>
                    setFormData({ ...formData, capacityTheater: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                  Cocktail Style
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-[#B8860B]/20 p-3 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all"
                  placeholder="e.g., 150"
                  value={formData.capacityCocktail}
                  onChange={(e) =>
                    setFormData({ ...formData, capacityCocktail: e.target.value })
                  }
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#2a2a2a] mb-2">
                  Banquet Style
                </label>
                <input
                  type="number"
                  className="w-full border-2 border-[#B8860B]/20 p-3 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all"
                  placeholder="e.g., 100"
                  value={formData.capacityBanquet}
                  onChange={(e) =>
                    setFormData({ ...formData, capacityBanquet: e.target.value })
                  }
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#2a2a2a] mb-2 flex items-center gap-2">
              <ImagePlus size={18} className="text-[#B8860B]" /> Upload Images (Multiple)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border-2 border-[#B8860B]/20 p-3 rounded-xl focus:ring-2 focus:ring-[#B8860B] focus:border-[#B8860B] transition-all file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-[#B8860B]/10 file:text-[#B8860B] file:font-semibold hover:file:bg-[#B8860B]/20 file:cursor-pointer"
            />
            {formData.images.length > 0 && (
              <p className="text-sm text-[#B8860B] mt-2 font-semibold">
                ✓ {formData.images.length} file(s) selected
              </p>
            )}
          </div>

          {editingHall?.images?.length > 0 && (
            <div>
              <label className="block text-sm font-semibold text-[#2a2a2a] mb-3">
                Current Images
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {editingHall.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`Current ${i + 1}`}
                    className="h-32 w-full rounded-xl object-cover border-2 border-[#B8860B]/20 hover:border-[#B8860B] transition-all"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            disabled={saving}
            type="submit"
            className="w-full bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white py-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-[#B8860B]/30 transition-all duration-300 font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Save size={20} /> {saving ? "Saving..." : "Save Hall"}
          </button>
        </form>
      )}

      {/* Halls List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.length === 0 ? (
          <div className="col-span-full text-center py-20">
            <div className="w-20 h-20 bg-[#B8860B]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-[#B8860B]" />
            </div>
            <h3 className="text-xl font-serif text-[#2a2a2a] mb-2">No Banquet Halls Yet</h3>
            <p className="text-[#6a6a6a] mb-6">Create your first banquet hall to get started</p>
            <button
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-[#B8860B] to-[#D4AF37] text-white rounded-xl hover:shadow-lg hover:shadow-[#B8860B]/30 transition-all duration-300 font-semibold"
            >
              Add New Hall
            </button>
          </div>
        ) : (
          halls.map((hall) => (
            <div
              key={hall._id}
              className="group bg-white rounded-2xl shadow-[0_4px_20px_rgba(184,134,11,0.1)] overflow-hidden hover:shadow-[0_8px_32px_rgba(184,134,11,0.2)] transition-all duration-300 border border-[#B8860B]/10"
            >
              {/* Image */}
              <div className="relative h-56 bg-gradient-to-br from-[#B8860B]/10 to-[#D4AF37]/10 overflow-hidden">
                {hall.images && hall.images.length > 0 ? (
                  <>
                    <img
                      src={hall.images[0].url}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      alt={hall.name}
                      onError={(e) => {
                        e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                      }}
                    />
                    {hall.images.length > 1 && (
                      <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-sm font-semibold">
                        +{hall.images.length - 1}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-[#B8860B]/40">
                    <ImagePlus size={48} />
                    <span className="mt-2 text-sm font-semibold">No Image</span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="font-serif text-xl text-[#2a2a2a] mb-2">{hall.name}</h3>
                <p className="text-[#6a6a6a] text-sm mb-4 line-clamp-2">
                  {hall.description}
                </p>

                <div className="flex items-center justify-between mb-4 pb-4 border-b border-[#B8860B]/10">
                  <div className="flex items-center gap-2 text-[#B8860B]">
                    <Users className="w-4 h-4" />
                    <span className="text-sm font-semibold">
                      {hall.capacity?.theater || 0} Theater
                    </span>
                  </div>
                  <div className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#B8860B] to-[#D4AF37]">
                    ₹{hall.basePrice?.toLocaleString() || 0}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(hall)}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 font-semibold"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hall._id)}
                    className="flex-1 bg-gradient-to-r from-red-500 to-red-600 text-white py-2.5 px-4 rounded-xl flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-red-500/30 transition-all duration-300 font-semibold"
                  >
                    <Trash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};