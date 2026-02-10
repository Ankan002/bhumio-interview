import type { Metadata } from "next";
import { DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers";

const DMSans = DM_Sans({
    subsets: ["latin"],
    variable: "--font-sans",
});

const DMMono = DM_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
    weight: ["300", "400", "500"],
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
        <html lang="en">
            <body
                className={`${DMSans.variable} ${DMMono.variable} antialiased`}
            >
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
