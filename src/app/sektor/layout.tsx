// app/sektor/layout.tsx
"use client";

import React, { useState } from "react";
import Sidebar from "./components/Sidebar";

export default function SektorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleToggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <section className="min-h-screen flex flex-col md:flex-row">
      {/* SIDEBAR */}
      <Sidebar isOpen={sidebarOpen} onClose={handleToggleSidebar} />

      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-10 md:hidden"
          onClick={handleToggleSidebar}
        />
      )}

      {/* MAIN CONTENT */}
      <div className="flex-1 md:ml-64">
        {/* TOP NAV (mobile) */}
        <header className="md:hidden bg-white shadow p-4 flex items-center">
          <button
            className="text-cyan-700 font-semibold"
            onClick={handleToggleSidebar}
          >
            ☰ Menu
          </button>
        </header>

        <main className="p-6">{children}</main>
      </div>
    </section>
  );
}
