// app/page.tsx
"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "./providers/AuthProvider";

export default function Home() {
  const { user, signIn, signOut, isSessionLoading } = useAuth();

  if (isSessionLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Checking session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-3xl font-bold">Welcome to Project Genesis</h1>
      {user ? (
        <div className="text-center space-y-4">
          <p className="text-gray-700">Logged in as {user.email}</p>
          <div className="flex gap-2 justify-center">
            <Link
              href="/sektor"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              Go to Sektor Dashboard
            </Link>
            <button
              onClick={signOut}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={signIn}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Login with Google
        </button>
      )}
    </div>
  );
}
