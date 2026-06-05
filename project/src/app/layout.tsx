import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SessionProvider from "@/components/SessionProvider";

export const metadata: Metadata = {
  title: {
    default: "TimeElite — Дизайнерські годинники",
    template: "%s | TimeElite",
  },
  description: "Інтернет-магазин дизайнерських годинників преміум-класу. Rolex, Omega, TAG Heuer, Patek Philippe та інші бренди.",
  keywords: ["годинники", "дизайнерські годинники", "Rolex", "Omega", "TAG Heuer", "магазин годинників"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="uk">
      <body>
        <SessionProvider>
          <Header />
          <main style={{ minHeight: "calc(100vh - 140px)", paddingTop: "80px" }}>
            {children}
          </main>
          <Footer />
        </SessionProvider>
      </body>
    </html>
  );
}
