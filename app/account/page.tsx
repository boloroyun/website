import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Shield, LogOut } from 'lucide-react';
import SignOutButton from '@/components/auth/SignOutButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function AccountPage() {
  const session = await getServerSession(authOptions);

  // Redirect to signin if not authenticated
  if (!session || !session.user) {
    redirect('/auth/signin?callbackUrl=/account');
  }

  const { user } = session;

  // Get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'STAFF':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'CLIENT':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
          <p className="mt-2 text-gray-600">
            Manage your account settings and preferences
          </p>
        </div>

        {/* Account Information Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
            <CardDescription>
              Your personal account details and role information
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* User Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Full Name
                </label>
                <p className="text-lg text-gray-900">{user.name}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  Email Address
                </label>
                <p className="text-lg text-gray-900">{user.email}</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Role
                </label>
                <Badge 
                  variant="outline" 
                  className={`w-fit ${getRoleColor(user.role)}`}
                >
                  {user.role}
                </Badge>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Account ID
                </label>
                <p className="text-sm text-gray-600 font-mono">{user.id}</p>
              </div>
            </div>

            <Separator />

            {/* Role Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">
                {user.role} Account
              </h3>
              <p className="text-sm text-blue-700">
                {user.role === 'CLIENT' && 
                  'You have client access to browse products, place orders, and manage your account.'
                }
                {user.role === 'STAFF' && 
                  'You have staff access to manage products, orders, and assist customers.'
                }
                {user.role === 'ADMIN' && 
                  'You have full administrative access to all system features and settings.'
                }
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common account actions and navigation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start" asChild>
                <a href="/profile">
                  <User className="mr-2 h-4 w-4" />
                  Edit Profile
                </a>
              </Button>

              <Button variant="outline" className="justify-start" asChild>
                <a href="/profile/orders">
                  <Calendar className="mr-2 h-4 w-4" />
                  Order History
                </a>
              </Button>

              <Button variant="outline" className="justify-start" asChild>
                <a href="/products">
                  <Shield className="mr-2 h-4 w-4" />
                  Browse Products
                </a>
              </Button>

              <Button variant="outline" className="justify-start" asChild>
                <a href="/contact">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">Account Security</CardTitle>
            <CardDescription>
              Sign out of your account to secure your session
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SignOutButton />
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Button variant="ghost" asChild>
            <a href="/">
              ← Back to Home
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
