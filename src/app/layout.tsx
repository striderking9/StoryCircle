// src/app/layout.tsx
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Mon Blog",
  description: "Blog Medium-like avec mode sombre",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    // suppressHydrationWarning permet de ne pas bloquer sur un tout petit mismatch restant
    <html lang="fr" suppressHydrationWarning>
      <body className="bg-white dark:bg-gray-900 transition-colors">
        <Providers>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
