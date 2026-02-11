import type { Metadata } from "next";
import { Space_Grotesk, Outfit, Inter } from "next/font/google";
import "./globals.css";
import { ReactQueryProvider, ThemeProvider } from "@/components/providers";
import { SidebarProvider } from "@/components/ui/sidebar";

const inter = Inter({
    variable: "--font-inter",
    subsets: ["latin"],
    weight: "400",
});

const outfit = Outfit({
    variable: "--font-outfit",
    subsets: ["latin"],
    weight: "400",
});

const spaceGrotesk = Space_Grotesk({
    variable: "--font-space-grotesk",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    title: "Bhumio Interview",
    description:
        "This app consists of all the assignments for the Bhumio interview.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body
                className={`${outfit.variable} ${inter.variable} ${spaceGrotesk.variable} antialiased`}
            >
                <ReactQueryProvider>
                    <ThemeProvider>
                        <SidebarProvider>{children}</SidebarProvider>
                    </ThemeProvider>
                </ReactQueryProvider>
            </body>
        </html>
    );
}
