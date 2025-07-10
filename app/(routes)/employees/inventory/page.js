import React from "react";

const page = () => {
  const products = [
    { name: "Product A", status: "High", count: 120, price: 25.99 },
    { name: "Product B", status: "Medium", count: 75, price: 49.5 },
    { name: "Product C", status: "High", count: 200, price: 15.0 },
    { name: "Product D", status: "Low", count: 30, price: 85.75 },
    { name: "Product E", status: "Low", count: 8, price: 129.99 },
  ];

  const statusColor = {
    High: "bg-green-600",
    Medium: "bg-yellow-500",
    Low: "bg-red-600",
  };

  return (
    <div className="flex min-h-screen w-full bg-[#f3f9fb] font-sans">
      <aside className="w-[220px] bg-[#1d3557] text-[#c4f5d5] p-5 min-h-screen flex flex-col">
        <h2 className="mb-8 text-2xl font-bold">HGODAM</h2>
        <ul className="space-y-4">
          <li className="cursor-pointer">Dashboard</li>
          <li className="bg-[#2b4d74] px-2 py-2 rounded cursor-pointer font-semibold">Inventory</li>
          <li className="cursor-pointer">Products</li>
          <li className="cursor-pointer">User</li>
          <li className="cursor-pointer">Settings</li>
          <li className="cursor-pointer">Expenses</li>
        </ul>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[#2c6e49]">Inventory Overview</h1>
          <p className="text-gray-600">Track stock levels, prices, and product performance</p>
        </header>

        <section className="bg-white rounded-xl p-6 shadow-md overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr>
                <th className="bg-[#eaf5e7] text-[#2c6e49] px-4 py-3 font-semibold">Product Name</th>
                <th className="bg-[#eaf5e7] text-[#2c6e49] px-4 py-3 font-semibold">Stock Status</th>
                <th className="bg-[#eaf5e7] text-[#2c6e49] px-4 py-3 font-semibold">Stock Count</th>
                <th className="bg-[#eaf5e7] text-[#2c6e49] px-4 py-3 font-semibold">Unit Price ($)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <tr key={i} className="border-b last:border-b-0">
                  <td className="px-4 py-3">{product.name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-white font-bold text-sm px-3 py-1 rounded-full ${statusColor[product.status]}`}
                    >
                      {product.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.count}</td>
                  <td className="px-4 py-3">${product.price.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
};

export default page;