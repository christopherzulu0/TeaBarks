import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { LocaleProvider } from "@/components/locale-provider";
import { AppProviders } from "@/components/providers/app-providers";
import { AppClerkProvider } from "@/components/providers/clerk-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const sourceSerif = Source_Serif_4({
  variable: "--font-serif",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "TeaBarks — Evidence-Based Discussion & Accountability",
    template: "%s | TeaBarks",
  },
  description:
    "Where ideas are challenged through evidence. Analyze, debate, and document public content with evidence-based arguments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <AppClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LocaleProvider>
              <AppProviders>
                <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
                <Toaster />
              </AppProviders>
            </LocaleProvider>
          </ThemeProvider>
        </AppClerkProvider>
      </body>
    </html>
  );
}
