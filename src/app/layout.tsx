import type { Metadata } from "next";
import { Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/hooks/useAuth";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { TutorialProvider } from "@/contexts/TutorialContext";

const spaceMono = Space_Mono({ weight: ["400", "700"], subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://flow9-os.vercel.app"),
  title: "Flow9 - Personal Finance",
  description: "Flow9 - Personal Life OS - Quản lý tài chính cá nhân",
  openGraph: {
    type: "website",
    url: "https://flow9-os.vercel.app",
    title: "Flow9 - Personal Finance",
    description: "Flow9 - Personal Life OS - Quản lý tài chính cá nhân",
    siteName: "Flow9",
    locale: "vi_VN",
    images: [
      {
        url: "https://flow9-os.vercel.app/thumbnail.jpg",
        width: 1200,
        height: 630,
        alt: "Flow9 - Personal Finance Thumbnail",
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
            <TutorialProvider>
              {children}
            </TutorialProvider>
          </LanguageProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
