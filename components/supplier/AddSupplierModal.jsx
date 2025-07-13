"use client";

import { useEffect, useState } from "react";

export default function AddSupplierModal({ isOpen, onClose, onSave, existingSupplier }) {
  const [supplier, setSupplier] = useState({
    name: "",
    email: "",
    contact_number: "",
    address: "",
    category: "",
    pan_number: "",
    company_name: "",
  });

  useEffect(() => {
    if (existingSupplier) {
      setSupplier(existingSupplier);
    } else {
      setSupplier({
        name: "",
        email: "",
        contact_number: "",
        address: "",
        category: "",
        pan_number: "",
        company_name: "",
      });
    }
  }, [existingSupplier]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSupplier((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(supplier);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {existingSupplier ? "Edit Supplier" : "Add New Supplier"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="name"
            value={supplier.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="border p-2 rounded"
          />
          <input
            name="email"
            type="email"
            value={supplier.email}
            onChange={handleChange}
            placeholder="Email"
            className="border p-2 rounded"
          />
          <input
            name="contact_number"
            value={supplier.contact_number}
            onChange={handleChange}
            placeholder="Contact Number"
            className="border p-2 rounded"
          />
          <input
            name="category"
            value={supplier.category}
            onChange={handleChange}
            placeholder="Category"
            className="border p-2 rounded"
          />
          <input
            name="pan_number"
            value={supplier.pan_number}
            onChange={handleChange}
            placeholder="PAN Number"
            className="border p-2 rounded"
          />
          <input
            name="company_name"
            value={supplier.company_name}
            onChange={handleChange}
            placeholder="Company Name"
            className="border p-2 rounded"
          />
        </div>

        <textarea
          name="address"
          value={supplier.address}
          onChange={handleChange}
          placeholder="Address"
          rows={3}
          className="w-full border p-2 rounded mt-4"
        />

        <div className="flex justify-end mt-6 gap-2">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
          >
            {existingSupplier ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
