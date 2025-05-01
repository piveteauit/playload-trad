import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Récupérer la locale depuis le localStorage si disponible
  const localeParams = request.nextUrl.searchParams.get('locale')
  const locale = localeParams || request.cookies.get('payload-locale')?.value || 'fr'

  if (localeParams !== locale) request.nextUrl.searchParams.set('locale', locale)

  // Ajouter la locale aux headers pour qu'elle soit accessible dans l'application
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-payload-locale', locale)

  // Retourner la requête modifiée avec les nouveaux headers
  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
