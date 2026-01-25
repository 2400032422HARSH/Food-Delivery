import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, Menu, X, LogOut, User } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const isActive = (path: string) =>
    location.pathname === path || location.pathname.startsWith(path + "/");

  const navLinks = [
    { href: "/", label: "Home", icon: "🏠" },
    { href: "/search", label: "Order Food", icon: "🍽️" },
    { href: "/orders", label: "My Orders", icon: "📦" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
      <div className="container px-4 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">HA</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-primary">Anand</h1>
              <p className="text-xs text-gray-500">Food Delivery</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-gray-600 hover:text-primary",
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-4">
            {/* Cart Icon - only show for customers */}
            {user?.role === "customer" && (
              <Link
                to="/cart"
                className="relative p-2 text-gray-600 hover:text-primary transition-colors"
              >
                <ShoppingCart className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-5 h-5 bg-primary text-white text-xs rounded-full flex items-center justify-center">
                  0
                </span>
              </Link>
            )}

            {/* User Info and Links */}
            <div className="hidden md:flex items-center gap-2">
              {user ? (
                <>
                  <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-xs font-medium text-gray-700">
                      {user.name}
                    </span>
                  </div>
                  {user.role === "restaurant" && (
                    <Link
                      to="/restaurant-dashboard"
                      className="text-xs font-medium px-3 py-1 rounded-full border border-gray-300 hover:border-primary text-gray-600 hover:text-primary transition-colors"
                    >
                      Dashboard
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      to="/admin-dashboard"
                      className="text-xs font-medium px-3 py-1 rounded-full bg-primary text-white hover:bg-orange-600 transition-colors"
                    >
                      Admin
                    </Link>
                  )}
                  <button
                    onClick={logout}
                    className="text-xs font-medium px-3 py-1 rounded-full border border-red-300 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-xs font-medium px-3 py-1 rounded-full border border-gray-300 hover:border-primary text-gray-600 hover:text-primary transition-colors"
                  >
                    Login
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 text-gray-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 space-y-3 border-t pt-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "block text-sm font-medium p-2 rounded transition-colors",
                  isActive(link.href)
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-50",
                )}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.icon} {link.label}
              </Link>
            ))}
            <div className="border-t pt-3 space-y-2">
              {user ? (
                <>
                  <div className="block text-sm font-medium p-2 rounded text-gray-700 bg-gray-50">
                    {user.name}
                  </div>
                  {user.role === "restaurant" && (
                    <Link
                      to="/restaurant-dashboard"
                      className="block text-sm font-medium p-2 rounded text-gray-600 hover:bg-gray-50"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Restaurant Dashboard
                    </Link>
                  )}
                  {user.role === "admin" && (
                    <Link
                      to="/admin-dashboard"
                      className="block text-sm font-medium p-2 rounded bg-primary text-white"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left text-sm font-medium p-2 rounded text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4 inline mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block text-sm font-medium p-2 rounded text-gray-600 hover:bg-gray-50"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Login
                </Link>
              )}
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
