import { RootProvider } from "fumadocs-ui/provider/next"
import "./global.css"
import { Inter } from "next/font/google"
import { Metadata } from "next"

const inter = Inter({
    subsets: ["latin"],
})

export const metadata: Metadata = {
    title: "Interactive Zero-Knowledge Proves Academy",
    description: "Learn ZK from 0 to 100",
    keywords: ["Zero-Knowledge", "ZK", "Proves"],
    openGraph: {
        title: "Interactive Zero-Knowledge Proves Academy",
        description: "Learn ZK from 0 to 100",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "Interactive Zero-Knowledge Proves Academy",
        description: "Learn ZK from 0 to 100",
        images: ["/twitter-image.jpg"],
    },
    other: {
        "deployment-version": new Date().toISOString(),
    },
    icons: {
        icon: [
            {
                rel: "icon",
                url: "/favicon/favicon-96x96.png",
                sizes: "96x96",
                type: "image/png",
            },
            { rel: "icon", url: "/favicon/favicon.svg", type: "image/svg+xml" },
            { rel: "shortcut icon", url: "/favicon/favicon.ico" },
        ],
        apple: "/favicon/apple-touch-icon.png",
    },
}

export default function Layout({ children }: LayoutProps<"/">) {
    return (
        <html lang="en" className={inter.className} suppressHydrationWarning>
            <body className="flex min-h-screen flex-col">
                <RootProvider>{children}</RootProvider>
            </body>
        </html>
    )
}
