import { useState, useEffect } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { useRouter } from 'next/router';
import { FaArrowLeft } from "react-icons/fa";
import Image from 'next/image';
import ShopSection from "@/Components/layouts/ShopComponent";
// Static graph data
const graphData = [
    { name: "Jan", value: 400 },
    { name: "Feb", value: 300 },
    { name: "Mar", value: 500 },
    { name: "Apr", value: 700 },
    { name: "May", value: 600 },
];

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'];

export default function AdminDashboard() {
    const router = useRouter();
    const [selected, setSelected] = useState("Dashboard");
    const [dashboardData, setDashboardData] = useState({
        paymentDetails: [],
        testDrives: [],
        inventory: [],
        ShopDetails:[]
    });
    const [loading, setLoading] = useState(true);
    const [updatingStatus, setUpdatingStatus] = useState(false);
    const [editableStatuses, setEditableStatuses] = useState({});
    const menuItems = ["Dashboard", "Inventory", "Shop", "Test Drive", "Customer Contact", "Back to Application"];

    useEffect(() => {
        fetchData();
    }, [selected]);

    const fetchData = async () => {
        setLoading(true);
        try {
            if (selected === "Dashboard") {
                const response = await fetch(`/api/dashboard?section=dashboard`);
                const result = await response.json();
                if (result.success) {
                    setDashboardData(prevData => ({
                        ...prevData,
                        paymentDetails: result.data.paymentDetails || [],
                        salesOverview: graphData
                    }));
                }
            } else if (selected === "Test Drive") {
                const response = await fetch(`/api/dashboard?section=testdrive`);
                const result = await response.json();
                if (result.success) {
                    setDashboardData(prevData => ({
                        ...prevData,
                        testDrives: result.data || []
                    }));
                    // Initialize editable statuses
                    const statusObj = {};
                    result.data.forEach(drive => {
                        statusObj[drive.id] = drive.status;
                    });
                    setEditableStatuses(statusObj);
                }
            } 
            else if (selected === "Shop") {
                const response = await fetch(`/api/shopadmin?section=Shop`);
                const result = await response.json();
                if (result.success) {
                    setDashboardData(prevData => ({
                        ...prevData,
                        ShopDetails:  result.data.ShopDetails || []
                    }));
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
            setDashboardData(prevData => ({
                ...prevData,
                [selected.toLowerCase().replace(' ', '')]: []
            }));
        }
        setLoading(false);
    };

    const handleStatusChange = async (id) => {
        setUpdatingStatus(true);
        try {
            const response = await fetch('/api/dashboard', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id,
                    status: editableStatuses[id]
                }),
            });

            const result = await response.json();
            if (result.success) {
                alert("Updated Sucessfully")
                setDashboardData(prevData => ({
                    ...prevData,
                    testDrives: prevData.testDrives.map(drive =>
                        drive.id === id ? { ...drive, status: editableStatuses[id] } : drive
                    )
                }));
            } else {
                // Reset to previous status if update failed
                setEditableStatuses(prev => ({
                    ...prev,
                    [id]: dashboardData.testDrives.find(drive => drive.id === id)?.status
                }));
                alert('Failed to update status. Please try again.');
            }
        } catch (error) {
            console.error('Error updating status:', error);
            alert('Error updating status. Please try again.');
        }
        setUpdatingStatus(false);
    };

    const renderTestDriveSection = () => (
        <div className="bg-white p-5 rounded shadow-md">
            <h2 className="text-lg font-semibold mb-3">Test Drive Appointments</h2>
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-accent text-white">
                        <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                        <th className="border border-gray-300 px-4 py-2">Phone</th>
                        <th className="border border-gray-300 px-4 py-2">City</th>
                        <th className="border border-gray-300 px-4 py-2">Brand</th>
                        <th className="border border-gray-300 px-4 py-2">Model</th>
                        <th className="border border-gray-300 px-4 py-2">Date</th>
                        <th className="border border-gray-300 px-4 py-2">Location</th>
                        <th className="border border-gray-300 px-4 py-2">Status</th>
                        <th className="border border-gray-300 px-4 py-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {dashboardData.testDrives.map((appointment) => (
                        <tr key={appointment.id} className="text-center">
                            <td className="border border-gray-300 px-4 py-2">{appointment.customerName}</td>
                            <td className="border border-gray-300 px-4 py-2">{appointment.phoneNumber}</td>
                            <td className="border border-gray-300 px-4 py-2">{appointment.city}</td>
                            <td className="border border-gray-300 px-4 py-2">{appointment.brand}</td>
                            <td className="border border-gray-300 px-4 py-2">{appointment.model}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                {new Date(appointment.date).toLocaleDateString()}
                            </td>
                            <td className="border border-gray-300 px-4 py-2">{appointment.location}</td>
                            <td className="border border-gray-300 px-4 py-2">
                                <select
                                    value={editableStatuses[appointment.id] || 'Pending'}
                                    onChange={(e) => setEditableStatuses(prev => ({
                                        ...prev,
                                        [appointment.id]: e.target.value
                                    }))}
                                    className="w-full p-1 border rounded"
                                >
                                    {STATUS_OPTIONS.map(status => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </td>
                            <td className="border border-gray-300 px-4 py-2">
                                <button
                                    onClick={() => handleStatusChange(appointment.id)}
                                    disabled={updatingStatus || editableStatuses[appointment.id] === appointment.status}
                                    className={`px-4 py-1 rounded ${editableStatuses[appointment.id] === appointment.status
                                            ? 'bg-gray-300 cursor-not-allowed'
                                            : 'bg-accent hover:bg-red-700 text-white'
                                        }`}
                                >
                                    {updatingStatus ? 'Updating...' : 'Update'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    const renderDashboardSection = () => (
        <>
            <div className="bg-white p-5 rounded shadow-md mb-6">
                <h2 className="text-lg font-semibold mb-3">Sales Overview</h2>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={graphData}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <div className="bg-white p-5 rounded shadow-md">
                <h2 className="text-lg font-semibold mb-3">Payment Details</h2>
                <table className="w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-accent text-white">
                            <th className="border border-gray-300 px-4 py-2">Transaction</th>
                            <th className="border border-gray-300 px-4 py-2">Amount</th>
                            <th className="border border-gray-300 px-4 py-2">Status</th>
                            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                            <th className="border border-gray-300 px-4 py-2">Contact No</th>
                        </tr>
                    </thead>
                    <tbody>
                        {dashboardData.paymentDetails.map((payment) => (
                            <tr key={payment.id} className="text-center">
                                <td className="border border-gray-300 px-4 py-2">{payment.transaction}</td>
                                <td className="border border-gray-300 px-4 py-2">{payment.amount}</td>
                                <td className="border border-gray-300 px-4 py-2">{payment.status}</td>
                                <td className="border border-gray-300 px-4 py-2">{payment.customerName}</td>
                                <td className="border border-gray-300 px-4 py-2">{payment.contact}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    );

    const renderShopSection = () => (
        <ShopSection dashboardData={dashboardData} fetchData={fetchData} />
      );

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-900 text-white p-5">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <div className="space-y-2">
                    {menuItems.map((item) => (
                        <button
                            key={item}
                            className={`w-full text-left px-4 py-2 rounded ${selected === item ? "bg-accent" : "bg-gray-800"}`}
                            onClick={() => {
                                if (item === "Back to Application") {
                                    router.push('/home');
                                } else {
                                    setSelected(item);
                                }
                            }}
                        >
                            <span className="flex items-center">
                                {item === "Back to Application" && <FaArrowLeft className="mr-2" />} {item}
                            </span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="w-3/4 p-6 bg-gray-100 overflow-y-auto">
                <h1 className="text-2xl font-semibold mb-4">{selected}</h1>
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg">Loading...</p>
                    </div>
                ) : (
                    <>
                        {selected === "Dashboard" && renderDashboardSection()}
                        {selected === "Test Drive" && renderTestDriveSection()}
                        {selected === "Shop" && renderShopSection()}
                    </>
                )}
            </div>
        </div>
    );
}