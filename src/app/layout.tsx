import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";

const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flow9 - Personal Finance",
  description: "Flow9 - Personal Life OS - Quản lý tài chính cá nhân",
  icons: {
    icon: "/thumbnail.jpg",
  },
  openGraph: {
    title: "Flow9 - Personal Finance",
    description: "Flow9 - Personal Life OS - Quản lý tài chính cá nhân",
    url: "https://flow9-os.vercel.app",
    siteName: "Flow9",
    images: [
      {
        url: "https://flow9-os.vercel.app/thumbnail.jpg",
        width: 1165,
        height: 896,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Flow9 - Personal Finance",
    description: "Flow9 - Personal Life OS - Quản lý tài chính cá nhân",
    images: ["https://flow9-os.vercel.app/thumbnail.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className="dark">
      <body className={`${spaceMono.className} antialiased bg-[#000000] text-[#FAFAFA]`}>
        <AuthProvider>
          <LanguageProvider>
            {children}
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
