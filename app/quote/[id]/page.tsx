import { notFound } from 'next/navigation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Force dynamic rendering to prevent build-time function execution
export const dynamic = 'force-dynamic';
export const revalidate = 0;
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Download,
  Share2,
  CheckCircle,
  Clock,
  DollarSign,
  Hammer,
  Ruler,
  Package,
} from 'lucide-react';
import { formatCurrency } from '@/lib/usa-utils';

interface QuotePageProps {
  params: {
    id: string;
  };
  searchParams: {
    c?: string; // Crisp session ID for analytics
  };
}

// Mock function to fetch quote data
// In a real implementation, this would query your database
async function getQuoteById(id: string) {
  // This is a mock implementation
  // In production, you'd query your database using the quote ID

  const mockQuote = {
    id: id,
    status: 'active',
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    material: 'Quartz',
    sqft: 45,
    edgeProfile: 'Bullnose',
    sinkCutouts: 1,
    backsplashLf: 12,
    zipcode: '20151',
    subtotal: 3575.0,
    tax: 303.88,
    total: 3878.88,
    taxRate: 0.085,
    lineItems: [
      {
        description: 'Quartz Countertop (45 sq ft)',
        quantity: 45,
        unitPrice: 65,
        amount: 2925.0,
      },
      {
        description: 'Bullnose Edge Profile',
        quantity: 1,
        unitPrice: 240,
        amount: 240.0,
      },
      {
        description: 'Sink Cutout (1)',
        quantity: 1,
        unitPrice: 150,
        amount: 150.0,
      },
      {
        description: 'Quartz Backsplash (12 linear ft)',
        quantity: 12,
        unitPrice: 45.5,
        amount: 546.0,
      },
      {
        description: 'Professional Installation',
        quantity: 1,
        unitPrice: 965.25,
        amount: 965.25,
      },
    ],
    estimatedCompletion: '2-3 weeks',
    validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  };

  // Check if this looks like a valid quote ID
  if (!id.startsWith('Q') || id.length < 8) {
    return null;
  }

  return mockQuote;
}

export default async function QuotePage({
  params,
  searchParams,
}: QuotePageProps) {
  const quote = await getQuoteById(params.id);

  if (!quote) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const isExpired = new Date() > new Date(quote.expiresAt);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                <FileText className="h-8 w-8 text-blue-600" />
                Quote #{quote.id}
              </h1>
              <p className="text-gray-600 mt-1">
                LUX Cabinets & Stones - Premium Countertop Installation
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors ${
                  isExpired 
                    ? 'border-transparent bg-destructive text-destructive-foreground' 
                    : 'border-transparent bg-primary text-primary-foreground'
                }`}
              >
                {isExpired ? 'Expired' : 'Valid'}
              </div>
              <div className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                {quote.status}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Project Details */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Hammer className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Material</p>
                      <p className="font-medium">{quote.material}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <Ruler className="h-4 w-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Square Footage</p>
                      <p className="font-medium">{quote.sqft} sq ft</p>
                    </div>
                  </div>
                  {quote.edgeProfile && (
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Package className="h-4 w-4 text-purple-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Edge Profile</p>
                        <p className="font-medium">{quote.edgeProfile}</p>
                      </div>
                    </div>
                  )}
                  {quote.sinkCutouts > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-orange-100 p-2 rounded-full">
                        <Package className="h-4 w-4 text-orange-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Sink Cutouts</p>
                        <p className="font-medium">{quote.sinkCutouts}</p>
                      </div>
                    </div>
                  )}
                  {quote.backsplashLf > 0 && (
                    <div className="flex items-center gap-3">
                      <div className="bg-teal-100 p-2 rounded-full">
                        <Ruler className="h-4 w-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Backsplash</p>
                        <p className="font-medium">
                          {quote.backsplashLf} linear ft
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Line Items */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Quote Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {quote.lineItems.map((item, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                    >
                      <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × {formatCurrency(item.unitPrice)}
                        </p>
                      </div>
                      <p className="font-medium">
                        {formatCurrency(item.amount)}
                      </p>
                    </div>
                  ))}

                  <div className="border-t border-gray-200 pt-3 mt-4">
                    <div className="flex justify-between items-center py-1">
                      <p className="text-gray-600">Subtotal</p>
                      <p className="font-medium">
                        {formatCurrency(quote.subtotal)}
                      </p>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <p className="text-gray-600">
                        Tax ({(quote.taxRate * 100).toFixed(1)}%)
                      </p>
                      <p className="font-medium">{formatCurrency(quote.tax)}</p>
                    </div>
                    <div className="flex justify-between items-center py-2 border-t border-gray-200 mt-2">
                      <p className="text-lg font-bold text-gray-900">Total</p>
                      <p className="text-lg font-bold text-blue-600">
                        {formatCurrency(quote.total)}
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quote Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Quote Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Created</p>
                  <p className="font-medium">{formatDate(quote.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Valid Until</p>
                  <p
                    className={`font-medium ${isExpired ? 'text-red-600' : 'text-green-600'}`}
                  >
                    {formatDate(quote.validUntil)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimated Completion</p>
                  <p className="font-medium">{quote.estimatedCompletion}</p>
                </div>
                {quote.zipcode && (
                  <div>
                    <p className="text-sm text-gray-500">Service Area</p>
                    <p className="font-medium">{quote.zipcode}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Ready to Proceed?</CardTitle>
                <CardDescription>
                  Contact us to schedule your consultation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="lg">
                  <Phone className="mr-2 h-4 w-4" />
                  Call (571) 555-0123
                </Button>
                <Button variant="outline" className="w-full">
                  <Mail className="mr-2 h-4 w-4" />
                  Email Us
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardHeader>
                <CardTitle>LUX Cabinets & Stones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>25557 Donegal Dr, Chantilly, VA 20151</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-gray-500" />
                  <span>(571) 555-0123</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Licensed & Insured</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>Serving VA, MD & DC</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> This quote is valid for 30 days from the
            creation date. Prices may vary based on final measurements and
            material selection. A site visit is required for final pricing
            confirmation.
          </p>
        </div>
      </div>
    </div>
  );
}
