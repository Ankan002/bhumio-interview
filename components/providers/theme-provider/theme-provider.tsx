"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

const ThemeProvider = ({
    children,
    ...props
}: React.ComponentProps<typeof NextThemesProvider>) => {
    return (
        <NextThemesProvider
            {...props}
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
            storageKey="theme"
        >
            {children}
        </NextThemesProvider>
    );
};

export default ThemeProvider;
