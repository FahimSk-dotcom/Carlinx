import React, { useState, useCallback, memo } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';

// Memoized Modal component to prevent unnecessary re-renders
const Modal = memo(({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-xl font-bold"
          >
            ×
          </button>
        </div>
        {children}
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';

// Memoized FormFields component
const FormFields = memo(({ formData, handleInputChange, handleImageChange, loading, error, showEditModal, onSubmit, buttonText, onDelete }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    {showEditModal && (
      <>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </>
    )}
    
    {/* Hidden default _id field */}
    <input type="hidden" name="_id" value={formData._id} />

    {/* Visible custom item_id field */}
    <div>
      <label className="block text-sm font-medium mb-1">ID</label>
      <input
        type="text"
        name="item_id"
        value={formData.item_id}
        onChange={handleInputChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
    
    <div>
      <label className="block text-sm font-medium mb-1">Name</label>
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Description</label>
      <textarea
        name="description"
        value={formData.description}
        onChange={handleInputChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Price (₹)</label>
      <input
        type="number"
        name="price"
        value={formData.price}
        onChange={handleInputChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Stock</label>
      <input
        type="number"
        name="stock"
        value={formData.stock}
        onChange={handleInputChange}
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-1">Image</label>
      <input
        type="file"
        onChange={handleImageChange}
        accept="image/*"
        className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
    
    {error && (
      <div className="text-red-500 text-sm mt-2">{error}</div>
    )}
    
    <div className="flex gap-4">
      <button
        type="submit"
        disabled={loading}
        className="flex-1 bg-accent text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Processing...' : buttonText}
      </button>

      {showEditModal && (
        <button
          type="button"
          onClick={onDelete}
          className="flex-1 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          <Trash2 size={16} /> Delete Item
        </button>
      )}
    </div>
  </form>
));

FormFields.displayName = 'FormFields';

const ShopSection = ({ dashboardData = { ShopDetails: [] }, fetchData }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    id: '',
    status: 'active',
    name: '',
    description: '',
    price: '',
    stock: '',
    image: null
  });

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleImageChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('Selected file:', file);

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select an image file');
        return;
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));
    }
  }, []);

  const openEditModal = useCallback((item) => {
    setSelectedItem(item);
    setFormData({
      id: item.id,
      item_id : item.item_id,
      status: item.status || 'active',
      name: item.name,
      description: item.description || '',
      price: String(item.price).replace('₹', '').replace(/,/g, ''),
      stock: String(item.stock || ''),
      image: null
    });
    setShowEditModal(true);
  }, []);

  const handleEditItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.id || !formData.status) {
      setError('ID and status are required');
      setLoading(false);
      return;
    }

    const formDataToSend = new FormData();
    Object.keys(formData).forEach(key => {
      if (formData[key] !== null) {
        formDataToSend.append(key, formData[key]);
      }
    });

    try {
      const response = await fetch('/api/shopadmin?section=Shop', {
        method: 'PUT',
        body: formDataToSend
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update item');
      }

      setShowEditModal(false);
      setSelectedItem(null);
      if (fetchData) await fetchData();
    } catch (error) {
      console.error('Error updating item:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();

      // Append form fields
      formDataToSend.append('id', formData.id.toString());
      formDataToSend.append('item_id', formData.item_id.toString());
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', formData.price.toString());
      formDataToSend.append('stock', formData.stock.toString());
      formDataToSend.append('status', formData.status);

      // Append image if it exists
      if (formData.image) {
        console.log('Appending image:', formData.image);
        formDataToSend.append('image', formData.image);
      }

      // Log the FormData contents
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      const response = await fetch('/api/shopadmin?section=Shop', {
        method: 'POST',
        body: formDataToSend,
      });
      console.log(formData)
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to add item');
      }

      console.log('Success response:', data);

      if (data.imgPath) {
        console.log('Image was successfully uploaded:', data.imgPath);
      }

      setShowAddModal(false);
      setFormData({
        id: '',
        item_id : '',
        status: 'active',
        name: '',
        description: '',
        price: '',
        stock: '',
        image: null
      });

      if (fetchData) await fetchData();
    } catch (error) {
      console.error('Error adding item:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handleDeleteItem = async () => {
    setLoading(true);
    setError(null);

    const formDataToSend = new FormData();
    formDataToSend.append('id', selectedItem.id);

    try {
      const response = await fetch('/api/shopadmin?section=Shop', {
        method: 'DELETE',
        body: formDataToSend
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete item');
      }

      setShowDeleteConfirmModal(false);
      setShowEditModal(false);
      setSelectedItem(null);
      if (fetchData) await fetchData();
    } catch (error) {
      console.error('Error deleting item:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const closeAddModal = useCallback(() => {
    setShowAddModal(false);
    setFormData({
      id: '',
      status: 'active',
      name: '',
      description: '',
      price: '',
      stock: '',
      image: null
    });
    setError(null);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedItem(null);
    setError(null);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Shop Details</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
        >
          <Plus size={16} /> Add New Item
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-accent text-white">
              <th className="border border-gray-300 px-4 py-2">Image</th>
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Description</th>
              <th className="border border-gray-300 px-4 py-2">Price</th>
              <th className="border border-gray-300 px-4 py-2">Stock</th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {dashboardData.ShopDetails.map((item) => (
              <tr key={item.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">
                  <img
                    src={item.img || '/api/placeholder/100/80'}
                    alt={item.name}
                    className="w-24 h-20 object-cover rounded mx-auto"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                <td className="border border-gray-300 px-4 py-2">{item.description}</td>
                <td className="border border-gray-300 px-4 py-2">{item.price}</td>
                <td className="border border-gray-300 px-4 py-2">{item.stock}</td>
                <td className="border border-gray-300 px-4 py-2">{item.status || 'active'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <button
                    onClick={() => openEditModal(item)}
                    className="bg-accent text-white px-3 py-1 rounded flex items-center gap-1 mx-auto hover:bg-gray-800"
                  >
                    <Edit size={14} /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={showAddModal}
        onClose={closeAddModal}
        title="Add New Shop Item"
      >
        <FormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          loading={loading}
          error={error}
          showEditModal={false}
          onSubmit={handleAddItem}
          buttonText="Add Item"
        />
      </Modal>

      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title="Edit Shop Item"
      >
        <FormFields
          formData={formData}
          handleInputChange={handleInputChange}
          handleImageChange={handleImageChange}
          loading={loading}
          error={error}
          showEditModal={true}
          onSubmit={handleEditItem}
          buttonText="Update Item"
          onDelete={() => setShowDeleteConfirmModal(true)}
        />
      </Modal>

      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this item? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowDeleteConfirmModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteItem}
              disabled={loading}
              className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:bg-gray-400"
            >
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ShopSection;