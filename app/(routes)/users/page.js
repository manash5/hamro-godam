"use client"

import React, { useState, useMemo } from 'react';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  createColumnHelper,
  flexRender,
} from '@tanstack/react-table';
import { ChevronDown, MoreHorizontal, ChevronUp, ChevronLeft, ChevronRight } from 'lucide-react';
import Sidebar from '../../../components/sidebar';

const App = () => {
  const [users] = useState([
    {
      id: 'USR001',
      name: 'John Doe',
      role: 'Administrator',
      email: 'john.doe@company.com',
      status: 'ACTIVE',
      lastLogin: '2 hours ago',
      initials: 'JD',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      id: 'USR002',
      name: 'Sarah Miller',
      role: 'Manager',
      email: 'sarah.miller@company.com',
      status: 'ACTIVE',
      lastLogin: '1 day ago',
      initials: 'SM',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      id: 'USR003',
      name: 'Mike Johnson',
      role: 'Employee',
      email: 'mike.johnson@company.com',
      status: 'INACTIVE',
      lastLogin: '1 week ago',
      initials: 'MJ',
      bgColor: 'bg-pink-100',
      textColor: 'text-pink-700'
    },
    {
      id: 'USR004',
      name: 'Emma Brown',
      role: 'Employee',
      email: 'emma.brown@company.com',
      status: 'ACTIVE',
      lastLogin: '3 hours ago',
      initials: 'EB',
      bgColor: 'bg-indigo-100',
      textColor: 'text-indigo-700'
    },
    {
      id: 'USR005',
      name: 'Robert Wilson',
      role: 'Manager',
      email: 'robert.wilson@company.com',
      status: 'PENDING',
      lastLogin: 'Never',
      initials: 'RW',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700'
    }
  ]);

  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [selectedRole, setSelectedRole] = useState('All Roles');
  const [selectedStatus, setSelectedStatus] = useState('All Status');

  // Column helper for type safety and better DX
  const columnHelper = createColumnHelper();

  const getStatusBadge = (status) => {
    const statusStyles = {
      ACTIVE: 'bg-green-100 text-green-800 border-green-200',
      INACTIVE: 'bg-red-100 text-red-800 border-red-200',
      PENDING: 'bg-yellow-100 text-yellow-800 border-yellow-200'
    };

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusStyles[status]}`}>
        {status}
      </span>
    );
  };

  // Define columns using TanStack Table's column helper
  const columns = useMemo(
    () => [
      columnHelper.accessor('name', {
        header: 'User',
        cell: (info) => {
          const row = info.row.original;
          return (
            <div className="flex items-center py-2">
              <div className={`flex-shrink-0 w-10 h-10 rounded-full ${row.bgColor} flex items-center justify-center`}>
                <span className={`text-sm font-medium ${row.textColor}`}>
                  {row.initials}
                </span>
              </div>
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {row.name}
                </div>
                <div className="text-sm text-gray-500">
                  ID: {row.id}
                </div>
              </div>
            </div>
          );
        },
        enableSorting: true,
      }),
      columnHelper.accessor('role', {
        header: 'Role',
        cell: (info) => (
          <div className="text-sm text-gray-900">{info.getValue()}</div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('email', {
        header: 'Email',
        cell: (info) => (
          <div className="text-sm text-gray-900">{info.getValue()}</div>
        ),
        enableSorting: true,
      }),
      columnHelper.accessor('status', {
        header: 'Status',
        cell: (info) => getStatusBadge(info.getValue()),
        enableSorting: true,
      }),
      columnHelper.accessor('lastLogin', {
        header: 'Last Login',
        cell: (info) => (
          <div className="text-sm text-gray-900">{info.getValue()}</div>
        ),
        enableSorting: true,
      }),
      columnHelper.display({
        id: 'actions',
        header: 'Action',
        cell: () => (
          <button className="text-gray-400 hover:text-gray-600 p-1">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        ),
      }),
    ],
    []
  );

  // Initialize the table instance
  const table = useReactTable({
    data: users,
    columns,
    state: {
      sorting,
      globalFilter,
    },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  const FilterDropdown = ({ title }) => (
    <div className="relative">
      <button className="flex items-center justify-between w-full px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 min-w-[120px]">
        {title}
        <ChevronDown className="w-4 h-4 ml-2" />
      </button>
    </div>
  );

  return (
    <div className="flex bg-slate-100 min-h-screen">
        <Sidebar />
      <div className="min-w-7xl px-10 mx-5 bg-slate-100 my-10 rounded-xl">
        {/* Header */}
        <div className="my-6 ">
          <h1 className="text-4xl font-bold text-gray-900 px-10">Users</h1>
        </div>

        <div className="p-5 px-10 rounded-xl bg-gray-50">
        {/* Filters */}
          <div className="flex gap-4 mb-6 bg-white">
            <FilterDropdown title={selectedRole} />
            <FilterDropdown title={selectedStatus} />
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                      {headerGroup.headers.map(header => (
                        <th
                          key={header.id}
                          className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          <div className="flex items-center gap-2">
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getCanSort() && (
                              <span className="text-gray-400">
                                {header.column.getIsSorted() === 'desc' ? (
                                  <ChevronDown className="w-4 h-4" />
                                ) : header.column.getIsSorted() === 'asc' ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <div className="w-4 h-4" />
                                )}
                              </span>
                            )}
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {table.getRowModel().rows.map(row => (
                    <tr key={row.id} className="hover:bg-gray-50">
                      {row.getVisibleCells().map(cell => (
                        <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{' '}
                of {table.getFilteredRowModel().rows.length} users
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                {/* Page Numbers */}
                {Array.from({ length: table.getPageCount() }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => table.setPageIndex(i)}
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      table.getState().pagination.pageIndex === i
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="px-3 py-1 text-sm font-medium rounded-md bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;