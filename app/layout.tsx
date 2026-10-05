import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "מצווה לרגע — מצווה אקראית ליום טוב יותר",
  description: "לחיצה אחת לקבלת מצווה אקראית, הסבר קצר ורעיון מעשי להיום.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
