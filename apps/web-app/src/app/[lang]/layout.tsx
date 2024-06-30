import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";

import { cn } from "@monorepo/ui";
import { Toaster } from "@monorepo/ui/sonner";
import { ThemeProvider } from "@monorepo/ui/theme";

import { TRPCReactProvider } from "~/trpc/react";

import "~/app/globals.css";
import "react-day-picker/dist/style.css";

import { CSPostHogProvider } from "~/providers/posthog/CSPostHogProvider";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === "production"
      ? "https://vercel.com"
      : "http://localhost:3000",
  ),
  title: "Full T3 App",
  description: "Complete monorepo with shared backend for web & mobile apps",
  openGraph: {
    title: "Full T3 App",
    description: "Complete monorepo with shared backend for web & mobile apps",
    url: "https://vercel.com",
    siteName: "Full T3 App",
  },
  twitter: {
    card: "summary_large_image",
    site: "@vercel",
    creator: "@vercel",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function LocaleLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  return (
    <html lang={lang}>
      <body
        className={cn(
          "min-h-screen bg-background font-sans text-foreground antialiased",
          GeistSans.variable,
          GeistMono.variable,
        )}
      >
        <CSPostHogProvider>
          <TRPCReactProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
              {children}
              <Toaster richColors position="bottom-center" />
            </ThemeProvider>
          </TRPCReactProvider>
        </CSPostHogProvider>
      </body>
    </html>
  );
}
