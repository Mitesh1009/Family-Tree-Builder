import type React from "react";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Family member tree",
  description: "Create a family member tree",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <>
          <main>{children}</main>
        </>
      </body>
    </html>
  );
}
