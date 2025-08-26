import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/src/providers/theme-provider";
import { ClerkProvider } from "@clerk/nextjs";

const font = DM_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flowtomic",
  description: "Automate your work with Flowtomic",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" suppressHydrationWarning>
        <body className={`${font.className} no-scrollbar antialiased`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            // enableSystem
            disableTransitionOnChange
          >
            {children}
            {/* 
              <BillingProvider>
              <ModalProvider>
                <Toaster />
              </ModalProvider>
            </BillingProvider> */}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
