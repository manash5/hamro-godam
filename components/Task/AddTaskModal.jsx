"use client";

import { useEffect, useState } from "react";

export default function AddTaskModal({
  isOpen,
  onClose,
  onSave,
  existingTask,
  employeeList = [],
}) {
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
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white w-full max-w-xl rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">
          {existingTask ? "Edit Task" : "Add New Task"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            name="title"
            value={taskData.title}
            onChange={handleChange}
            placeholder="Task Title"
            className="border p-2 rounded"
          />

          <select
            name="status"
            value={taskData.status}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="pending">Pending</option>
            <option value="in progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>

          <select
            name="assignedTo"
            value={taskData.assignedTo}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="">Assign to Employee</option>
            {employeeList.map((emp) => (
              <option key={emp._id} value={emp._id}>
                {emp.name}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="dueDate"
            value={taskData.dueDate}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>

        <textarea
          name="description"
          value={taskData.description}
          onChange={handleChange}
          placeholder="Task Description"
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
            {existingTask ? "Update Task" : "Save Task"}
          </button>
        </div>
      </div>
    </div>
  );
}
