import { useState } from 'react';

const CustomerSection = ({ dashboardData, fetchData }) => {
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', dob: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState(null); // Holds success/failure messages
  const [messageType, setMessageType] = useState('success'); // 'success', 'error', or 'warning'
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState(null);

  let customers = [];
  if (
    dashboardData &&
    dashboardData.customers_data &&
    dashboardData.customers_data.Customer &&
    Array.isArray(dashboardData.customers_data.Customer)
  ) {
    customers = dashboardData.customers_data.Customer;
  }

  // Filter customers based on search term
  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const showMessage = (msg, type = 'success') => {
    // Clear any existing message first
    setMessage(null);
    
    // Use setTimeout to ensure state updates properly
    setTimeout(() => {
      setMessage(msg);
      setMessageType(type);
    }, 10);
    
    // Auto-hide after 5 seconds (increased from 3)
    setTimeout(() => setMessage(null), 5000);
  };

  const handleEditClick = (customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name || '',
      email: customer.email || '',
      dob: customer.dob || ''
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/customeradmin', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editingCustomer.id, ...formData }),
      });

      const result = await response.json();
      if (result.success) {
        // Update data first, then show message
        await fetchData();
        setEditingCustomer(null);
        showMessage("Customer updated successfully ✅");
      } else {
        showMessage("Failed to update customer ❌", "error");
      }
    } catch (error) {
      showMessage("Error updating customer ❌", "error");
      console.error(error);
    }
  };

  const initiateDelete = (customer) => {
    setCustomerToDelete(customer);
    setShowConfirmation(true);
  };

  const confirmDelete = async () => {
    if (!customerToDelete) return;
    
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/customeradmin?id=${customerToDelete.id}`, { method: 'DELETE' });
      const result = await response.json();
      
      // Always close confirmation dialog first
      setShowConfirmation(false);
      setCustomerToDelete(null);
      setIsDeleting(false);
      
      if (result.success) {        
        showMessage("Customer deleted successfully ✅");
        await fetchData();
      } else {
        showMessage("Failed to delete customer ❌", "error");
      }
    } catch (error) {
      setShowConfirmation(false);
      setCustomerToDelete(null);
      setIsDeleting(false);
      showMessage("Error deleting customer ❌", "error");
      console.error(error);
    }
  };

  const cancelDelete = () => {
    setShowConfirmation(false);
    setCustomerToDelete(null);
  };

  // Get message background color based on type
  const getMessageClass = () => {
    switch (messageType) {
      case 'success':
        return 'bg-green-100 text-green-800 border-green-400';
      case 'error':
        return 'bg-red-100 text-red-800 border-red-400';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-400';
      default:
        return 'bg-green-100 text-green-800 border-green-400';
    }
  };

  return (
    <div className="bg-white p-5 rounded shadow-md relative">
      {/* Message Box - Positioned more prominently */}
      {message && (
        <div 
          className={`mb-4 p-3 ${getMessageClass()} border rounded flex justify-between items-center sticky top-0 z-10`}
        >
          <span>{message}</span>
          <button 
            onClick={() => setMessage(null)} 
            className="text-sm font-bold"
          >
            ×
          </button>
        </div>
      )}

      {/* Confirmation Dialog */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete customer <span className="font-semibold">{customerToDelete?.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Customer Management</h2>
        <input
          type="text"
          placeholder="Search customers..."
          className="border rounded p-2"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {editingCustomer ? (
        <div className="bg-gray-100 p-4 rounded mb-4">
          <h3 className="text-lg font-medium mb-3">Edit Customer</h3>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <button type="submit" className="bg-accent hover:bg-blue-700 text-white px-4 py-2 rounded">
                Save Changes
              </button>
              <button type="button" onClick={() => setEditingCustomer(null)} className="bg-gray-300 hover:bg-gray-400 px-4 py-2 rounded">
                Cancel
              </button>
            </div>
          </form>
        </div>
      ) : null}

      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-accent text-white">
            <th className="border border-gray-300 px-4 py-2">Name</th>
            <th className="border border-gray-300 px-4 py-2">Email</th>
            <th className="border border-gray-300 px-4 py-2">Date of Birth</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCustomers.length > 0 ? (
            filteredCustomers.map((customer) => (
              <tr key={customer.id} className="text-center">
                <td className="border border-gray-300 px-4 py-2">{customer.name || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">{customer.email || 'N/A'}</td>
                <td className="border border-gray-300 px-4 py-2">
                  {customer.dob ? new Date(customer.dob).toLocaleDateString() : 'N/A'}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEditClick(customer)}
                      className="bg-accent hover:bg-blue-700 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => initiateDelete(customer)}
                      className="bg-red-500  text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="border border-gray-300 px-4 py-4 text-center">
                {searchTerm ? 'No matching customers found.' : 'No customers found.'}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerSection;