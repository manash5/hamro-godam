import { Geist, Geist_Mono } from "next/font/google";
import './globals.css'
import SessionWrapper from "../components/SessionWrapper";
import TokenManagerInitializer from "../components/TokenManagerInitializer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Hamro Godam - Inventory Management System",
  description: "Comprehensive inventory and warehouse management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionWrapper>
          <TokenManagerInitializer />
          {children}
        </SessionWrapper>
      </body>
    </html>
  );
}
