'use client';

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TaskTable } from "@/components/task/TaskTable";
import AddTaskModal from "@/components/task/AddTaskModal";
import { Skeleton } from "@/components/ui/skeleton";
import { useDebounce } from "@/hooks/useDebounce";

export default function TaskPage() {
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const debouncedSearch = useDebounce(search, 500);

  const fetchTasks = async (page = pagination.page, limit = pagination.limit) => {
    try {
      setLoading(true);
      const url = `/api/task?page=${page}&limit=${limit}${
        debouncedSearch ? `&search=${debouncedSearch}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();

      if (res.ok) {
        setTasks(data.data || []);
        setPagination({
          page,
          limit,
          total: data.pagination?.total || 0,
        });
        setError("");
      } else {
        setError(data.error || "Failed to fetch tasks.");
      }
    } catch (err) {
      setError("Error fetching tasks.");
      console.error("Error fetching tasks:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [debouncedSearch]);

  const handlePageChange = (newPage) => {
    fetchTasks(newPage);
  };

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

      {error && <div className="text-red-500 mb-4">{error}</div>}

      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : tasks.length > 0 ? (
        <>
          <TaskTable 
            tasks={tasks} 
            refreshTasks={fetchTasks} 
          />
          <div className="flex justify-between items-center mt-4">
            <Button
              disabled={pagination.page === 1}
              onClick={() => handlePageChange(pagination.page - 1)}
            >
              Previous
            </Button>
            <span>
              Page {pagination.page} of {Math.ceil(pagination.total / pagination.limit)}
            </span>
            <Button
              disabled={pagination.page * pagination.limit >= pagination.total}
              onClick={() => handlePageChange(pagination.page + 1)}
            >
              Next
            </Button>
          </div>
        </>
      ) : (
        <div className="text-gray-500 text-center py-8">
          {error ? "Error loading tasks." : "No tasks found."}
        </div>
      )}

      <AddTaskModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshTasks={() => fetchTasks(1)} // Reset to page 1 after adding a task
      />
    </div>
  );
}