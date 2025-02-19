import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 700 },
  { name: "May", value: 600 },
];

const payments = [
  { id: 1, transaction: "Transaction 1", amount: "$200", status: "Completed", customerName: "Shaikh Fahim", contact: "8976946230" },
  { id: 2, transaction: "Transaction 2", amount: "$450", status: "Pending", customerName: "John Doe", contact: "9876543210" },
  { id: 3, transaction: "Transaction 3", amount: "$300", status: "Failed", customerName: "Jane Smith", contact: "8765432109" },
];

export default function AdminDashboard() {
  const [selected, setSelected] = useState("Dashboard");
  const menuItems = ["Dashboard", "Inventory", "Shop", "Test Drive", "Customer Contact"];

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 bg-gray-900 text-white p-5">
        <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item}
              className={`w-full text-left px-4 py-2 rounded ${selected === item ? "bg-blue-500" : "bg-gray-800"}`}
              onClick={() => setSelected(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="w-3/4 p-6 bg-gray-100">
        <h1 className="text-2xl font-semibold mb-4">{selected}</h1>
        {selected === "Dashboard" && (
          <>
            {/* Graph Section */}
            <div className="bg-white p-5 rounded shadow-md mb-6">
              <h2 className="text-lg font-semibold mb-3">Sales Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            
            {/* Payment Details Section */}
            <div className="bg-white p-5 rounded shadow-md">
              <h2 className="text-lg font-semibold mb-3">Payment Details</h2>
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-200">
                    <th className="border border-gray-300 px-4 py-2">Transaction</th>
                    <th className="border border-gray-300 px-4 py-2">Amount</th>
                    <th className="border border-gray-300 px-4 py-2">Status</th>
                    <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                    <th className="border border-gray-300 px-4 py-2">Contact No</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment) => (
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
        )}
      </div>
    </div>
  );
}
