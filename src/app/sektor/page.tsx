// app/sektor/page.tsx
"use client";

import React, { useEffect } from "react";
import { useAuth } from "../providers/AuthProvider";
import { useRouter } from "next/navigation";

export default function SektorPage() {
  const { user, isSessionLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isSessionLoading && !user) {
      router.push("/");
    }
  }, [user, isSessionLoading, router]);

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking session...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Sektor Pembelajaran Dashboard</h1>
      <p>Welcome, {user.email}!</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Overview</h2>
          <p>
            This is where you can put key stats, announcements, or anything else
            relevant to your users.
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-2">Quick Links</h2>
          <ul className="list-disc list-inside text-sm space-y-1">
            <li>Employees Database</li>
            <li>Attendance System</li>
            <li>Performance Reviews</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
