// app/layout.jsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StoryNode",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=0.85, maximum-scale=0.85, minimum-scale=0.85, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}
