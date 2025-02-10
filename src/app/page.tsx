// app/page.tsx
"use client";

import React from "react";
import { useAuth } from "./providers/AuthProvider";

export default function Home() {
  const { user, signIn, signOut } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">
        Welcome to Project Genesis Tutorial
      </h1>
      {user ? (
        <div className="text-center">
          <p className="mb-4">You are logged in as {user.email}</p>
          <button
            onClick={signOut}
            className="px-4 py-2 bg-red-500 text-white rounded"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center">
          <p className="mb-4">You are not logged in.</p>
          <button
            onClick={signIn}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Login with Google
          </button>
        </div>
      )}
    </div>
  );
}
