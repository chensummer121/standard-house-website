"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X, Home, Building2, Calculator, FolderOpen, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "House Designs", href: "/house-designs", icon: Building2 },
  { name: "Configurator", href: "/configurator", icon: Calculator },
  { name: "Projects", href: "/projects", icon: FolderOpen },
  { name: "Investment", href: "/investment", icon: Calculator },
  { name: "About Us", href: "/about", icon: Users },
];

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="container-custom">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/logo.png" alt="Standard House" className="h-10 w-auto" />
            <div>
              <span className="text-xl font-display font-bold text-earth-800">Standard</span>
              <span className="text-xl font-display font-bold text-primary"> House</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="px-4 py-2 text-sm font-medium text-earth-700 hover:text-primary transition-colors rounded-lg hover:bg-earth-50"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/configurator" className="btn-primary text-sm">
              Start Building
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-earth-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div className={cn("lg:hidden", mobileMenuOpen ? "block" : "hidden")}>
          <div className="py-4 space-y-1 border-t border-earth-200">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center gap-3 px-4 py-3 text-base font-medium text-earth-700 hover:text-primary hover:bg-earth-50 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
            <div className="pt-4 px-4">
              <Link href="/configurator" className="btn-primary w-full text-center block">
                Start Building
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
