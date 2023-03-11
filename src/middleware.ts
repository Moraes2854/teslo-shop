import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { IUser } from './interfaces/user';

export async function middleware(req: NextRequest) {
    
    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    if ( !session ) {

        const requestedPage = req.nextUrl.pathname;
        const url = req.nextUrl.clone();
        url.pathname = `/auth/login`;
        url.search = `page=${ requestedPage }`;

        return NextResponse.redirect( url );

    }

    const validRoles = ['admin'];

    if (req.nextUrl.pathname.startsWith('/admin')) {

        if ( !validRoles.includes( ( session.user as IUser ).role ) ) return NextResponse.redirect(new URL('/', req.url));

    }
    
    if (req.nextUrl.pathname.startsWith('/api/admin')) {

        if ( !validRoles.includes( ( session.user as IUser ).role ) ) return NextResponse.redirect(new URL('/api/unauthorized', req.url));

    }
    
    return NextResponse.next();
    
}

export const config = {
    matcher: ['/checkout/:path*', '/admin/:path*', '/api/admin/:path*']
}

// See "Matching Paths" below to learn more
// export const config = {
// //   matcher: '/about/:path*',
//     matcher: [
//         // '/api/:path', 
//         '/api/entries/:path'
//     ]
// }