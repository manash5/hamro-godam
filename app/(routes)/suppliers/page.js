"use client";

import { useEffect, useState } from "react";
import { Search, Plus, MoreHorizontal } from "lucide-react";
import Sidebar from "@/components/sidebar";
import AddSupplierModal from "@/components/supplier/AddSupplierModal";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    const res = await fetch("/api/supplier");
    const data = await res.json();
    if (res.ok && data.data) {
      setSuppliers(data.data);
    }
  };

  useEffect(() => {
    const filtered = suppliers.filter((supplier) => {
      const matchSearch =
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        supplier.contact_number.includes(searchTerm);

      const matchCategory =
        categoryFilter === "All Categories" || supplier.category === categoryFilter;

      return matchSearch && matchCategory;
    });
    setFilteredSuppliers(filtered);
  }, [searchTerm, categoryFilter, suppliers]);

  const handleSave = async (data) => {
    const method = editingSupplier ? "PUT" : "POST";
    const endpoint = editingSupplier ? `/api/supplier/${editingSupplier._id}` : "/api/supplier";

    const res = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    if (res.ok) {
      fetchSuppliers();
      setShowModal(false);
      setEditingSupplier(null);
    } else {
      console.error("Error saving supplier:", result.error);
    }
  };

  return (
    <div className="flex h-screen bg-slate-100 text-black">
      <Sidebar />
      <div className="flex-1 overflow-auto py-10">
        <div className="bg-slate-100 px-6 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your suppliers</p>
          </div>
          <button
            onClick={() => {
              setEditingSupplier(null);
              setShowModal(true);
            }}
            className="bg-blue-900 hover:bg-blue-800 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={18} /> Add Supplier
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white px-6 py-4 border-b border-gray-200 rounded-md mx-5">
          <div className="flex items-center gap-4 text-gray-600">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
            >
              <option>All Categories</option>
              {[...new Set(suppliers.map((s) => s.category))].map((cat) => (
                <option key={cat}>{cat}</option>
              ))}
            </select>
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search suppliers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white m-5 rounded-md overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Phone</th>
                <th className="py-3 px-4 text-left">PAN</th>
                <th className="py-3 px-4 text-left">Category</th>
                <th className="py-3 px-4 text-left">Company</th>
                <th className="py-3 px-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredSuppliers.map((supplier) => (
                <tr key={supplier._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4">{supplier.name}</td>
                  <td className="py-3 px-4">{supplier.email}</td>
                  <td className="py-3 px-4">{supplier.contact_number}</td>
                  <td className="py-3 px-4">{supplier.pan_number}</td>
                  <td className="py-3 px-4">{supplier.category}</td>
                  <td className="py-3 px-4">{supplier.company_name}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => {
                        setEditingSupplier(supplier);
                        setShowModal(true);
                      }}
                      className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                      <MoreHorizontal size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AddSupplierModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSupplier(null);
        }}
        onSave={handleSave}
        existingSupplier={editingSupplier}
      />
    </div>
  );
}
