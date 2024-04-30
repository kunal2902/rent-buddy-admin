import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { crmJwtConstant } from "./utils/config/config";

const protectedRoutes = ["/"];
const publicRoutes = ["/login"];

export default async function middleware(req: NextRequest) {
	const path = req.nextUrl.pathname;
	const isProtectedRoute = protectedRoutes.includes(path);
	const isPublicRoute = publicRoutes.includes(path);

	const cookie = cookies().get(crmJwtConstant)?.value;

	if (isProtectedRoute && !cookie) {
		// Redirect to /login if accessing a protected route without authentication
		console.log("Redirecting to login due to unauthenticated access");
		return NextResponse.redirect(new URL("/login", req.nextUrl));
	}

	if (isPublicRoute && cookie) {
		// Redirect authenticated users away from the /login page
		console.log("Redirecting authenticated user away from the login page");
		return NextResponse.redirect(new URL("/", req.nextUrl));
	}

	// Allow the request to continue to the next middleware or route handler
	return NextResponse.next();
}
