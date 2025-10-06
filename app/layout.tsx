import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Distance",
  description: "See close you are to other users",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
