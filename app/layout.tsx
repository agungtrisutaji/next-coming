import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

// Site configuration - update these for production
const siteConfig = {
  name: "SYNTHETICA",
  tagline: "Intelligence Reimagined. Automation Perfected.",
  description: "SYNTHETICA is building the future of AI-powered automation. Join our waitlist for exclusive early access to revolutionary intelligent systems that transform how businesses operate.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://synthetica.ai",
  ogImage: "/og-image.svg",
  twitterHandle: "@synthetica_ai",
  themeColor: "#ff0033",
};

export const metadata: Metadata = {
  // Base URL for resolving relative URLs in metadata
  metadataBase: new URL(siteConfig.url),
  
  // Basic metadata
  title: {
    default: `${siteConfig.name} | Coming Soon`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: [
    "AI",
    "artificial intelligence",
    "automation",
    "machine learning",
    "enterprise automation",
    "intelligent systems",
    "AI platform",
    "process automation",
    "SYNTHETICA",
    "coming soon",
    "technology",
    "startup",
  ],
  authors: [{ name: siteConfig.name }],
  creator: siteConfig.name,
  publisher: siteConfig.name,
  
  // Favicon and icons
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  
  // Manifest for PWA (optional future enhancement)
  manifest: "/manifest.json",
  
  // Open Graph metadata
  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: `${siteConfig.name} | Coming Soon`,
    description: siteConfig.tagline,
    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.name} - ${siteConfig.tagline}`,
        type: "image/svg+xml",
      },
    ],
  },
  
  // Twitter Card metadata
  twitter: {
    card: "summary_large_image",
    site: siteConfig.twitterHandle,
    creator: siteConfig.twitterHandle,
    title: `${siteConfig.name} | Coming Soon`,
    description: siteConfig.tagline,
    images: [siteConfig.ogImage],
  },
  
  // Robots and indexing
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  
  // Verification (add your IDs when ready)
  // verification: {
  //   google: "your-google-verification-id",
  //   yandex: "your-yandex-verification-id",
  // },
  
  // Additional metadata
  category: "technology",
  classification: "Business",
};

// Viewport configuration (separated in Next.js 14+)
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: siteConfig.themeColor },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        {/* Additional meta tags for enhanced SEO */}
        <meta name="application-name" content={siteConfig.name} />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.name} />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        
        {/* Preconnect to external resources for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}


