import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import '@/styles/filemanager-fixes.css';
import '@/styles/nextui-dark-theme.css';
import AuthProvider from "@/components/providers/AuthProvider";
import NordvikUIProvider from "@/components/providers/NextUIProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nordvik Panel",
  description: "Game server management panel",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            // Fix transparent popups and modals immediately
            (function() {
              // Create style element
              const style = document.createElement('style');
              style.textContent = \`
                /* Force solid backgrounds on all dialogs and popups */
                .nextui-modal-content,
                [role="dialog"],
                [data-overlay-container="true"] > div,
                [role="menu"],
                .nextui-dropdown-menu,
                .nextui-popover-content,
                [data-backdrop-visible="true"] {
                  background-color: #0b101b !important; /* Darker navy blue background */
                  background: #0b101b !important;
                  backdrop-filter: none !important;
                  -webkit-backdrop-filter: none !important;
                  border: 1px solid #182234 !important;
                  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5) !important;
                  color: #e5e7eb !important;
                }
                
                /* Disable backdrop effects */
                [data-backdrop="true"]::before,
                [data-backdrop-visible="true"]::before {
                  display: none !important;
                }

                /* Light theme styles */
                .light [role="dialog"],
                .light [data-overlay-container="true"] > div,
                .light [role="menu"],
                .light .nextui-modal-content,
                .light .nextui-dropdown-menu,
                .light .nextui-popover-content,
                .light [data-backdrop-visible="true"] {
                  background-color: #f3f4f6 !important;
                  background: #f3f4f6 !important;
                  border: 1px solid #d1d5db !important;
                  color: #111827 !important;
                }
              \`;
              document.head.appendChild(style);
              
              // Also apply styles to any future elements
              const observer = new MutationObserver((mutations) => {
                const dialogElements = document.querySelectorAll('[role="dialog"], [role="menu"], .nextui-modal-content');
                dialogElements.forEach(el => {
                  if (el instanceof HTMLElement) {
                    if (document.documentElement.classList.contains('dark') || document.documentElement.classList.contains('theme-dark')) {
                      el.style.backgroundColor = '#0b101b';
                      el.style.color = '#e5e7eb';
                      el.style.borderColor = '#182234';
                    } else {
                      el.style.backgroundColor = '#f3f4f6';
                      el.style.color = '#111827';
                      el.style.borderColor = '#d1d5db';
                    }
                    el.style.backdropFilter = 'none';
                    el.style.webkitBackdropFilter = 'none';
                  }
                });
              });
              
              observer.observe(document.body, { 
                childList: true,
                subtree: true
              });
            })();
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <NordvikUIProvider>{children}</NordvikUIProvider>
        </AuthProvider>
        <Toaster position="top-right" richColors closeButton />
      </body>
    </html>
  );
}
