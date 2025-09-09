/**
 * Role utility functions for user authorization
 */

export type UserRole = 'CLIENT' | 'STAFF' | 'ADMIN';

/**
 * Check if user has CLIENT role
 */
export function isClient(role?: string): boolean {
  return role === 'CLIENT';
}

/**
 * Check if user has STAFF or ADMIN role
 */
export function isStaffOrAdmin(role?: string): boolean {
  return role === 'STAFF' || role === 'ADMIN';
}

/**
 * Check if user has ADMIN role
 */
export function isAdmin(role?: string): boolean {
  return role === 'ADMIN';
}

/**
 * Check if user has STAFF role
 */
export function isStaff(role?: string): boolean {
  return role === 'STAFF';
}

/**
 * Get user role display name
 */
export function getRoleDisplayName(role?: string): string {
  switch (role) {
    case 'CLIENT':
      return 'Client';
    case 'STAFF':
      return 'Staff';
    case 'ADMIN':
      return 'Administrator';
    default:
      return 'Guest';
  }
}

/**
 * Get admin dashboard URL from environment or fallback
 */
export function getAdminDashboardUrl(): string {
  return process.env.ADMIN_APP_URL || 'https://admin.example.com';
}
