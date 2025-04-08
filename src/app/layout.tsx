// src/app/layout.tsx
import "./globals.css";
import Providers from "./providers";
import Header from "@/components/Header";
import Footer from "@/components/Footer"; // Si vous avez un Footer

export const metadata = {
  title: "Mon Blog",
  description: "Blog Medium-like avec mode sombre",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="bg-white dark:bg-gray-900">
        <Providers>
          <Header />
          <main>{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
