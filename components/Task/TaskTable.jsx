export function TaskTable({ tasks, search }) {
  const filteredTasks = tasks.filter((task) =>
    task.title?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-gray-100 text-gray-600 font-semibold">
          <tr>
            <th className="p-4">Task</th>
            <th className="p-4">Category</th>
            <th className="p-4">Due Date</th>
            <th className="p-4">Status</th>
            <th className="p-4">Assigned</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredTasks.map((task) => (
            <tr
              key={task._id}
              className="border-t hover:bg-gray-50 transition"
            >
              <td className="p-4 font-medium text-gray-800">{task.title}</td>
              <td className="p-4 text-gray-600">{task.category || "N/A"}</td>
              <td className="p-4 text-gray-600">
                {task.dueDate?.slice(0, 10) || "—"}
              </td>
              <td className="p-4">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700"
                      : task.status === "Pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {task.status}
                </span>
              </td>
              <td className="p-4 text-gray-600">
                {task.assignedTo || "Unassigned"}
              </td>
              <td className="p-4 text-right text-gray-500">...</td>
            </tr>
          ))}
        </tbody>
      </table>

      {filteredTasks.length === 0 && (
        <div className="text-center text-gray-400 py-6">No tasks found.</div>
      )}
    </div>
  );
}
