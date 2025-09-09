import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Home, LogOut, AlertTriangle } from 'lucide-react';
import SignOutButton from '@/components/auth/SignOutButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata = {
  title: '403 - Unauthorized Access | LUX Cabinets & Stones',
  description: 'You do not have permission to access this page.',
  robots: 'noindex, nofollow',
};

export default async function UnauthorizedPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <Shield className="h-8 w-8 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-600">
            403 - Access Denied
          </CardTitle>
          <CardDescription className="text-gray-600">
            You are not authorized to access this page
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Error Message */}
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-start">
              <AlertTriangle className="h-5 w-5 text-red-400 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">
                  Insufficient Permissions
                </h3>
                <p className="mt-1 text-sm text-red-700">
                  This page is restricted to CLIENT users only. 
                  {session?.user ? (
                    <>
                      {' '}Your current role is: <strong>{session.user.role}</strong>
                    </>
                  ) : (
                    ' Please sign in with a CLIENT account.'
                  )}
                </p>
              </div>
            </div>
          </div>

          {/* User Info (if logged in) */}
          {session?.user && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-800 mb-2">
                Current Session
              </h3>
              <div className="space-y-1 text-sm text-blue-700">
                <p><strong>Email:</strong> {session.user.email}</p>
                <p><strong>Role:</strong> {session.user.role}</p>
                <p><strong>Name:</strong> {session.user.name}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {session?.user ? (
              <>
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Return to Home
                  </Link>
                </Button>
                
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-3">
                    Need to switch accounts?
                  </p>
                  <SignOutButton />
                </div>
              </>
            ) : (
              <>
                <Button className="w-full" asChild>
                  <Link href="/auth/signin">
                    <Shield className="mr-2 h-4 w-4" />
                    Sign In as CLIENT
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" />
                    Return to Home
                  </Link>
                </Button>
              </>
            )}
          </div>

          {/* Help Text */}
          <div className="text-center text-sm text-gray-500">
            <p>
              If you believe this is an error, please{' '}
              <Link href="/contact" className="text-blue-600 hover:text-blue-500">
                contact support
              </Link>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
