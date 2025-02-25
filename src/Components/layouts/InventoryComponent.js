import React, { useState, useCallback, memo } from 'react';
import { Plus, Edit, Trash2, Star } from 'lucide-react';

const Modal = memo(({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-lg p-6 w-full max-w-2xl my-8">
                <div className="flex justify-between items-center mb-4 sticky top-0 bg-white">
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700 text-xl font-bold"
                    >
                        ×
                    </button>
                </div>
                <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
});

Modal.displayName = 'Modal';

const FormFields = memo(({ formData, handleInputChange, handleImageChange, loading, error, showEditModal, onSubmit, buttonText, onDelete }) => (
    <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input type="hidden" name="id" value={formData.id} />
            <div>
                <label className="block text-sm font-medium mb-1">ID</label>
                <input
                    type="number"
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
                <label className="block text-sm font-medium mb-1">Price ($)</label>
                <input
                    type="text"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Model Year</label>
                <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Condition</label>
                <select
                    name="condition"
                    value={formData.condition}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="New">New</option>
                    <option value="Used">Used</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Transmission</label>
                <select
                    name="transmission"
                    value={formData.transmission}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Mileage</label>
                <input
                    type="text"
                    name="mileage"
                    value={formData.mileage}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Fuel Type</label>
                <select
                    name="fuel"
                    value={formData.fuel}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                >
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Electric">Electric</option>
                    <option value="Hybrid">Hybrid</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <input
                    type="number"
                    name="rating"
                    value={formData.rating}
                    onChange={handleInputChange}
                    min="0"
                    max="5"
                    step="0.5"
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Reviews</label>
                <input
                    type="text"
                    name="reviews"
                    value={formData.reviews}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                />
            </div>
        </div>

        <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={4}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
            />
        </div>

        <div className="col-span-full">
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

        <div className="flex gap-4 pt-4">
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
                    <Trash2 size={16} /> Delete Car
                </button>
            )}
        </div>
    </form>
));

FormFields.displayName = 'FormFields';



const InventorySection = ({ dashboardData = { inventory: [] }, fetchData }) => {
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        item_id :'',
        name: '',
        description: '',
        price: '',
        image: null,
        rating: '',
        reviews: '',
        condition: 'Used',
        transmission: 'Manual',
        mileage: '',
        model: '',
        fuel: 'Diesel'
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
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }

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
            item_id : item.item_id || '',
            name: item.name,
            description: item.description || '',
            price: item.price,
            rating: item.rating,
            reviews: item.reviews,
            condition: item.condition,
            transmission: item.transmission,
            mileage: item.mileage,
            model: item.model,
            fuel: item.fuel,
            image: null
        });
        setShowEditModal(true);
    }, []);

    // Rest of the component remains the same, just update the API endpoint
    const handleEditItem = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formDataToSend = new FormData();
        Object.keys(formData).forEach(key => {
            if (formData[key] !== null) {
                formDataToSend.append(key, formData[key]);
            }
        });

        try {
            const response = await fetch('/api/inventoryadmin?section=Inventory', {
                method: 'PUT',
                body: formDataToSend
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to update car');
            }

            setShowEditModal(false);
            setSelectedItem(null);
            if (fetchData) await fetchData();
        } catch (error) {
            console.error('Error updating car:', error);
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
            Object.keys(formData).forEach(key => {
                if (formData[key] !== null) {
                    formDataToSend.append(key, formData[key]);
                }
            });

            const response = await fetch('/api/inventoryadmin?section=Inventory', {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to add car');
            }

            setShowAddModal(false);
            setFormData({
                id: '',
                name: '',
                description: '',
                price: '',
                image: null,
                rating: '',
                reviews: '',
                condition: 'Used',
                transmission: 'Manual',
                mileage: '',
                model: '',
                fuel: 'Diesel'
            });

            if (fetchData) await fetchData();
        } catch (error) {
            console.error('Error adding car:', error);
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
            const response = await fetch('/api/inventoryadmin?section=Inventory', {
                method: 'DELETE',
                body: formDataToSend
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to delete car');
            }

            setShowDeleteConfirmModal(false);
            setShowEditModal(false);
            setSelectedItem(null);
            if (fetchData) await fetchData();
        } catch (error) {
            console.error('Error deleting car:', error);
            setError(error.message);
        }
        setLoading(false);
    };

    const closeAddModal = useCallback(() => {
        setShowAddModal(false);
        setFormData({
            id: '',
            name: '',
            description: '',
            price: '',
            image: null,
            rating: '',
            reviews: '',
            condition: 'Used',
            transmission: 'Manual',
            mileage: '',
            model: '',
            fuel: 'Diesel'
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
                <h2 className="text-xl font-semibold">Car Inventory</h2>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="bg-accent text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-800"
                >
                    <Plus size={16} /> Add New Car
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-accent text-white">
                            <th className="border border-gray-300 px-4 py-2">Image</th>
                            <th className="border border-gray-300 px-4 py-2">Name</th>
                            <th className="border border-gray-300 px-4 py-2">Price</th>
                            <th className="border border-gray-300 px-4 py-2">Model</th>
                            <th className="border border-gray-300 px-4 py-2">Condition</th>
                            <th className="border border-gray-300 px-4 py-2">Rating</th>
                            <th className="border border-gray-300 px-4 py-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.inventory.map((item) => (
                            <tr key={item.id} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">
                                    <img
                                        src={item.image || '/api/placeholder/100/80'}
                                        alt={item.name}
                                        className="w-24 h-20 object-cover rounded mx-auto"
                                    />
                                </td>
                                <td className="border border-gray-300 px-4 py-2">{item.name}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.price}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.model}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.condition}</td>
                                <td className="border border-gray-300 px-4 py-2">
                                    <div className="flex items-center justify-center gap-1">
                                        <Star size={16} className="text-yellow-400 fill-yellow-400" />
                                        <span>{item.rating}</span>
                                        <span className="text-gray-500 text-sm">({item.reviews})</span>
                                    </div>
                                </td>
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
                title="Add New Car"
            >
                <FormFields
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleImageChange={handleImageChange}
                    loading={loading}
                    error={error}
                    showEditModal={false}
                    onSubmit={handleAddItem}
                    buttonText="Add Car"
                />
            </Modal>

            <Modal
                isOpen={showEditModal}
                onClose={closeEditModal}
                title="Edit Car Details"
            >
                <FormFields
                    formData={formData}
                    handleInputChange={handleInputChange}
                    handleImageChange={handleImageChange}
                    loading={loading}
                    error={error}
                    showEditModal={true}
                    onSubmit={handleEditItem}
                    buttonText="Update Car"
                    onDelete={() => setShowDeleteConfirmModal(true)}
                />
            </Modal>

            <Modal
                isOpen={showDeleteConfirmModal}
                onClose={() => setShowDeleteConfirmModal(false)}
                title="Confirm Delete"
            >
                <div className="space-y-4">
                    <p className="text-gray-700">Are you sure you want to delete this car? This action cannot be undone.</p>
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

export default InventorySection;