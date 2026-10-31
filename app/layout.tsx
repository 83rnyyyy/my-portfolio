import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bernie Liu | Portfolio",
  description:
    "Bernie Liu, Software Engineering student at the University of Waterloo. Explore projects in web development, robotics, and automation.",
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
