import React from "react";
import "./Dashboard.css";

export default function Dashboard() {
  return (
    <div className="dashboard-container">
      <aside className="sidebar">
        <h2 className="logo">HGODAM</h2>
        <ul className="nav-links">
          <li className="active">Dashboard</li>
          <li>Inventory</li>
          <li>Products</li>
          <li>User</li>
          <li>Settings</li>
          <li>Expenses</li>
          <li>Calendar</li>
        </ul>
      </aside>

      <main className="main-content">
        <header>
          <h1>Employee Dashboard</h1>
          <p>Welcome back! Here's what's happening with your team today</p>
          <input
            type="text"
            className="search-bar"
            placeholder="Search employees, departments..."
          />
        </header>

        <section className="stats">
          <div className="card">
            <p className="title">Total Employees</p>
            <h2>387</h2>
            <p className="note green">
              +12 this month <span>(3.2% increase)</span>
            </p>
          </div>
          <div className="card">
            <p className="title">Present Today</p>
            <h2>364</h2>
            <p className="note green">
              94.1% attendance <span>Above average</span>
            </p>
          </div>
          <div className="card">
            <p className="title">Remote Today</p>
            <h2>156</h2>
            <p className="note orange">
              42.8% remote <span>Hybrid mode</span>
            </p>
          </div>
          <div className="card">
            <p className="title">New This Month</p>
            <h2>23</h2>
            <p className="note purple">
              Fast growing <span>15% growth rate</span>
            </p>
          </div>
        </section>

        <section className="recent-activity">
          <h2>Recent Activity</h2>
          <ul>
            <li>
              <span className="dot blue"></span> New employee joined Marketing -
              2 hours ago
            </li>
            <li>
              <span className="dot green"></span> Team performance review
              completed - 4 hours ago
            </li>
            <li>
              <span className="dot orange"></span> Monthly attendance report
              generated - 6 hours ago
            </li>
            <li>
              <span className="dot red"></span> Alex Chen promoted to Senior
              Developer - 1 day ago
            </li>
            <li>
              <span className="dot purple"></span> 5 leave requests pending
              approval - 2 days ago
            </li>
            <li>
              <span className="dot orange"></span> November payroll processed
              successfully - 3 days ago
            </li>
          </ul>
        </section>

        <section className="weekly-trends">
          <h2>Weekly Attendance Trends</h2>
          <div className="bar-chart">
            {[364, 371, 374, 358, 376, 387, 364].map((val, index) => (
              <div key={index} className="bar-container">
                <div className="bar" style={{ height: `${val / 2}px` }}></div>
                <span className="bar-label">{val}</span>
              </div>
            ))}
          </div>
          <p className="trend-dates">Nov 18 - Nov 24, 2024</p>
        </section>
      </main>
    </div>
  );
}
