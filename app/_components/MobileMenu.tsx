'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Menu, X, User, ExternalLink } from 'lucide-react';
import { isClient, isStaffOrAdmin, getAdminDashboardUrl } from '@/lib/roles';
import SignOutButton from './SignOutButton';

interface MobileMenuProps {
  publicLinks: Array<{ href: string; label: string }>;
  user?: {
    name?: string | null;
    email?: string | null;
    role?: string;
  } | null;
  userRole?: string;
}

export default function MobileMenu({
  publicLinks,
  user,
  userRole,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={toggleMenu}
        className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
        aria-expanded="false"
      >
        <span className="sr-only">Open main menu</span>
        {isOpen ? (
          <X className="block h-6 w-6" aria-hidden="true" />
        ) : (
          <Menu className="block h-6 w-6" aria-hidden="true" />
        )}
      </button>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={closeMenu}
          />

          {/* Menu Panel */}
          <div className="fixed right-0 top-0 h-full w-full max-w-sm bg-background shadow-lg">
            <div className="flex h-16 items-center justify-between border-b px-4">
              <span className="font-semibold text-foreground">Menu</span>
              <button
                onClick={closeMenu}
                className="rounded-md p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex flex-col p-4 space-y-4">
              {/* Public Links */}
              <div className="space-y-2">
                {publicLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={closeMenu}
                    className="block rounded-md px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>

              <div className="border-t pt-4">
                {!user ? (
                  // Not signed in
                  <Link
                    href="/auth/signin"
                    onClick={closeMenu}
                    className="flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
                  >
                    <User className="mr-2 h-4 w-4" />
                    Sign in
                  </Link>
                ) : (
                  // Signed in
                  <div className="space-y-4">
                    {/* User Info */}
                    <div className="rounded-md bg-muted p-3">
                      <p className="font-medium text-foreground">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.email}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Role: {userRole}
                      </p>
                    </div>

                    {/* Role-based Links */}
                    <div className="space-y-2">
                      {isClient(userRole) && (
                        <Link
                          href="/account"
                          onClick={closeMenu}
                          className="block rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Account
                        </Link>
                      )}

                      {isStaffOrAdmin(userRole) && (
                        <a
                          href={getAdminDashboardUrl()}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={closeMenu}
                          className="flex items-center rounded-md border border-input bg-background px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-colors"
                        >
                          Dashboard
                          <ExternalLink className="ml-2 h-3 w-3" />
                        </a>
                      )}
                    </div>

                    {/* Sign Out Button */}
                    <div className="pt-2">
                      <SignOutButton
                        className="w-full justify-center"
                        variant="outline"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
