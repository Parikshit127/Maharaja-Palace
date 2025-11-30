import React, { useState, useEffect } from 'react';
import { roomAPI } from '../api/api';
import { Plus, Edit, Trash2, Eye, X, Save, Loader } from 'lucide-react';
import { showToast } from '../utils/toast';

export const AdminRooms = () => {
  const [activeView, setActiveView] = useState('types'); // 'types' or 'rooms'
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [selectedItem, setSelectedItem] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basePrice: '',
    maxOccupancy: '',
    squareFeet: '',
    amenities: [],
    features: [],
    images: [],
  });

  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    roomType: '',
    floor: '',
    currentPrice: '',
    status: 'available',
  });

  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [activeView]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const typesRes = await roomAPI.getRoomTypes();
      setRoomTypes(typesRes.data.roomTypes || []);
      
      if (activeView === 'rooms') {
        const roomsRes = await roomAPI.getAllRooms();
        setRooms(roomsRes.data.rooms || []);
      }
    } catch (error) {
      console.error('Error loading data:', error);
      setError('Failed to load data. Please try again.');
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRoomType = () => {
    setModalMode('create');
    setSelectedItem(null);
    setFormData({
      name: '',
      description: '',
      basePrice: '',
      maxOccupancy: '',
      squareFeet: '',
      amenities: [],
      features: [],
      images: [],
    });
    setShowModal(true);
  };

  const handleEditRoomType = (roomType) => {
    setModalMode('edit');
    setSelectedItem(roomType);
    setFormData({
      name: roomType.name,
      description: roomType.description,
      basePrice: roomType.basePrice.toString(),
      maxOccupancy: roomType.maxOccupancy.toString(),
      squareFeet: roomType.squareFeet.toString(),
      amenities: roomType.amenities || [],
      features: roomType.features || [],
      images: roomType.images || [],
    });
    setShowModal(true);
  };

  const handleViewRoomType = (roomType) => {
    setModalMode('view');
    setSelectedItem(roomType);
    setFormData({
      name: roomType.name,
      description: roomType.description,
      basePrice: roomType.basePrice.toString(),
      maxOccupancy: roomType.maxOccupancy.toString(),
      squareFeet: roomType.squareFeet.toString(),
      amenities: roomType.amenities || [],
      features: roomType.features || [],
      images: roomType.images || [],
    });
    setShowModal(true);
  };

  const handleDeleteRoomType = async (roomTypeId) => {
    if (!window.confirm('Are you sure you want to delete this room type? This action cannot be undone.')) {
      return;
    }

    try {
      await roomAPI.deleteRoomType(roomTypeId);
      showToast('Room type deleted successfully', 'success');
      loadData();
    } catch (error) {
      console.error('Error deleting room type:', error);
      showToast(error.response?.data?.message || 'Failed to delete room type', 'error');
    }
  };

  const handleCreateRoom = () => {
    setModalMode('create');
    setSelectedItem(null);
    setRoomFormData({
      roomNumber: '',
      roomType: roomTypes[0]?._id || '',
      floor: '',
      currentPrice: '',
      status: 'available',
    });
    setShowModal(true);
  };

  const handleEditRoom = (room) => {
    try {
      setModalMode('edit');
      setSelectedItem(room);
      setRoomFormData({
        roomNumber: room.roomNumber,
        roomType: room.roomType?._id || '',
        floor: room.floor.toString(),
        currentPrice: room.currentPrice.toString(),
        status: room.status,
      });
      setError(null);
      setShowModal(true);
    } catch (error) {
      console.error('Error loading room data:', error);
      showToast('Failed to load room data', 'error');
    }
  };

  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return;
    }

    try {
      await roomAPI.deleteRoom(roomId);
      showToast('Room deleted successfully', 'success');
      loadData();
    } catch (error) {
      console.error('Error deleting room:', error);
      showToast(error.response?.data?.message || 'Failed to delete room', 'error');
    }
  };

  const handleSaveRoomType = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Validate form data
      if (!formData.name || !formData.basePrice || !formData.maxOccupancy || !formData.squareFeet) {
        showToast('Please fill in all required fields', 'error');
        setSaving(false);
        return;
      }

      const data = {
        ...formData,
        basePrice: parseFloat(formData.basePrice),
        maxOccupancy: parseInt(formData.maxOccupancy),
        squareFeet: parseInt(formData.squareFeet),
      };

      if (modalMode === 'edit' && selectedItem) {
        await roomAPI.updateRoomType(selectedItem._id, data);
        showToast('Room type updated successfully', 'success');
      } else {
        await roomAPI.createRoomType(data);
        showToast('Room type created successfully', 'success');
      }
      
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving room type:', error);
      setError(error.response?.data?.message || 'Failed to save room type');
      showToast(error.response?.data?.message || 'Failed to save room type', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveRoom = async () => {
    setSaving(true);
    setError(null);
    
    try {
      // Validate form data
      if (!roomFormData.roomNumber || !roomFormData.roomType || !roomFormData.floor || !roomFormData.currentPrice) {
        showToast('Please fill in all required fields', 'error');
        setSaving(false);
        return;
      }

      const data = {
        ...roomFormData,
        floor: parseInt(roomFormData.floor),
        currentPrice: parseFloat(roomFormData.currentPrice),
      };

      if (modalMode === 'edit' && selectedItem) {
        await roomAPI.updateRoom(selectedItem._id, data);
        showToast('Room updated successfully', 'success');
      } else {
        await roomAPI.createRoom(data);
        showToast('Room created successfully', 'success');
      }
      
      setShowModal(false);
      loadData();
    } catch (error) {
      console.error('Error saving room:', error);
      setError(error.response?.data?.message || 'Failed to save room');
      showToast(error.response?.data?.message || 'Failed to save room', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateRoomStatus = async (roomId, newStatus) => {
    // Optimistic update
    const oldRooms = [...rooms];
    setRooms(rooms.map(room => 
      room._id === roomId ? { ...room, status: newStatus } : room
    ));

    try {
      await roomAPI.updateRoomStatus(roomId, newStatus);
      showToast('Room status updated successfully', 'success');
    } catch (error) {
      // Rollback on error
      setRooms(oldRooms);
      console.error('Error updating room status:', error);
      showToast(error.response?.data?.message || 'Failed to update room status', 'error');
    }
  };

  const addAmenity = () => {
    const amenity = prompt('Enter amenity name:');
    if (amenity) {
      setFormData({ ...formData, amenities: [...formData.amenities, amenity] });
    }
  };

  const addFeature = () => {
    const feature = prompt('Enter feature name:');
    if (feature) {
      setFormData({ ...formData, features: [...formData.features, feature] });
    }
  };

  const addImage = () => {
    const url = prompt('Enter image URL:');
    const alt = prompt('Enter image description:');
    if (url && alt) {
      setFormData({ ...formData, images: [...formData.images, { url, alt }] });
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
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif text-[#2a2a2a]">Room Management</h2>
        <div className="flex gap-3">
          <button
            onClick={() => setActiveView('types')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'types'
                ? 'bg-[#B8860B] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Room Types
          </button>
          <button
            onClick={() => setActiveView('rooms')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeView === 'rooms'
                ? 'bg-[#B8860B] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Rooms
          </button>
        </div>
      </div>

      {/* Room Types View */}
      {activeView === 'types' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">{roomTypes.length} room types</p>
            <button
              onClick={handleCreateRoomType}
              className="flex items-center gap-2 px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Room Type
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {roomTypes.map((type) => (
              <div key={type._id} className="border border-gray-200 rounded-lg p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2a2a2a]">{type.name}</h3>
                    <p className="text-sm text-gray-500">{type.squareFeet} sq ft</p>
                  </div>
                  <span className="text-xl font-bold text-[#B8860B]">₹{type.basePrice.toLocaleString()}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{type.description}</p>
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <span>👥 {type.maxOccupancy} guests</span>
                  <span>🛏️ {type.amenities?.length || 0} amenities</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleViewRoomType(type)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors text-sm"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </button>
                  <button 
                    onClick={() => handleEditRoomType(type)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors text-sm"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteRoomType(type._id)}
                    className="px-3 py-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Rooms View */}
      {activeView === 'rooms' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-gray-600">{rooms.length} rooms</p>
            <button
              onClick={handleCreateRoom}
              className="flex items-center gap-2 px-4 py-2 bg-[#B8860B] text-white rounded-lg hover:bg-[#8B6914] transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Room
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b-2 border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Room #</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Floor</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-semibold">{room.roomNumber}</td>
                    <td className="px-4 py-3">{room.roomType?.name}</td>
                    <td className="px-4 py-3">Floor {room.floor}</td>
                    <td className="px-4 py-3 font-semibold text-[#B8860B]">₹{room.currentPrice.toLocaleString()}</td>
                    <td className="px-4 py-3">
                      <select
                        value={room.status}
                        onChange={(e) => handleUpdateRoomStatus(room._id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          room.status === 'available'
                            ? 'bg-green-100 text-green-800'
                            : room.status === 'occupied'
                            ? 'bg-red-100 text-red-800'
                            : room.status === 'maintenance'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        <option value="available">Available</option>
                        <option value="occupied">Occupied</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="reserved">Reserved</option>
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button 
                          onClick={() => handleEditRoom(room)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded transition-colors"
                          title="Edit room"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteRoom(room._id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete room"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
              <h3 className="text-xl font-serif text-[#2a2a2a]">
                {modalMode === 'create' ? 'Add New' : modalMode === 'edit' ? 'Edit' : 'View'} {activeView === 'types' ? 'Room Type' : 'Room'}
              </h3>
              <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}
              
              {activeView === 'types' ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows="3"
                      disabled={modalMode === 'view'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Base Price (₹)</label>
                      <input
                        type="number"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({ ...formData, basePrice: e.target.value })}
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Max Guests</label>
                      <input
                        type="number"
                        value={formData.maxOccupancy}
                        onChange={(e) => setFormData({ ...formData, maxOccupancy: e.target.value })}
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Size (sq ft)</label>
                      <input
                        type="number"
                        value={formData.squareFeet}
                        onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Amenities</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.amenities.map((amenity, index) => (
                        <span key={index} className="px-3 py-1 bg-[#B8860B]/10 text-[#B8860B] rounded-full text-sm">
                          {amenity}
                        </span>
                      ))}
                    </div>
                    <button onClick={addAmenity} className="text-sm text-[#B8860B] hover:underline">+ Add Amenity</button>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Features</label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {formData.features.map((feature, index) => (
                        <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <button onClick={addFeature} className="text-sm text-[#B8860B] hover:underline">+ Add Feature</button>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Images</label>
                    <div className="space-y-2 mb-2">
                      {formData.images.map((img, index) => (
                        <div key={index} className="text-sm text-gray-600">
                          {img.alt}: {img.url.substring(0, 50)}...
                        </div>
                      ))}
                    </div>
                    <button onClick={addImage} className="text-sm text-[#B8860B] hover:underline">+ Add Image</button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Room Number</label>
                      <input
                        type="text"
                        value={roomFormData.roomNumber}
                        onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Floor</label>
                      <input
                        type="number"
                        value={roomFormData.floor}
                        onChange={(e) => setRoomFormData({ ...roomFormData, floor: e.target.value })}
                        disabled={modalMode === 'view'}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Room Type</label>
                    <select
                      value={roomFormData.roomType}
                      onChange={(e) => setRoomFormData({ ...roomFormData, roomType: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      {roomTypes.map((type) => (
                        <option key={type._id} value={type._id}>
                          {type.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Current Price (₹)</label>
                    <input
                      type="number"
                      value={roomFormData.currentPrice}
                      onChange={(e) => setRoomFormData({ ...roomFormData, currentPrice: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                    <select
                      value={roomFormData.status}
                      onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value })}
                      disabled={modalMode === 'view'}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B8860B] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
                    >
                      <option value="available">Available</option>
                      <option value="occupied">Occupied</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="reserved">Reserved</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowModal(false)}
                  disabled={saving}
                  className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button
                    onClick={activeView === 'types' ? handleSaveRoomType : handleSaveRoom}
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
                        Save
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
