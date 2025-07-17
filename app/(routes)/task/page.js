'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskTable } from "@/components/task/TaskTable";
import AddTaskModal from "@/components/task/AddTaskModal";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchTasks = async () => {
    try {
      const res = await fetch("/api/task");
      const data = await res.json();
      setTasks(data?.data || []);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">Tasks</h2>
        <Button onClick={() => setIsModalOpen(true)}>+ Add Task</Button>
      </div>

      <div className="flex gap-4 mb-4">
        <Input
          placeholder="Search tasks..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md"
        />
      </div>

      <TaskTable tasks={tasks} search={search} />

      <AddTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshTasks={fetchTasks}
      />
    </div>
  );
}
