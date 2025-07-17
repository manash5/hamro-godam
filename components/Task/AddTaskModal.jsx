"use client";

import { useEffect, useState } from "react";

export default function AddTaskModal({ isOpen, onClose, onSave, existingTask, employeeList = [] }) {
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    assignedTo: "",
    dueDate: "",
    status: "pending",
  });

  useEffect(() => {
    if (existingTask) {
      setTaskData(existingTask);
    } else {
      setTaskData({
        title: "",
        description: "",
        assignedTo: "",
        dueDate: "",
        status: "pending",
      });
    }
  }, [existingTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(taskData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl">
        <h2 className="text-xl font-semibold mb-4">{existingTask ? "Edit Task" : "Add New Task"}</h2>

        <div className="space-y-4">
          <input name="title" value={taskData.title} onChange={handleChange} placeholder="Task Title" className="w-full p-2 border rounded" />

          <textarea name="description" value={taskData.description} onChange={handleChange} placeholder="Task Description" className="w-full p-2 border rounded" />

          <select name="assignedTo" value={taskData.assignedTo} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="">Select Employee</option>
            {employeeList.map((emp) => (
              <option key={emp._id} value={emp._id}>{emp.name}</option>
            ))}
          </select>

          <input type="date" name="dueDate" value={taskData.dueDate} onChange={handleChange} className="w-full p-2 border rounded" />

          <select name="status" value={taskData.status} onChange={handleChange} className="w-full p-2 border rounded">
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="bg-gray-200 px-4 py-2 rounded">Cancel</button>
          <button onClick={handleSubmit} className="bg-blue-600 text-white px-4 py-2 rounded">
            {existingTask ? "Update Task" : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
