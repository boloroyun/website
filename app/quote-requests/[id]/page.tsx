import { notFound } from 'next/navigation';
import prisma from '@/lib/prisma';
import { Metadata } from 'next';

// Define metadata with noindex directive to keep it private
export const metadata: Metadata = {
  title: 'Quote Request Details | LUX Cabinets & Stones',
  description: 'View your quote request details',
  robots: 'noindex',
};

async function getRequest(id: string, token?: string) {
  // If token is provided, we need to verify it matches the publicToken
  if (token) {
    return prisma.quoteRequest.findFirst({
      where: { id, publicToken: token },
      include: {
        images: true,
      },
    });
  }

  // If no token is provided, the page won't be accessible to public users
  return null;
}

export default async function PublicQuoteRequest({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { token?: string };
}) {
  const qr = await getRequest(params.id, searchParams.token);

  if (!qr) return notFound();

  // Format image URLs
  const imageUrls = qr.images.map((img) => img.secureUrl);

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-md p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-green-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-green-800">
              Quote Request Successful
            </h3>
            <div className="mt-2 text-sm text-green-700">
              <p>
                Your quote request has been successfully submitted. Our team
                will review it and contact you shortly.
              </p>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-2xl font-semibold">
        Thanks! We received your request.
      </h1>
      <p className="text-sm text-muted-foreground">
        Save this page for your records.
      </p>

      <section className="rounded border bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-medium">Your Details</h2>
        <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
          <dt className="text-muted-foreground">Name</dt>
          <dd>{qr.customerName || '—'}</dd>
          <dt className="text-muted-foreground">Email</dt>
          <dd>{qr.email}</dd>
          <dt className="text-muted-foreground">Phone</dt>
          <dd>{qr.phone ?? '—'}</dd>
          <dt className="text-muted-foreground">ZIP</dt>
          <dd>{qr.zip ?? '—'}</dd>
          <dt className="text-muted-foreground">Product</dt>
          <dd>{qr.productName ?? '—'}</dd>
          <dt className="text-muted-foreground">SKU</dt>
          <dd>{qr.sku ?? '—'}</dd>
          <dt className="text-muted-foreground">Notes</dt>
          <dd>{qr.notes ?? '—'}</dd>
          <dt className="text-muted-foreground">Status</dt>
          <dd>
            <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-blue-50 text-blue-700">
              {qr.status}
            </span>
          </dd>
          <dt className="text-muted-foreground">Submitted</dt>
          <dd>{qr.createdAt.toLocaleString()}</dd>
        </dl>
      </section>

      <section className="rounded border bg-white p-4 shadow-sm">
        <h2 className="mb-2 font-medium">Uploaded Images</h2>
        {imageUrls.length === 0 ? (
          <p className="text-sm text-muted-foreground">No images</p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {imageUrls.map((url, i) => (
              <a
                key={i}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="block"
              >
                <img
                  src={url}
                  alt={`Upload ${i + 1}`}
                  className="h-28 w-full rounded object-cover hover:opacity-90 transition-opacity"
                />
              </a>
            ))}
          </div>
        )}
      </section>

      <div className="text-center text-sm text-muted-foreground">
        <p>
          We'll contact you shortly with more information about your quote
          request.
        </p>
        <p className="mt-2">If you have any questions, please contact us.</p>
      </div>
    </main>
  );
}
