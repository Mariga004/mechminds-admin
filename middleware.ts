import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

// Enhanced CORS handler
function handleCors(request: NextRequest) {
    const origin = request.headers.get("origin");
    const allowedOrigins = [
        "https://elimuroboticss.vercel.app", // Store frontend on Vercel
        "https://elimurobotics.vercel.app", // Admin backend on Vercel
    ];
    
    // Check if origin is allowed
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);
    
    const corsHeaders = {
        "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "https://elimuroboticss.vercel.app",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With, Origin",
        "Access-Control-Allow-Credentials": "false",
        "Access-Control-Max-Age": "86400",
        "Vary": "Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
    };
    
    return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
    });
}

// Create the Clerk middleware handler
const clerkMiddleware = authMiddleware({
    publicRoutes: [
        "/api/:path*", // All API routes are public
        "/", // Homepage
        "/sign-in(.*)", // Sign in pages
        "/sign-up(.*)", // Sign up pages
        "/post-sign-in"
    ],
    ignoredRoutes: [
        "/api/webhook", // Webhook routes should be ignored by Clerk
        "/api/uploadthing", // File upload routes
    ]
});

// Main exported middleware
export default function middleware(request: NextRequest, event: NextFetchEvent) {
    // Handle preflight OPTIONS requests
    if (request.method === "OPTIONS") {
        return handleCors(request);
    }
    
    // Add CORS headers to all API responses
    if (request.nextUrl.pathname.startsWith("/api/")) {
        const response = clerkMiddleware(request, event);
        
        // If it's a Response, add CORS headers
        if (response instanceof Response) {
            const origin = request.headers.get("origin");
            const allowedOrigins = [
                "https://elimuroboticss.vercel.app", // Store frontend on Vercel
                "https://elimurobotics.vercel.app", // Admin backend on Vercel
            ];
            
            const isAllowedOrigin = origin && allowedOrigins.includes(origin);
            
            response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "https://elimuroboticss.vercel.app");
            response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
            response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, Origin");
            response.headers.set("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
        }
        
        return response;
    }
    
    // For non-API routes, just use Clerk middleware
    return clerkMiddleware(request, event);
}

export const config = {
    matcher: [
        // Skip Next.js internals and all static files
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};

// import { authMiddleware } from "@clerk/nextjs";
// import { NextResponse } from "next/server";
// import type { NextRequest, NextFetchEvent } from "next/server";

// // Enhanced CORS handler
// function handleCors(request: NextRequest) {
//     const origin = request.headers.get("origin");
//     const allowedOrigins = [
//         "http://52.55.177.115", // Frontend via Nginx (port 80)
//         "http://52.55.177.115:3000", // Frontend direct (port 3000)
//         "https://your-admin-backend.vercel.app", // Admin backend on Vercel
//         "https://52.55.177.115", // HTTPS frontend
//     ];
    
//     // Check if origin is allowed
//     const isAllowedOrigin = origin && allowedOrigins.includes(origin);
    
//     const corsHeaders = {
//         "Access-Control-Allow-Origin": isAllowedOrigin ? origin : "http://52.55.177.115",
//         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With, Origin",
//         "Access-Control-Allow-Credentials": "false",
//         "Access-Control-Max-Age": "86400",
//         "Vary": "Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
//     };
    
//     return new NextResponse(null, {
//         status: 200,
//         headers: corsHeaders,
//     });
// }

// // Create the Clerk middleware handler
// const clerkMiddleware = authMiddleware({
//     publicRoutes: [
//         "/api/:path*", // All API routes are public
//         "/", // Homepage
//         "/sign-in(.*)", // Sign in pages
//         "/sign-up(.*)", // Sign up pages
//         "/post-sign-in"
//     ],
//     ignoredRoutes: [
//         "/api/webhook", // Webhook routes should be ignored by Clerk
//         "/api/uploadthing", // File upload routes
//     ]
// });

// // Main exported middleware
// export default function middleware(request: NextRequest, event: NextFetchEvent) {
//     // Handle preflight OPTIONS requests
//     if (request.method === "OPTIONS") {
//         return handleCors(request);
//     }
    
//     // Add CORS headers to all API responses
//     if (request.nextUrl.pathname.startsWith("/api/")) {
//         const response = clerkMiddleware(request, event);
        
//         // If it's a Response, add CORS headers
//         if (response instanceof Response) {
//             const origin = request.headers.get("origin");
//             const allowedOrigins = [
//                 "http://52.55.177.115", // Frontend via Nginx
//                 "http://52.55.177.115:3000", // Frontend direct
//                 "https://your-admin-backend.vercel.app", // Admin backend on Vercel
//                 "https://52.55.177.115", // HTTPS frontend
//             ];
            
//             const isAllowedOrigin = origin && allowedOrigins.includes(origin);
            
//             response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : "http://52.55.177.115");
//             response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
//             response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, Origin");
//             response.headers.set("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
//         }
        
//         return response;
//     }
    
//     // For non-API routes, just use Clerk middleware
//     return clerkMiddleware(request, event);
// }

// export const config = {
//     matcher: [
//         // Skip Next.js internals and all static files
//         "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
//         // Always run for API routes
//         "/(api|trpc)(.*)",
//     ],
// };