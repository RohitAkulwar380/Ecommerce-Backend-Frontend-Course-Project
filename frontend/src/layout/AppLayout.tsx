import { Outlet, Link, NavLink } from "react-router-dom";
import { ShoppingCart, Moon, SunMedium } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { UserMenu } from "@/components/ui/user-menu";
import { useAuth } from "@/context/AuthContext";

export function AppLayout() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    const stored = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    const shouldDark = stored ? stored === "dark" : prefersDark;
    root.classList.toggle("dark", shouldDark);
    setIsDark(shouldDark);
  }, []);

  function toggleTheme() {
    const root = document.documentElement;
    const next = !isDark;
    root.classList.toggle("dark", next);
    setIsDark(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  }

  function setHoverAlt(on: boolean) {
    const root = document.documentElement;
    root.classList.toggle("alt", on);
  }

  const { user, isAdmin } = useAuth();
  
  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr]">
      <header className="sticky top-0 z-40 border-b-2 bg-background">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <Link to="/" className="font-black text-2xl tracking-tight brutal">
            neo.shop
          </Link>
          <nav className="flex items-center gap-2">
            <NavLink
              to="/"
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 brutal swap-opposite bg-accent text-accent-foreground dark:bg-primary dark:text-primary-foreground",
                  isActive && "dark:outline dark:outline-2 dark:outline-accent"
                )
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/categories"
              className={({ isActive }) =>
                cn(
                  "px-3 py-2 brutal swap-opposite bg-accent text-accent-foreground dark:bg-primary dark:text-primary-foreground",
                  isActive && "dark:outline dark:outline-2 dark:outline-accent"
                )
              }
            >
              Categories
            </NavLink>
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 brutal swap-opposite bg-accent text-accent-foreground dark:bg-primary dark:text-primary-foreground",
                    isActive && "dark:outline dark:outline-2 dark:outline-accent"
                  )
                }
              >
                Admin
              </NavLink>
            )}
            {!user && (
              <>
                <NavLink
                  to="/login"
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 brutal swap-opposite bg-accent text-accent-foreground dark:bg-primary dark:text-primary-foreground",
                      isActive && "dark:outline dark:outline-2 dark:outline-accent"
                    )
                  }
                >
                  Login
                </NavLink>
                <NavLink
                  to="/signup"
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2 brutal swap-opposite bg-accent text-accent-foreground dark:bg-primary dark:text-primary-foreground",
                      isActive && "dark:outline dark:outline-2 dark:outline-accent"
                    )
                  }
                >
                  Sign up
                </NavLink>
              </>
            )}
            <NavLink to="/cart">
              <Button className="brutal swap-opposite bg-accent text-accent-foreground dark:bg-primary dark:text-primary-foreground transition-colors flex items-center gap-2">
                <ShoppingCart size={18} /> Cart
              </Button>
            </NavLink>
            {user && <UserMenu />}
            <Button
              onClick={toggleTheme}
              className="brutal swap-opposite bg-accent text-accent-foreground dark:bg-primary dark:text-primary-foreground transition-colors"
            >
              {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
            </Button>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl w-full px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
