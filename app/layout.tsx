import type { Metadata } from "next";
import { Geist, Geist_Mono, Source_Serif_4 } from "next/font/google";
import { LocaleProvider } from "@/components/locale-provider";
import { ReadingTextSizeProvider } from "@/components/reading-text-size-provider";
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
    default: "TypeReact — Evidence-Based Discussion & Accountability",
    template: "%s | TypeReact",
  },
  description:
    "Where ideas are challenged through evidence. Analyze, debate, and document public content with evidence-based arguments.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${sourceSerif.variable} h-full overflow-x-hidden antialiased`}
      suppressHydrationWarning
    >
      <body className="flex min-h-full min-w-0 flex-col overflow-x-hidden">
        <AppClerkProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <LocaleProvider>
              <ReadingTextSizeProvider>
                <AppProviders>
                  <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
                  <Toaster />
                </AppProviders>
              </ReadingTextSizeProvider>
            </LocaleProvider>
          </ThemeProvider>
        </AppClerkProvider>
      </body>
    </html>
  );
}
