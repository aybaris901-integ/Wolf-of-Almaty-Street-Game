import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "The Real Wolf of Almaty Street",
  description: "Neo-brutalist trading game set in the wild streets of Almaty",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full">{children}</body>
    </html>
  );
}
