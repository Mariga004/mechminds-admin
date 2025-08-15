/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["res.cloudinary.com"],
    },
    experimental: {
        serverActions: true,
        appDir: true,
    },
    output: "standalone",

    // Security and CORS headers
    async headers() {
        return [
            {
                // Apply CORS headers to all API routes
                source: "/api/:path*",
                headers: [
                    // CORS headers
                    {
                        key: "Access-Control-Allow-Origin",
                        value: process.env.FRONTEND_STORE_URL || "https://elimurobotics.shop",
                    },
                    {
                        key: "Access-Control-Allow-Methods",
                        value: "GET, POST, PUT, DELETE, OPTIONS, PATCH",
                    },
                    {
                        key: "Access-Control-Allow-Headers",
                        value: "Content-Type, Authorization, Accept, X-Requested-With, Origin",
                    },
                    {
                        key: "Access-Control-Max-Age",
                        value: "86400",
                    },
                    {
                        key: "Vary",
                        value: "Origin, Access-Control-Request-Method, Access-Control-Request-Headers",
                    },
                    // Security headers
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on"
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block"
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN"
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff"
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin"
                    }
                ],
            },
            {
                // Apply security headers to all routes
                source: "/(.*)",
                headers: [
                    {
                        key: "X-DNS-Prefetch-Control",
                        value: "on"
                    },
                    {
                        key: "X-XSS-Protection",
                        value: "1; mode=block"
                    },
                    {
                        key: "X-Frame-Options",
                        value: "SAMEORIGIN"
                    },
                    {
                        key: "X-Content-Type-Options",
                        value: "nosniff"
                    },
                    {
                        key: "Referrer-Policy",
                        value: "origin-when-cross-origin"
                    }
                ],
            },
        ];
    },

    // Optional: Add redirects for better SEO (DISABLED to fix redirect loop)
    async redirects() {
        return [
            // Disable redirects temporarily to fix redirect loop
            // Uncomment and test one by one if needed
            // {
            //     source: '/:path*',
            //     has: [
            //         {
            //             type: 'host',
            //             value: 'www.elimurobotics.shop',
            //         },
            //     ],
            //     destination: 'https://elimurobotics.shop/:path*',
            //     permanent: true,
            // },
        ];
    },

    // Compiler options
    compiler: {
        // Remove console logs in production
        removeConsole: process.env.NODE_ENV === "production",
    },

    // TypeScript configuration
    typescript: {
        // Only enable if you want to ignore TypeScript errors during build
        // ignoreBuildErrors: false,
    },

    // ESLint configuration
    eslint: {
        // Only enable if you want to ignore ESLint errors during build
        // ignoreDuringBuilds: false,
    },
};

export default nextConfig;