"use client";

import { useEffect, useState } from "react";
import AddTaskModal from "@/components/AddTaskModal";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
    fetchEmployees();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch("/api/task");
    const json = await res.json();
    setTasks(json.data || []);
  };

  const fetchEmployees = async () => {
    const res = await fetch("/api/employee");
    const json = await res.json();
    setEmployees(json.data || []);
  };

  const handleSave = async (task) => {
    const res = await fetch(`/api/task${editingTask ? `/${editingTask._id}` : ""}`, {
      method: editingTask ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });
    if (res.ok) {
      fetchTasks();
      setModalOpen(false);
      setEditingTask(null);
    }
  };

  const handleDelete = async (id) => {
    const res = await fetch(`/api/task/${id}`, { method: "DELETE" });
    if (res.ok) fetchTasks();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Task Management</h1>
        <button onClick={() => setModalOpen(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
          + Add Task
        </button>
      </div>

      <table className="w-full text-left border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2">Title</th>
            <th className="p-2">Employee</th>
            <th className="p-2">Status</th>
            <th className="p-2">Due Date</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className="border-t">
              <td className="p-2">{task.title}</td>
              <td className="p-2">{task.assignedTo?.name || "N/A"}</td>
              <td className="p-2 capitalize">{task.status}</td>
              <td className="p-2">{task.dueDate?.slice(0, 10)}</td>
              <td className="p-2 flex gap-2">
                <button onClick={() => { setEditingTask(task); setModalOpen(true); }} className="text-blue-600">Edit</button>
                <button onClick={() => handleDelete(task._id)} className="text-red-600">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <AddTaskModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditingTask(null); }}
        onSave={handleSave}
        existingTask={editingTask}
        employeeList={employees}
      />
    </div>
  );
}
