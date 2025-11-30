import { useState, useEffect } from 'react';
import { restaurantAPI } from '../api/api';
import { Plus, Edit, Trash2, Loader, Save } from 'lucide-react';
import { showToast } from '../utils/toast';

export const AdminRestaurant = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    tableNumber: '',
    capacity: '',
    location: '',
    description: '',
  });

  useEffect(() => {
    loadTables();
  }, []);

  const loadTables = async () => {
    setLoading(true);
    try {
      const response = await restaurantAPI.getAllTables();
      setTables(response.data.tables || []);
    } catch (error) {
      console.error('Error fetching tables:', error);
      showToast('Failed to load restaurant tables', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTable = () => {
    setEditingTable(null);
    setFormData({
      tableNumber: '',
      capacity: '',
      location: '',
      description: '',
    });
    setShowForm(true);
  };

  const handleEditTable = (table) => {
    setEditingTable(table);
    setFormData({
      tableNumber: table.tableNumber,
      capacity: table.capacity.toString(),
      location: table.location,
      description: table.description || '',
    });
    setShowForm(true);
  };

  const handleSaveTable = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Validate form data
      if (!formData.tableNumber || !formData.capacity) {
        showToast('Please fill in all required fields', 'error');
        setSaving(false);
        return;
      }

      const data = {
        tableNumber: formData.tableNumber,
        capacity: parseInt(formData.capacity),
        location: formData.location,
        description: formData.description,
      };

      if (editingTable) {
        await restaurantAPI.updateTable(editingTable._id, data);
        showToast('Restaurant table updated successfully', 'success');
      } else {
        await restaurantAPI.createTable(data);
        showToast('Restaurant table created successfully', 'success');
      }

      setShowForm(false);
      setEditingTable(null);
      loadTables();
    } catch (error) {
      console.error('Error saving table:', error);
      showToast(error.response?.data?.message || 'Failed to save restaurant table', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTable = async (tableId) => {
    if (
      !window.confirm(
        'Are you sure you want to delete this restaurant table? This action cannot be undone.'
      )
    ) {
      return;
    }

    try {
      await restaurantAPI.deleteTable(tableId);
      showToast('Restaurant table deleted successfully', 'success');
      loadTables();
    } catch (error) {
      console.error('Error deleting table:', error);
      showToast(error.response?.data?.message || 'Failed to delete restaurant table', 'error');
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
        <h2 className="text-2xl font-serif text-[#2a2a2a]">Restaurant Table Management</h2>
        <button
          onClick={handleCreateTable}
          className="flex items-center gap-2 px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add New Table
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6 shadow-sm">
          <h3 className="text-lg font-semibold mb-4">
            {editingTable ? 'Edit Restaurant Table' : 'Add New Restaurant Table'}
          </h3>
          <form onSubmit={handleSaveTable} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Table Number *
                </label>
                <input
                  type="text"
                  value={formData.tableNumber}
                  onChange={(e) => setFormData({ ...formData, tableNumber: e.target.value })}
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
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Window, Center, Patio"
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
                  setEditingTable(null);
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
                    {editingTable ? 'Update Table' : 'Create Table'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {tables.map((table) => (
          <div
            key={table._id}
            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-bold text-[#2a2a2a]">Table {table.tableNumber}</h3>
                <p className="text-sm text-gray-500">Capacity: {table.capacity} guests</p>
                <p className="text-sm text-gray-500">{table.location}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  table.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {table.status}
              </span>
            </div>

            {table.description && (
              <p className="text-sm text-gray-600 mb-4 line-clamp-2">{table.description}</p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => handleEditTable(table)}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={() => handleDeleteTable(table._id)}
                className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {tables.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-500 mb-4">No restaurant tables found</p>
          <button
            onClick={handleCreateTable}
            className="px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
          >
            Add Your First Table
          </button>
        </div>
      )}
    </div>
  );
};
