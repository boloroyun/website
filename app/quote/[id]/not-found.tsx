import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileX, Home, Phone } from 'lucide-react';

export default function QuoteNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="container mx-auto px-4 max-w-lg">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <FileX className="h-8 w-8 text-red-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Quote Not Found
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              We couldn't find the quote you're looking for. The quote may have
              expired, been removed, or you may have an incorrect quote ID.
            </p>

            <div className="space-y-3 pt-4">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>

              <Button variant="outline" asChild className="w-full">
                <Link href="/contact">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Need help? Call us at{' '}
                <a
                  href="tel:5715550123"
                  className="text-blue-600 hover:underline"
                >
                  (571) 555-0123
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
