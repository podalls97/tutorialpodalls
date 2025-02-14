// app/sektor/components/Sidebar.tsx
"use client";

import React from "react";
import Link from "next/link";

type SidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-20 w-64 p-4 bg-cyan-800 text-white shadow-xl transform 
        transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:static md:flex-shrink-0
      `}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold tracking-wide">Sektor Pembelajaran</h2>
        {/* Close button for mobile */}
        <button className="md:hidden" onClick={onClose}>
          ✕
        </button>
      </div>

      <nav className="space-y-2">
        <Link href="/" className="block px-3 py-2 rounded hover:bg-cyan-700">
          Home
        </Link>
        <Link
          href="/sektor"
          className="block px-3 py-2 rounded hover:bg-cyan-700"
        >
          Dashboard
        </Link>
        <Link
          href="/sektor/employees"
          className="block px-3 py-2 rounded hover:bg-cyan-700"
        >
          Employees
        </Link>
      </nav>
    </aside>
  );
}
