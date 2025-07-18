import React from "react";

const page = () => {
  return (
    <div className="flex min-h-screen w-full bg-[#f3f9fb] font-sans">
      {/* Sidebar */}
      <aside className="w-[220px] bg-[#1d3557] text-[#c4f5d5] p-5 min-h-screen flex flex-col">
        <h2 className="mb-8 text-2xl font-bold">HGODAM</h2>
        <ul className="space-y-4">
          <li className="cursor-pointer">Dashboard</li>
          <li className="cursor-pointer">Inventory</li>
          <li className="cursor-pointer">Products</li>
          <li className="cursor-pointer">User</li>
          <li className="bg-[#2b4d74] px-2 py-2 rounded cursor-pointer font-semibold">Settings</li>
          <li className="cursor-pointer">Expenses</li>
        </ul>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-6">
          <h1 className="text-3xl font-bold text-[#2c6e49]">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and application settings</p>
        </header>

        <section className="bg-white rounded-xl p-6 shadow-md space-y-8">
          {/* Account Settings */}
          <div>
            <h2 className="text-xl font-semibold text-[#2c6e49] mb-4">Account Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700">Email</label>
                <input type="email" placeholder="you@example.com" className="w-full mt-1 px-4 py-2 border rounded" />
              </div>
              <div>
                <label className="block text-gray-700">Change Password</label>
                <input type="password" placeholder="New Password" className="w-full mt-1 px-4 py-2 border rounded" />
              </div>
            </div>
          </div>

          {/* Notification Preferences */}
          <div>
            <h2 className="text-xl font-semibold text-[#2c6e49] mb-4">Notification Preferences</h2>
            <div className="flex items-center space-x-4">
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" defaultChecked />
                <span>Email Alerts</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox" />
                <span>SMS Notifications</span>
              </label>
            </div>
          </div>

          {/* Theme Settings */}
          <div>
            <h2 className="text-xl font-semibold text-[#2c6e49] mb-4">Theme Settings</h2>
            <select className="w-full px-4 py-2 border rounded">
              <option value="light">Light Mode</option>
              <option value="dark">Dark Mode</option>
              <option value="system">System Default</option>
            </select>
          </div>

          <div className="pt-4">
            <button className="bg-[#2c6e49] text-white px-6 py-2 rounded hover:bg-[#24583a]">
              Save Changes
            </button>
          </div>
        </section>
      </main>
    </div>
  );
};

export default page;
