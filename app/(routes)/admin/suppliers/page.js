"use client";

import { useEffect, useState } from "react";
import { Search, Plus, Edit3, Trash2, Package, Phone, Mail, Building, Tag, Eye, X } from "lucide-react";
import Sidebar from "@/components/sidebar";
import AddSupplierModal from "@/components/supplier/AddSupplierModal";

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [showModal, setShowModal] = useState(false);
  const [editingSupplier, setEditingSupplier] = useState(null);
  const [viewingProducts, setViewingProducts] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch suppliers from API
  const fetchSuppliers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch("/api/supplier", {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setSuppliers(data.data);
      } else {
        setSuppliers([]);
      }
    } catch (err) {
      setSuppliers([]);
      console.error("Failed to fetch suppliers:", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  useEffect(() => {
    const filtered = suppliers.filter((supplier) => {
      const matchSearch =
        (supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) || "") ||
        (supplier.contact_number?.toString().includes(searchTerm) || "");

      const matchCategory =
        categoryFilter === "All Categories" || supplier.category === categoryFilter;

      return matchSearch && matchCategory;
    });
    setFilteredSuppliers(filtered);
  }, [searchTerm, categoryFilter, suppliers]);

  const handleSave = async (data) => {
    const allowedFields = ['name', 'email', 'contact_number', 'address', 'category', 'company_name'];
    const filteredData = Object.fromEntries(Object.entries(data).filter(([key]) => allowedFields.includes(key)));
    const method = editingSupplier ? "PUT" : "POST";
    const endpoint = editingSupplier ? `/api/supplier/${editingSupplier._id}` : "/api/supplier";
    const token = localStorage.getItem('token');
    const res = await fetch(endpoint, {
      method,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(filteredData),
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

  const handleDelete = async (supplierId) => {
    if (window.confirm('Are you sure you want to delete this supplier?')) {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/supplier/${supplierId}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (res.ok) {
        fetchSuppliers();
      } else {
        console.error("Error deleting supplier");
      }
    }
  };

  const handleViewProducts = (supplier) => {
    setViewingProducts(supplier);
  };

  // Products Modal Component
  const ProductsModal = ({ supplier, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Products from {supplier.name} ({supplier.company_name})
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X size={24} />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Product Name</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Quantity</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Last Supplied</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {supplier.products && supplier.products.length > 0 ? (
                supplier.products.map((product, index) => (
                  <tr key={product.id || index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 border-b border-gray-200">{product.name}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{product.quantity}</td>
                    <td className="px-4 py-3 border-b border-gray-200">{product.lastSupplied}</td>
                    <td className="px-4 py-3 border-b border-gray-200">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">Edit</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-4 py-8 text-center text-gray-500">
                    No products found for this supplier
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-gray-600">
            Total Products: {supplier.products ? supplier.products.length : 0}
          </p>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Add New Product
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-slate-100 text-black">
      <Sidebar />
      <div className="flex-1 overflow-auto py-10">
        <div className="bg-slate-100 px-6 py-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Suppliers</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your suppliers and their products</p>
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
        <div className="bg-white px-6 py-4 border-b border-gray-200 rounded-md mx-5 shadow-sm">
          <div className="flex items-center gap-4 text-gray-600">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Enhanced Table */}
        <div className="bg-white m-5 rounded-md overflow-x-auto shadow-sm">
          {loading ? (
            <div className="text-center py-12 text-gray-500">Loading suppliers...</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Products</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredSuppliers.map((supplier) => (
                  <tr key={supplier.id || supplier._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{supplier.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Mail size={14} className="text-gray-400" />
                        {supplier.email}
                      </div>
                      <div className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone size={14} className="text-gray-400" />
                        {supplier.contact_number}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        <Tag size={12} className="mr-1" />
                        {supplier.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center gap-1">
                        <Building size={14} className="text-gray-400" />
                        {supplier.company_name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <Package size={16} className="text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {supplier.products ? supplier.products.length : 0}
                        </span>
                        <button
                          onClick={() => handleViewProducts(supplier)}
                          className="text-blue-600 hover:text-blue-800 text-sm flex items-center gap-1"
                        >
                          <Eye size={14} />
                          View All
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setEditingSupplier(supplier);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                          title="Edit supplier"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(supplier.id || supplier._id)}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Delete supplier"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          {!loading && filteredSuppliers.length === 0 && (
            <div className="text-center py-12">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No suppliers found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || categoryFilter !== "All Categories"
                  ? "Try adjusting your search or filters"
                  : "Get started by adding your first supplier"}
              </p>
              <button
                onClick={() => {
                  setEditingSupplier(null);
                  setShowModal(true);
                }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 mx-auto"
              >
                <Plus size={16} />
                Add Supplier
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Supplier Modal */}
      <AddSupplierModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingSupplier(null);
        }}
        onSave={handleSave}
        existingSupplier={editingSupplier}
      />

      {/* Products Modal */}
      {viewingProducts && (
        <ProductsModal
          supplier={viewingProducts}
          onClose={() => setViewingProducts(null)}
        />
      )}
    </div>
  );
}