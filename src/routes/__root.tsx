import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { ArrowLeft, Home, MapPinned } from "lucide-react";
import { useEffect, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ScrollToTop } from "@/components/ScrollToTop";
import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { createClient } from "../lib/supabase/client";
import { ThemeProvider } from "../components/ThemeToggle";

function NotFoundComponent() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-cream px-4 py-12 sm:px-6">
      <div
        aria-hidden="true"
        className="absolute -left-12 top-10 h-32 w-32 rotate-12 border-2 border-black bg-sky sm:h-44 sm:w-44"
      />
      <div
        aria-hidden="true"
        className="absolute -right-10 bottom-12 h-28 w-28 -rotate-12 border-2 border-black bg-peach sm:h-40 sm:w-40"
      />

      <div className="neu-border relative z-10 max-w-md bg-white p-8 text-center sm:p-10">
        <div className="neu-border mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-lavender">
          <MapPinned className="h-8 w-8" strokeWidth={2.5} />
        </div>

        <p className="font-mono text-xs font-bold uppercase tracking-widest text-gray-500">
          Error 404
        </p>
        <h1 className="mt-2 text-3xl font-black sm:text-4xl">Page not found</h1>
        <p className="mt-3 text-sm text-gray-600 sm:text-base">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="neu-border neu-press inline-flex items-center justify-center gap-2 bg-black px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider text-cream"
          >
            <Home className="h-4 w-4" strokeWidth={2.5} />
            Go home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="neu-border neu-press inline-flex items-center justify-center gap-2 bg-white px-5 py-3 font-mono text-xs font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2.5} />
            Go back
          </button>
        </div>
      </div>
    </main>
  );
}

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "CampusConnect" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  notFoundComponent: NotFoundComponent,
  shellComponent: RootShell,
  component: RootComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <TooltipProvider delayDuration={200}>
          {children}
          <Toaster />
          <ScrollToTop />
        </TooltipProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const router = useRouter();
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        {/* Required: nested routes render here. Removing <Outlet /> breaks all child routes. */}
        <Outlet />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
