import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { LoginModal } from "@/components/LoginModal";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Event Platform - World ID Login",
  description: "Create and manage events with World ID verification",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} antialiased bg-background text-text-primary`}>
        <AuthProvider>
          <div className="fixed inset-0 mx-auto max-w-md bg-background min-h-screen overflow-y-auto">
            <div className="relative">
              <div className="fixed top-4 right-4 z-50">
                <LoginModal />
              </div>
              {children}
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
