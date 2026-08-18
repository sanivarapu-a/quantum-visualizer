import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "../lib/AuthContext";
import AuthDropdown from "../components/composer/AuthDropdown";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Quantum Composer",
  description: "A drag-and-drop quantum circuit composer",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <div className="flex h-8 items-center justify-end border-b border-white/10 bg-[#0a0e17] px-4">
            <AuthDropdown />
          </div>
          {children}
          <Toaster position="top-right" richColors />
        </AuthProvider>
      </body>
    </html>
  );
}