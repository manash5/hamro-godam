import React, { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import TokenManager from '@/utils/tokenManager';
import { toast } from 'react-toastify';

const defaultProductForm = {
  name: '',
  description: '',
  price: '',
  stockQuantity: '',
  category: '',
  image: '',
  supplier: '',
  variations: [
    { type: 'Color', options: ['Black', 'White', 'Blue'], status: 'ACTIVE' }
  ]
};

const defaultSupplierForm = {
  name: '', email: '', contact_number: '', address: '', category: '', company_name: '',
};

export default function AddProductModal({
  open,
  onClose,
  onSuccess,
  showSupplier = true,
  showImage = true,
  employeeMode = false,
}) {
  const [productForm, setProductForm] = useState(defaultProductForm);
  const [formError, setFormError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [suppliers, setSuppliers] = useState([]);
  const [supplierLoading, setSupplierLoading] = useState(false);
  const [showNewSupplierForm, setShowNewSupplierForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState(defaultSupplierForm);
  const [addingSupplier, setAddingSupplier] = useState(false);

  useEffect(() => {
    if (open && showSupplier) {
      setSupplierLoading(true);
      fetch('/api/supplier', {
        headers: TokenManager.getToken(false)
          ? { 'Authorization': `Bearer ${TokenManager.getToken(false)}` }
          : {},
      })
        .then(res => res.json())
        .then(data => setSuppliers(data.data || []))
        .catch(() => setSuppliers([]))
        .finally(() => setSupplierLoading(false));
    }
    if (open) {
      setProductForm(defaultProductForm);
      setFormError('');
    }
  }, [open, showSupplier]);

  // Image upload
  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const token = TokenManager.getToken(false);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await res.json();
      if (res.ok && data.path) {
        setProductForm(prev => ({ ...prev, image: data.path }));
      } else {
        toast.error('Image upload failed: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Image upload error: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Supplier logic
  const handleSupplierSelect = (e) => {
    setProductForm(prev => ({ ...prev, supplier: e.target.value }));
  };
  const handleNewSupplierChange = (e) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
  };
  const handleAddNewSupplier = async () => {
    setAddingSupplier(true);
    try {
      const token = TokenManager.getToken(false);
      const res = await fetch('/api/supplier', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(newSupplier),
      });
      const data = await res.json();
      if (res.ok && data.data) {
        setSuppliers(prev => [data.data, ...prev]);
        setProductForm(prev => ({ ...prev, supplier: data.data.id }));
        setShowNewSupplierForm(false);
        setNewSupplier(defaultSupplierForm);
      } else {
        toast.error('Failed to add supplier: ' + (data.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Error adding supplier: ' + err.message);
    } finally {
      setAddingSupplier(false);
    }
  };

  // Add Product
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (showSupplier && !productForm.supplier) {
      setFormError('Please select a supplier for this product.');
      return;
    }
    try {
      const token = TokenManager.getToken(false) || localStorage.getItem('token');
      const res = await fetch('/api/product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          name: productForm.name,
          description: productForm.description,
          stock: Number(productForm.stockQuantity || productForm.stock),
          price: Number(productForm.price),
          category: productForm.category,
          image: productForm.image || '',
          status: productForm.status ?? true,
          supplier: productForm.supplier,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        toast.success('Product added successfully!');
        onSuccess && onSuccess();
        onClose && onClose();
        setProductForm(defaultProductForm);
      } else {
        setFormError(result.error || 'Failed to save product');
      }
    } catch (err) {
      setFormError('Error saving product: ' + err.message);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto hide-scrollbar text-black">
        {/* Modal Header */}
        <div className="bg-slate-800 text-white p-6 rounded-t-2xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Product Details</h2>
              <p className="text-slate-300 mt-1">Create and manage your product information</p>
            </div>
            <button onClick={onClose} className="text-slate-300 hover:text-white p-2"><X /></button>
          </div>
        </div>
        <form onSubmit={handleFormSubmit} className="p-6 space-y-8">
          {/* General Information */}
          <div className="bg-blue-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">ℹ</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">General Information</h3>
                <p className="text-sm text-gray-600">Basic product details and description</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Product Name <span className="text-red-500">*</span></label>
                <input type="text" value={productForm.name} onChange={e => setProductForm(prev => ({ ...prev, name: e.target.value }))} placeholder="Enter your product name here..." className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description <span className="text-gray-400">(Optional)</span></label>
                <textarea value={productForm.description} onChange={e => setProductForm(prev => ({ ...prev, description: e.target.value }))} placeholder="Describe your product features and benefits..." rows={4} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
            </div>
          </div>
          {/* Media Assets */}
          {showImage && (
            <div className="bg-green-50 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-green-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">📷</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Media Assets</h3>
                  <p className="text-sm text-gray-600">Upload product images and videos</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <div className="text-4xl text-gray-400 mb-2">📷</div>
                    <p className="text-sm text-gray-600 mb-1">Add Images</p>
                    <p className="text-xs text-gray-400">PNG, JPG up to 10MB</p>
                    {productForm.image && (
                      <div className="mt-2 flex flex-col items-center">
                        <img src={productForm.image} alt="Product Preview" className="h-24 rounded border mb-1" />
                        <p className="text-xs text-gray-500">{productForm.image}</p>
                      </div>
                    )}
                    {uploading && <p className="text-blue-600 text-sm mt-1">Uploading...</p>}
                  </div>
                </div>
                <input type="file" accept="image/*" id="product-image-upload" style={{ display: 'none' }} onChange={handleImageChange} disabled={uploading} />
                <button type="button" className="px-6 py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors duration-200" onClick={() => document.getElementById('product-image-upload').click()} disabled={uploading}>Browse Files</button>
              </div>
            </div>
          )}
          {/* Pricing & Inventory */}
          <div className="bg-purple-50 p-6 rounded-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-purple-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">💰</div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pricing & Inventory</h3>
                <p className="text-sm text-gray-600">Set pricing and manage stock levels</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price <span className="text-red-500">*</span></label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₹</span>
                  <input type="number" value={productForm.price} onChange={e => setProductForm(prev => ({ ...prev, price: e.target.value }))} placeholder="0.00" step="0.01" className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                <input type="number" value={productForm.stockQuantity} onChange={e => setProductForm(prev => ({ ...prev, stockQuantity: e.target.value }))} placeholder="0" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <div className="relative">
                  <input type="text" value={productForm.category} onChange={e => setProductForm(prev => ({ ...prev, category: e.target.value }))} placeholder="Category" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>
            </div>
          </div>
          {/* Suppliers Section */}
          {showSupplier && (
            <div className="bg-orange-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-600 text-white rounded-lg flex items-center justify-center text-sm font-bold">🏢</div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Suppliers</h3>
                    <p className="text-sm text-gray-600">Select or add suppliers for this product</p>
                  </div>
                </div>
                <button type="button" onClick={() => setShowNewSupplierForm(v => !v)} className="px-4 py-2 border-2 border-dashed border-blue-400 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors duration-200 flex items-center gap-2">
                  <Plus size={16} />
                  {showNewSupplierForm ? 'Cancel' : 'Add New Supplier'}
                </button>
              </div>
              {/* Existing Suppliers Multi-Select */}
              <div className="mb-4">
                {supplierLoading ? (
                  <p className="text-gray-500 text-sm">Loading suppliers...</p>
                ) : (
                  <select value={productForm.supplier} onChange={handleSupplierSelect} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500" required>
                    <option value="">Select a supplier</option>
                    {suppliers.map(supplier => (
                      <option key={supplier.id} value={supplier.id}>
                        {supplier.name} ({supplier.company_name || 'No Company'})
                      </option>
                    ))}
                  </select>
                )}
                {formError && <p className="text-red-600 text-xs mt-1">{formError}</p>}
                <p className="text-xs text-gray-500 mt-1">You must select a supplier for this product.</p>
              </div>
              {/* New Supplier Form */}
              {showNewSupplierForm && (
                <div className="space-y-2 bg-white p-4 rounded-lg border border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <input name="name" value={newSupplier.name} onChange={handleNewSupplierChange} required placeholder="Name*" className="px-3 py-2 border rounded" />
                    <input name="email" value={newSupplier.email} onChange={handleNewSupplierChange} required placeholder="Email*" className="px-3 py-2 border rounded" />
                    <input name="contact_number" value={newSupplier.contact_number} onChange={handleNewSupplierChange} required placeholder="Contact Number*" className="px-3 py-2 border rounded" />
                    <input name="address" value={newSupplier.address} onChange={handleNewSupplierChange} placeholder="Address" className="px-3 py-2 border rounded" />
                    <input name="category" value={newSupplier.category} onChange={handleNewSupplierChange} required placeholder="Category*" className="px-3 py-2 border rounded" />
                    <input name="company_name" value={newSupplier.company_name} onChange={handleNewSupplierChange} placeholder="Company Name" className="px-3 py-2 border rounded" />
                  </div>
                  <button type="button" disabled={addingSupplier} onClick={handleAddNewSupplier} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-500">
                    {addingSupplier ? 'Adding...' : 'Add Supplier'}
                  </button>
                </div>
              )}
            </div>
          )}
          {formError && <div className="text-red-500 text-sm mt-2">{formError}</div>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors duration-200">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
} 