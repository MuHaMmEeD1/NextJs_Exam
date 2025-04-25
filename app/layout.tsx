import { Work_Sans } from "next/font/google";
import "./globals.css";
import MyHeader from "@/components/MyHeader";
import MyFooter from "@/components/MyFooter";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const workSans = Work_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`dark ${workSans.className}`}
      suppressHydrationWarning
    >
      <body className="overflow-y-auto bg-white dark:bg-gray-900 text-black dark:text-white">
        <MyHeader />
        {children}
        <MyFooter />
      </body>
    </html>
  );
}
