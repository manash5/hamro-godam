"use client";

import React from "react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="flex h-screen w-screen bg-[#f3f9fb] font-sans">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#1d3557] text-[#c4f5d5] p-5 flex-shrink-0 flex flex-col">
        <h2 className="text-2xl mb-8 font-bold">HAMROGODAM</h2>
        <ul className="space-y-2">
          <li>
            <Link
              href="/employees/inventory"
              className="block hover:bg-[#2b4d74] rounded px-2 py-2 transition"
            >
              Inventory
            </Link>
          </li>
          <li>
            <Link
              href="/employees/products"
              className="block hover:bg-[#2b4d74] rounded px-2 py-2 transition"
            >
              Products
            </Link>
          </li>
          <li>
            <Link
              href="/employees/user"
              className="block hover:bg-[#2b4d74] rounded px-2 py-2 transition"
            >
              User
            </Link>
          </li>
          <li>
            <Link
              href="/employees/settings"
              className="block hover:bg-[#2b4d74] rounded px-2 py-2 transition"
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              href="/employees/expenses"
              className="block hover:bg-[#2b4d74] rounded px-2 py-2 transition"
            >
              Expenses
            </Link>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[#1d3557]">Welcome to HGODAM Dashboard</h1>
          <p className="text-[#6c757d] font-medium mt-2">Quick overview of your inventory and activity</p>
        </header>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white rounded-xl p-6 shadow-md text-center hover:-translate-y-1 transition">
            <h2 className="text-3xl font-bold text-[#1d3557]">5</h2>
            <p className="mt-2 text-[#6c757d] font-medium">Total Products</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center hover:-translate-y-1 transition">
            <h2 className="text-3xl font-bold text-[#1d3557]">$12,750</h2>
            <p className="mt-2 text-[#6c757d] font-medium">Total Inventory Value</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center hover:-translate-y-1 transition">
            <h2 className="text-3xl font-bold text-[#1d3557]">3</h2>
            <p className="mt-2 text-[#6c757d] font-medium">Low Stock Items</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-md text-center hover:-translate-y-1 transition">
            <h2 className="text-3xl font-bold text-[#1d3557]">$2,500</h2>
            <p className="mt-2 text-[#6c757d] font-medium">Monthly Sales</p>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Page;
