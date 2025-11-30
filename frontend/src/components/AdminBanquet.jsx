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
      console.log("📦 Admin loaded halls:", response.data.banquetHalls);
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
    console.log("📎 Selected files:", files.length);

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

      // Append images
      formData.images.forEach((img) => {
        submitData.append("images", img);
      });

      console.log("📤 Submitting hall data...");
      console.log("Images to upload:", formData.images.length);

      if (editingHall) {
        await banquetAPI.updateHall(editingHall._id, submitData);
        console.log("✅ Hall updated");
      } else {
        await banquetAPI.createHall(submitData);
        console.log("✅ Hall created");
      }

      alert("Hall saved successfully!");
      setShowForm(false);
      resetForm();
      await loadHalls(); // Reload halls to show new data
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
      await loadHalls(); // Reload halls
    } catch (error) {
      console.error("Delete error:", error);
      alert("Error deleting hall");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Banquet Halls Management</h2>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
          onClick={handleCreate}
        >
          <Plus size={20} /> Add New Hall
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form
          onSubmit={handleSave}
          className="bg-white p-6 border rounded-lg shadow-md space-y-4 mb-8"
        >
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-xl">
              {editingHall ? "Edit Hall" : "Add New Hall"}
            </h3>
            <button
              onClick={() => setShowForm(false)}
              type="button"
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
              <AlertCircle size={20} />
              {error}
            </div>
          )}

          <input
            required
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Hall Name *"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <textarea
            required
            rows={4}
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Description *"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          />

          <input
            required
            type="number"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Base Price (₹) *"
            value={formData.basePrice}
            onChange={(e) =>
              setFormData({ ...formData, basePrice: e.target.value })
            }
          />

          <input
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Amenities (comma separated, e.g., AC, Projector, Wifi)"
            value={formData.amenities}
            onChange={(e) =>
              setFormData({ ...formData, amenities: e.target.value })
            }
          />

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Theater Capacity
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 200"
                value={formData.capacityTheater}
                onChange={(e) =>
                  setFormData({ ...formData, capacityTheater: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cocktail Capacity
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 150"
                value={formData.capacityCocktail}
                onChange={(e) =>
                  setFormData({ ...formData, capacityCocktail: e.target.value })
                }
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banquet Capacity
              </label>
              <input
                type="number"
                className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., 100"
                value={formData.capacityBanquet}
                onChange={(e) =>
                  setFormData({ ...formData, capacityBanquet: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <ImagePlus size={18} /> Upload Images (Multiple)
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {formData.images.length > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {formData.images.length} file(s) selected
              </p>
            )}
          </div>

          {/* Show existing images when editing */}
          {editingHall?.images?.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Current Images
              </label>
              <div className="grid grid-cols-4 gap-3">
                {editingHall.images.map((img, i) => (
                  <img
                    key={i}
                    src={img.url}
                    alt={`Current ${i + 1}`}
                    className="h-24 w-full rounded object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <button
            disabled={saving}
            type="submit"
            className="bg-blue-600 text-white w-full py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            <Save size={18} /> {saving ? "Saving..." : "Save Hall"}
          </button>
        </form>
      )}

      {/* Halls List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {halls.length === 0 ? (
          <div className="col-span-full text-center py-12 text-gray-500">
            No banquet halls yet. Click "Add New Hall" to create one.
          </div>
        ) : (
          halls.map((hall) => (
            <div
              key={hall._id}
              className="border rounded-lg shadow-md overflow-hidden bg-white hover:shadow-lg transition"
            >
              {/* Image */}
              <div className="relative h-48 bg-gray-200">
                {hall.images && hall.images.length > 0 ? (
                  <img
                    src={hall.images[0].url}
                    className="w-full h-full object-cover"
                    alt={hall.name}
                    onError={(e) => {
                      console.error("Image load error:", hall.images[0].url);
                      e.target.src =
                        "https://via.placeholder.com/400x300?text=No+Image";
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImagePlus size={48} />
                    <span className="ml-2">No Image</span>
                  </div>
                )}
                {hall.images && hall.images.length > 1 && (
                  <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-sm">
                    +{hall.images.length - 1}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">{hall.name}</h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {hall.description}
                </p>
                <p className="text-xl font-bold text-green-600 mb-4">
                  ₹{hall.basePrice?.toLocaleString() || 0}
                </p>

                {/* Actions */}
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => handleEdit(hall)}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-blue-700 transition"
                  >
                    <Edit size={16} /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(hall._id)}
                    className="flex-1 bg-red-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 hover:bg-red-700 transition"
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
