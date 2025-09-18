import { NextResponse, NextRequest } from 'next/server'

export default function middleware(request: NextRequest) {
	const tokenObj = JSON.parse(request.cookies.get('token')?.value ?? '{}');
	const { token, isAdmin }: { token: String | undefined, isAdmin: boolean | undefined } = tokenObj
	const requestUrl = request.nextUrl

	if (token) {
		if (isAdmin && !requestUrl.pathname.startsWith('/dashboard')) {
			return NextResponse.redirect(new URL('/dashboard', request.url));
		} else if (!isAdmin && !requestUrl.pathname.startsWith('/me')) {
			return NextResponse.redirect(new URL('/me', request.url));
		}
	} else {
		if (requestUrl.pathname.startsWith('/me') || requestUrl.pathname.startsWith('/dashboard')) {
			return NextResponse.redirect(new URL('/auth', request.url));
		}
	}
	return NextResponse.next();
}

export const config = {
	matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)']
}