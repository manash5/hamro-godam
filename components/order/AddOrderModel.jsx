"use client";

import { useEffect, useState } from "react";

export default function AddOrderModal({ isOpen, onClose, onSave, existingOrder }) {
  const [orderData, setOrderData] = useState({
    customerName: "",
    customerNumber: "",
    customerAddress: "",
    email: "",
    productName: [],
    productQuantity: [],
    totalAmount: 0,
    status: "pending",
    paymentMethod: "",
    comment: "",
    deliveryDate: "",
  });

  useEffect(() => {
    if (existingOrder) {
      setOrderData(existingOrder);
    } else {
      setOrderData({
        customerName: "",
        customerNumber: "",
        customerAddress: "",
        email: "",
        productName: [],
        productQuantity: [],
        totalAmount: 0,
        status: "pending",
        paymentMethod: "",
        comment: "",
        deliveryDate: "",
      });
    }
  }, [existingOrder]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrderData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProductChange = (index, field, value) => {
    const names = [...orderData.productName];
    const quantities = [...orderData.productQuantity];

    if (field === "name") names[index] = value;
    else quantities[index] = parseInt(value) || 0;

    setOrderData((prev) => ({
      ...prev,
      productName: names,
      productQuantity: quantities,
    }));
  };

  const addProduct = () => {
    setOrderData((prev) => ({
      ...prev,
      productName: [...prev.productName, ""],
      productQuantity: [...prev.productQuantity, 1],
    }));
  };

  const removeProduct = (index) => {
    const names = [...orderData.productName];
    const quantities = [...orderData.productQuantity];
    names.splice(index, 1);
    quantities.splice(index, 1);

    setOrderData((prev) => ({
      ...prev,
      productName: names,
      productQuantity: quantities,
    }));
  };

  const handleSubmit = () => {
    const totalAmount = orderData.productQuantity.reduce((sum, qty) => sum + qty * 500, 0);
    onSave({ ...orderData, totalAmount });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed text-black inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center" >
      <div className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6">
        <h2 className="text-xl font-semibold mb-4">
          {existingOrder ? "Edit Order" : "Add New Order"}
        </h2>

        {/* Order Info */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <input name="customerName" value={orderData.customerName} onChange={handleChange} placeholder="Customer Name" className="p-2 border rounded" />
          <input name="email" value={orderData.email} onChange={handleChange} placeholder="Email" className="p-2 border rounded" />
          <input name="customerNumber" value={orderData.customerNumber} onChange={handleChange} placeholder="Phone" className="p-2 border rounded" />
          <input name="customerAddress" value={orderData.customerAddress} onChange={handleChange} placeholder="Shipping Address" className="p-2 border rounded" />
        </div>

        {/* Products */}
        <div className="border p-4 mb-4 rounded">
          <h3 className="font-semibold mb-2">Product Items</h3>
          <div className="space-y-2">
            {orderData.productName.map((product, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  value={product}
                  onChange={(e) => handleProductChange(index, "name", e.target.value)}
                  placeholder="Product Name"
                  className="flex-1 border p-2 rounded"
                />
                <input
                  type="number"
                  value={orderData.productQuantity[index]}
                  onChange={(e) => handleProductChange(index, "quantity", e.target.value)}
                  placeholder="Qty"
                  className="w-20 border p-2 rounded"
                />
                <button onClick={() => removeProduct(index)} className="text-red-500 text-lg">×</button>
              </div>
            ))}
          </div>
          <button onClick={addProduct} className="text-sm text-blue-700 mt-2">+ Add Product</button>
        </div>

        {/* Order Summary */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <select name="status" value={orderData.status} onChange={handleChange} className="p-2 border rounded">
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="complete">Complete</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input name="paymentMethod" value={orderData.paymentMethod} onChange={handleChange} placeholder="Payment Method" className="p-2 border rounded" />
        </div>

        <textarea name="comment" value={orderData.comment} onChange={handleChange} placeholder="Add order notes or special instructions..." className="w-full p-2 border rounded mb-4" />

        <div className="flex justify-between">
          <div className="font-semibold text-lg">
            Total: ${orderData.productQuantity.reduce((sum, qty) => sum + qty * 500, 0).toLocaleString()}
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
            <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
              {existingOrder ? "Update Order" : "Save Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
