// app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "./providers/AuthProvider";

export const metadata: Metadata = {
  title: "Project Genesis",
  description: "Modern website with Next.js, Supabase, and Google Auth",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
