import { useState, useEffect } from 'react';
import { banquetAPI } from '../api/api';
import { Plus, Edit, Trash2, Loader, Save, X } from 'lucide-react';
import { showToast } from '../utils/toast';

export const AdminBanquet = () => {
  const [halls, setHalls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingHall, setEditingHall] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
    basePrice: '',
    description: '',
    amenities: '',
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
      console.error('Error fetching halls:', error);
      showToast('Failed to load banquet halls', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHall = () => {
    setEditingHall(null);
    setFormData({
      name: '',
      capacity: '',
      basePrice: '',
      description: '',
      amenities: '',
    });
    setShowForm(true);
  };

  const handleEditHall = (hall) => {
    setEditingHall(hall);
    setFormData({
      name: hall.name,
      capacity: hall.capacity.toString(),
      basePrice: hall.basePrice.toString(),
      description: hall.description,
      amenities: hall.amenities?.join(', ') || '',
    });
    setShowForm(true);
  };

  const handleSaveHall = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate form data
      if (!formData.name || !formData.capacity || !formData.basePrice) {
        showToast('Please fill in all required fields', 'error');
        setSaving(false);
        return;
      }

      const data = {
        name: formData.name,
        capacity: parseInt(formData.capacity),
        basePrice: parseFloat(formData.basePrice),
        description: formData.description,
        amenities: formData.amenities
          .split(',')
          .map((item) => item.trim())
          .filter((item) => item),
      };

      if (editingHall) {
        await banquetAPI.updateHall(editingHall._id, data);
        showToast('Banquet hall updated successfully', 'success');
      } else {
        await banquetAPI.createHall(data);
        showToast('Banquet hall created successfully', 'success');
      }

      setShowForm(false);
      setEditingHall(null);
      loadHalls();
    } catch (error) {
      console.error('Error saving hall:', error);
      showToast(error.response?.data?.message || 'Failed to save banquet hall', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteHall = async (hallId) => {
    if (!window.confirm('Are you sure you want to delete this banquet hall? This action cannot be undone.')) {
      return;
    }

    try {
      await banquetAPI.deleteHall(hallId);
      showToast('Banquet hall deleted successfully', 'success');
      loadHalls();
    } catch (error) {
      console.error('Error deleting hall:', error);
      showToast(error.response?.data?.message || 'Failed to delete banquet hall', 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader className="w-8 h-8 animate-spin text-[#B8860B]" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#2a2a2a]">Banquet Hall Management</h2>
        <button
          onClick={handleCreateHall}
          className="flex items-center gap-2 px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Hall
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingHall ? 'Edit Banquet Hall' : 'Add New Banquet Hall'}
          </h3>
          <form onSubmit={handleSaveHall} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Hall Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Capacity *
                </label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Base Price (₹) *
                </label>
                <input
                  type="number"
                  value={formData.basePrice}
                  onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Amenities (comma separated)
                </label>
                <input
                  type="text"
                  value={formData.amenities}
                  onChange={(e) => setFormData({ ...formData, amenities: e.target.value })}
                  placeholder="e.g., AC, Stage, Sound System"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingHall(null);
                }}
                disabled={saving}
                className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    {editingHall ? 'Update Hall' : 'Create Hall'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {halls.map((hall) => (
          <div
            key={hall._id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#2a2a2a]">{hall.name}</h3>
                <p className="text-sm text-gray-500">Capacity: {hall.capacity} guests</p>
              </div>
              <span className="text-xl font-bold text-[#B8860B]">
                ₹{hall.basePrice.toLocaleString()}
              </span>
            </div>

            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{hall.description}</p>

            {hall.amenities && hall.amenities.length > 0 && (
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">Amenities:</p>
                <div className="flex flex-wrap gap-2">
                  {hall.amenities.map((amenity, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded text-xs"
                    >
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleEditHall(hall)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteHall(hall._id)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {halls.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No banquet halls found</p>
          <button
            onClick={handleCreateHall}
            className="px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
          >
            Add Your First Hall
          </button>
        </div>
      )}
    </div>
  );
};
