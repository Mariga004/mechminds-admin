import { authMiddleware } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import type { NextRequest, NextFetchEvent } from "next/server";

// Enhanced CORS handler
function handleCors(request: NextRequest) {
    const origin = request.headers.get("origin");
    const allowedOrigins = [
        process.env.FRONTEND_STORE_URL || "http://192.168.13.163:3001",
        "http://192.168.13.163:3000", // Backend URL
        "http://192.168.13.163:3001", // Frontend URL
    ];

    // Check if origin is allowed
    const isAllowedOrigin = origin && allowedOrigins.includes(origin);
    
    const corsHeaders = {
        "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigins[0],
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With, Origin",
        "Access-Control-Allow-Credentials": "false", // Set to true only if needed
        "Access-Control-Max-Age": "86400", // 24 hours
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
        '/post-sign-in'
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
                process.env.FRONTEND_STORE_URL || "http://192.168.13.163:3001",
                "http://192.168.13.163:3000",
                "http://192.168.13.163:3001",
            ];
            
            const isAllowedOrigin = origin && allowedOrigins.includes(origin);
            
            response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : allowedOrigins[0]);
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
        "/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)",
        // Always run for API routes
        "/(api|trpc)(.*)",
    ],
};
// import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";

// // Create route matchers
// const isPublicRoute = createRouteMatcher([
//     "/api/(.*)", // All API routes are public
//     "/", // Homepage
//     "/sign-in(.*)", // Sign in pages
//     "/post-sign-in"
// ]);

// const isIgnoredRoute = createRouteMatcher([
//     "/api/webhook", // Webhook routes should be ignored by Clerk
//     "/api/uploadthing", // File upload routes
// ]);

// // Enhanced CORS handler
// function handleCors(request: NextRequest) {
//     const origin = request.headers.get("origin");
//     const allowedOrigins = [
//         process.env.FRONTEND_STORE_URL || "http://192.168.13.163:3001",
//         "http://192.168.13.163:3000", // Backend URL
//         "http://192.168.13.163:3001", // Frontend URL
//     ];

//     // Check if origin is allowed
//     const isAllowedOrigin = origin && allowedOrigins.includes(origin);
    
//     const corsHeaders = {
//         "Access-Control-Allow-Origin": isAllowedOrigin ? origin : allowedOrigins[0],
//         "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS, PATCH",
//         "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept, X-Requested-With, Origin",
//         "Access-Control-Allow-Credentials": "false", // Set to true only if needed
//         "Access-Control-Max-Age": "86400", // 24 hours
//         "Vary": "Origin, Access-Control-Request-Method, Access-Control-Request-Headers"
//     };

//     return new NextResponse(null, {
//         status: 200,
//         headers: corsHeaders,
//     });
// }

// // Add CORS headers to response
// function addCorsHeaders(response: NextResponse, request: NextRequest) {
//     const origin = request.headers.get("origin");
//     const allowedOrigins = [
//         process.env.FRONTEND_STORE_URL || "http://192.168.13.163:3001",
//         "http://192.168.13.163:3000",
//         "http://192.168.13.163:3001",
//     ];
    
//     const isAllowedOrigin = origin && allowedOrigins.includes(origin);
    
//     response.headers.set("Access-Control-Allow-Origin", isAllowedOrigin ? origin : allowedOrigins[0]);
//     response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
//     response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept, X-Requested-With, Origin");
//     response.headers.set("Vary", "Origin, Access-Control-Request-Method, Access-Control-Request-Headers");
    
//     return response;
// }

// // Main exported middleware
// export default clerkMiddleware(async (auth, request) => {
//     // Handle preflight OPTIONS requests
//     if (request.method === "OPTIONS") {
//         return handleCors(request);
//     }

//     // Skip Clerk auth for ignored routes
//     if (isIgnoredRoute(request)) {
//         const response = NextResponse.next();
//         // Add CORS headers for API routes
//         if (request.nextUrl.pathname.startsWith("/api/")) {
//             return addCorsHeaders(response, request);
//         }
//         return response;
//     }

//     // For protected routes (non-public routes), protect them
//     if (!isPublicRoute(request)) {
//         const { userId } = await auth();
//         if (!userId) {
//             // Redirect to sign-in page if not authenticated
//             return NextResponse.redirect(new URL('/sign-in', request.url));
//         }
//     }

//     // Add CORS headers to API responses
//     if (request.nextUrl.pathname.startsWith("/api/")) {
//         const response = NextResponse.next();
//         return addCorsHeaders(response, request);
//     }

//     return NextResponse.next();
// });

// export const config = {
//     matcher: [
//         // Skip Next.js internals and all static files
//         "/((?!_next|[^?]\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).)",
//         // Always run for API routes
//         "/(api|trpc)(.*)",
//     ],
// };