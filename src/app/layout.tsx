import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { getAllUsers, getCurrentUserId } from "@/actions/authActions";
import Header from "@/components/header";
import Sidebar from "@/components/sideber";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const allUsers = await getAllUsers();
  const currentUserId = await getCurrentUserId();

  return (
    <html lang="ru" className={cn("font-sans", inter.variable)}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <div className="flex flex-col min-h-screen w-full">
          <Header allUsers={allUsers} currentUserId={currentUserId} />

          <div className="flex flex-1">
            <main className="flex-1">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
