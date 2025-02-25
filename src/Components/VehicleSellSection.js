import React, { useState, useCallback, memo } from 'react';
import { Edit, Eye, Trash2, Mail } from 'lucide-react';

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

// Vehicle Details View Component
const VehicleDetails = memo(({ vehicle }) => (
  <div className="space-y-4">
    <div className="flex flex-col items-center mb-4">
      <img
        src={vehicle.img || '/api/placeholder/300/200'}
        alt={`${vehicle.brand} ${vehicle.model}`}
        className="w-full max-h-48 object-cover rounded mb-2"
      />
      <h3 className="text-lg font-bold">{vehicle.brand} {vehicle.model} {vehicle.variant}</h3>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <div>
        <p className="text-sm font-semibold">Seller Information</p>
        <p className="text-sm">Name: {vehicle.name}</p>
        <p className="text-sm">Phone: {vehicle.phone}</p>
        {vehicle.email && <p className="text-sm">Email: {vehicle.email}</p>}
      </div>
      <div>
        <p className="text-sm font-semibold">Vehicle Information</p>
        <p className="text-sm">RTO Location: {vehicle.rLoc}</p>
        <p className="text-sm">Manufacturing Year: {vehicle.mYear}</p>
        <p className="text-sm">Fuel Type: {vehicle.fuel}</p>
      </div>
    </div>

    <div>
      <p className="text-sm font-semibold">Additional Details</p>
      <p className="text-sm">Kilometers Driven: {vehicle.km}</p>
      <p className="text-sm">Owner: {vehicle.owner}</p>
      <p className="text-sm">Request Date: {vehicle.date}</p>
    </div>

    <div>
      <p className="text-sm font-semibold">Description</p>
      <p className="text-sm">{vehicle.description || 'No description provided'}</p>
    </div>
    <div>
      <p className="text-sm font-semibold">AdminResponse</p>
      <p className="text-sm">{vehicle.status || 'No adminStatus provided'}</p>
      <p className="text-sm">{vehicle.adminresposne || 'No adminResponse provided'}</p>
    </div>
  </div>
  
));

VehicleDetails.displayName = 'VehicleDetails';

// Memoized Response Form component
const ResponseForm = memo(({ vehicleId, onSubmit, loading, error, emailAvailable }) => {
  const [response, setResponse] = useState('');
  const [status, setStatus] = useState('pending');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ vehicleId, response, status });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          required
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">Response Message</label>
        <textarea
          value={response}
          onChange={(e) => setResponse(e.target.value)}
          className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-h-32"
          placeholder="Enter your response to the seller"
          required
        />
      </div>

      {emailAvailable === false && (
        <div className="bg-yellow-100 p-3 rounded text-sm text-yellow-800 flex items-center gap-2">
          <Mail size={16} />
          <span>No email available for this seller. They will not receive email notification.</span>
        </div>
      )}
      
      {error && (
        <div className="text-red-500 text-sm mt-2">{error}</div>
      )}
      
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-accent text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Sending...' : 'Send Response'}
      </button>
    </form>
  );
});

ResponseForm.displayName = 'ResponseForm';

const VehicleSellSection = ({ dashboardData = { sell_req: [] }, fetchData }) => {
  const [showViewModal, setShowViewModal] = useState(false);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [showDeleteConfirmModal, setShowDeleteConfirmModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [responseSuccess, setResponseSuccess] = useState(false);

  const openViewModal = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setShowViewModal(true);
  }, []);

  const openResponseModal = useCallback((vehicle) => {
    setSelectedVehicle(vehicle);
    setShowResponseModal(true);
    setResponseSuccess(false);
  }, []);

  const closeViewModal = useCallback(() => {
    setShowViewModal(false);
    setSelectedVehicle(null);
  }, []);

  const closeResponseModal = useCallback(() => {
    setShowResponseModal(false);
    setSelectedVehicle(null);
    setError(null);
    setResponseSuccess(false);
  }, []);

  const handleSendResponse = async (formData) => {
    setLoading(true);
    setError(null);
    setResponseSuccess(false);

    // Create a FormData object to match the API expectation
    const formDataToSend = new FormData();
    formDataToSend.append('vehicleId', formData.vehicleId);
    formDataToSend.append('status', formData.status);
    formDataToSend.append('response', formData.response);

    try {
      const response = await fetch('/api/selladmin?section=sellrequest', {
        method: 'PUT',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send response');
      }

      setResponseSuccess(true);
      // Auto close after success message shows
      setTimeout(() => {
        setShowResponseModal(false);
        setSelectedVehicle(null);
        if (fetchData) fetchData();
      }, 2000);
    } catch (error) {
      console.error('Error sending response:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  const handleDeleteRequest = async () => {
    setLoading(true);
    setError(null);

    // Create a FormData object to match the API expectation
    const formDataToSend = new FormData();
    formDataToSend.append('id', selectedVehicle.id);

    try {
      const response = await fetch('/api/selladmin?section=sellrequest', {
        method: 'DELETE',
        body: formDataToSend
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete request');
      }

      setShowDeleteConfirmModal(false);
      setShowViewModal(false);
      setSelectedVehicle(null);
      if (fetchData) await fetchData();
    } catch (error) {
      console.error('Error deleting request:', error);
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Vehicle Sell Requests</h2>
      </div>
      {dashboardData.sell_req.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No vehicle sell requests available
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-accent text-white">
                <th className="border border-gray-300 px-4 py-2">ID</th>
                <th className="border border-gray-300 px-4 py-2">Seller</th>
                <th className="border border-gray-300 px-4 py-2">Vehicle</th>
                <th className="border border-gray-300 px-4 py-2">Year</th>
                <th className="border border-gray-300 px-4 py-2">KM Driven</th>
                <th className="border border-gray-300 px-4 py-2">Fuel</th>
                <th className="border border-gray-300 px-4 py-2">Owner</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Status</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {dashboardData.sell_req.map((vehicle) => (
                <tr key={vehicle.id} className="text-center">
                  <td className="border border-gray-300 px-4 py-2">{vehicle.item_id}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.name}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.brand} {vehicle.model}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.mYear}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.km}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.fuel}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.owner}</td>
                  <td className="border border-gray-300 px-4 py-2">{vehicle.date}</td>
                  <td className="border border-gray-300 px-4 py-2">
                    <span className={`px-2 py-1 rounded text-xs text-white ${
                      vehicle.status === 'approved' ? 'bg-green-500' : 
                      vehicle.status === 'rejected' ? 'bg-red-500' : 
                      vehicle.status === 'completed' ? 'bg-blue-500' : 
                      'bg-yellow-500'
                    }`}>
                      {vehicle.status ? vehicle.status.charAt(0).toUpperCase() + vehicle.status.slice(1) : 'Pending'}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => openViewModal(vehicle)}
                        className="bg-blue-500 text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-blue-600"
                      >
                        <Eye size={14} /> View
                      </button>
                      <button
                        onClick={() => openResponseModal(vehicle)}
                        className="bg-accent text-white px-2 py-1 rounded flex items-center gap-1 hover:bg-gray-800"
                      >
                        <Edit size={14} /> Respond
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={showViewModal}
        onClose={closeViewModal}
        title="Vehicle Details"
      >
        {selectedVehicle && (
          <div className="space-y-4">
            <VehicleDetails vehicle={selectedVehicle} />
            <div className="flex justify-end gap-4 mt-4">
              <button
                onClick={() => setShowDeleteConfirmModal(true)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
              >
                <div className="flex items-center gap-2">
                  <Trash2 size={16} /> Delete Request
                </div>
              </button>
              <button
                onClick={() => {
                  closeViewModal();
                  openResponseModal(selectedVehicle);
                }}
                className="px-4 py-2 bg-accent text-white rounded hover:bg-gray-800"
              >
                <div className="flex items-center gap-2">
                  <Edit size={16} /> Respond
                </div>
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={showResponseModal}
        onClose={closeResponseModal}
        title="Respond to Seller"
      >
        {selectedVehicle && (
          <>
            {responseSuccess ? (
              <div className="bg-green-100 p-4 rounded text-center">
                <div className="text-green-600 text-xl mb-2">✓</div>
                <p className="text-green-800 font-semibold">Response sent successfully!</p>
                {selectedVehicle.email ? (
                  <p className="text-green-700 text-sm mt-2">An email notification has been sent to the seller.</p>
                ) : (
                  <p className="text-yellow-700 text-sm mt-2">No email was available to send a notification.</p>
                )}
              </div>
            ) : (
              <ResponseForm
                vehicleId={selectedVehicle.id}
                onSubmit={handleSendResponse}
                loading={loading}
                error={error}
                emailAvailable={!!selectedVehicle.email}
              />
            )}
          </>
        )}
      </Modal>

      <Modal
        isOpen={showDeleteConfirmModal}
        onClose={() => setShowDeleteConfirmModal(false)}
        title="Confirm Delete"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Are you sure you want to delete this vehicle sell request? This action cannot be undone.</p>
          <div className="flex justify-end gap-4">
            <button
              onClick={() => setShowDeleteConfirmModal(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteRequest}
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

export default VehicleSellSection;