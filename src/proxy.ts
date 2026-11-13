import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { projectSlugs } from "./content/types";
import { routing } from "./i18n/routing";

const handleLocale = createMiddleware(routing);
const projectPath = new RegExp(`^/(${routing.locales.join("|")})/projects/([^/]+)/?$`);

export default function proxy(request: NextRequest) {
  // With Cache Components a page can't reject unknown params before its static
  // shell is sent (that would be a 200). Unknown case studies are sent to a path
  // that matches nothing, so the localized not-found page answers with a real 404.
  const match = request.nextUrl.pathname.match(projectPath);
  if (match && !(projectSlugs as readonly string[]).includes(match[2])) {
    return NextResponse.rewrite(new URL(`/${match[1]}/projects/${match[2]}/not-found`, request.url));
  }
  return handleLocale(request);
}

export const config = {
  // Every path except Next internals, Vercel internals and files with an extension.
  matcher: "/((?!api|_next|_vercel|.*\\..*).*)",
};
