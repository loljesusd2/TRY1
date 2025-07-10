
import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Navbar } from "@/components/navigation/navbar";
import { BottomNav } from "@/components/navigation/bottom-nav";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
  display: 'swap',
});

const poppins = Poppins({ 
  weight: ['300', '400', '500', '600', '700'],
  subsets: ["latin"],
  variable: "--font-poppins",
  display: 'swap',
});

export const metadata: Metadata = {
  title: "BeautyGO - Servicios de Belleza a Domicilio en Orlando",
  description: "Encuentra y reserva con los mejores profesionales de belleza en Orlando, FL. Servicios de cabello, uñas, cuidado de la piel, maquillaje y más, directamente en tu hogar.",
  keywords: "belleza, servicios a domicilio, Orlando, Florida, cabello, uñas, maquillaje, cuidado de la piel, cejas",
  authors: [{ name: "BeautyGO" }],
  creator: "BeautyGO",
  publisher: "BeautyGO",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://beautygo.app'),
  alternates: {
    canonical: '/',
    languages: {
      'es-US': '/es',
      'en-US': '/en',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'es_US',
    url: 'https://beautygo.app',
    title: 'BeautyGO - Servicios de Belleza a Domicilio en Orlando',
    description: 'Encuentra y reserva con los mejores profesionales de belleza en Orlando, FL.',
    siteName: 'BeautyGO',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BeautyGO - Servicios de Belleza a Domicilio en Orlando',
    description: 'Encuentra y reserva con los mejores profesionales de belleza en Orlando, FL.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-sans antialiased`}>
        <Providers>
          <div className="min-h-screen bg-background flex flex-col">
            <Navbar />
            <main className="flex-1 pb-16 md:pb-0">
              {children}
            </main>
            <BottomNav />
          </div>
        </Providers>
      </body>
    </html>
  );
}
