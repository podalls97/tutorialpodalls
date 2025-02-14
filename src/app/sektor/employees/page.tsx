// app/sektor/employees/page.tsx
"use client";

import React, { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../providers/AuthProvider";
import { supabase } from "../../../../lib/supabaseClient";

// Structure of an employee record
type Employee = {
  id: string;
  name: string;
  position: string;
  department: string;
  created_at?: string;
};

export default function EmployeesPage() {
  const { user, isSessionLoading } = useAuth();
  const router = useRouter();

  // Local state for employees data
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  // Form states
  const [name, setName] = useState("");
  const [position, setPosition] = useState("");
  const [department, setDepartment] = useState("");

  // Editing mode
  const [editingEmployeeId, setEditingEmployeeId] = useState<string | null>(
    null
  );

  // Check auth
  useEffect(() => {
    if (!isSessionLoading && !user) {
      router.push("/");
    }
  }, [user, isSessionLoading, router]);

  // Fetch employees
  const fetchEmployees = async () => {
    setLoadingData(true);
    const { data, error } = await supabase
      .from("employees")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error.message);
    } else if (data) {
      setEmployees(data as Employee[]);
    }
    setLoadingData(false);
  };

  // Load employees on mount (if user is known)
  useEffect(() => {
    if (user) {
      fetchEmployees();
    }
  }, [user]);

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!name || !position || !department) {
      alert("Please fill out all fields.");
      return;
    }

    if (editingEmployeeId) {
      // Update existing employee
      const { error } = await supabase
        .from("employees")
        .update({ name, position, department })
        .eq("id", editingEmployeeId);

      if (error) {
        console.error("Error updating employee:", error.message);
        alert("Failed to update employee.");
      } else {
        alert("Employee updated successfully!");
        await fetchEmployees();
      }
      setEditingEmployeeId(null);
    } else {
      // Add new employee
      const { error } = await supabase
        .from("employees")
        .insert([{ name, position, department }]);

      if (error) {
        console.error("Error adding employee:", error.message);
        alert("Failed to add new employee.");
      } else {
        alert("Employee added successfully!");
        await fetchEmployees();
      }
    }

    // Reset form
    setName("");
    setPosition("");
    setDepartment("");
  };

  // Edit
  const handleEdit = (emp: Employee) => {
    setEditingEmployeeId(emp.id);
    setName(emp.name);
    setPosition(emp.position);
    setDepartment(emp.department);
  };

  // Delete
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) {
      return;
    }
    const { error } = await supabase.from("employees").delete().eq("id", id);
    if (error) {
      console.error("Error deleting employee:", error.message);
      alert("Failed to delete employee.");
    } else {
      alert("Employee deleted successfully!");
      await fetchEmployees();
    }
  };

  // If still loading session or user not ready
  if (isSessionLoading || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Employees Directory</h1>
      <p>Manage your employees here. Logged in as {user.email}.</p>

      {/* FORM CARD */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-2">
          {editingEmployeeId ? "Edit Employee" : "Add New Employee"}
        </h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-600"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Position"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-600"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
          />
          <input
            type="text"
            placeholder="Department"
            className="border p-2 rounded focus:outline-none focus:ring-2 focus:ring-cyan-600"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
          />

          <div className="md:col-span-3 flex gap-2">
            <button
              type="submit"
              className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 transition-colors"
            >
              {editingEmployeeId ? "Update" : "Add"}
            </button>
            {editingEmployeeId && (
              <button
                type="button"
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                onClick={() => {
                  // cancel editing
                  setEditingEmployeeId(null);
                  setName("");
                  setPosition("");
                  setDepartment("");
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* EMPLOYEES TABLE */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Employee Records</h2>
        {loadingData ? (
          <p>Loading employees...</p>
        ) : employees.length === 0 ? (
          <p>No employees found.</p>
        ) : (
          <table className="w-full border-collapse overflow-hidden">
            <thead>
              <tr className="bg-cyan-700 text-white">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Position</th>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-left">Created At</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {employees.map((emp) => (
                <tr
                  key={emp.id}
                  className="border-b last:border-b-0 hover:bg-gray-50"
                >
                  <td className="p-3">{emp.name}</td>
                  <td className="p-3">{emp.position}</td>
                  <td className="p-3">{emp.department}</td>
                  <td className="p-3">
                    {emp.created_at
                      ? new Date(emp.created_at).toLocaleString()
                      : "N/A"}
                  </td>
                  <td className="p-3 flex items-center justify-center gap-2">
                    <button
                      onClick={() => handleEdit(emp)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(emp.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
