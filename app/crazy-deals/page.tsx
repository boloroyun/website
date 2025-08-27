import { getCrazyDeals } from '@/actions/offers.actions';
import { notFound } from 'next/navigation';

export default async function CrazyDealsPage() {
  const crazyDealsResult = await getCrazyDeals();

  if (!crazyDealsResult.success) {
    notFound();
  }

  const crazyDeals = crazyDealsResult.data || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-center mb-8">Crazy Deals 🔥</h1>

        {crazyDeals.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-xl text-gray-600">
              No crazy deals available at the moment.
            </p>
            <p className="text-gray-500 mt-2">
              Check back soon for amazing offers!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {crazyDeals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                {deal.images && deal.images.length > 0 && (
                  <img
                    src={deal.images[0].url}
                    alt={deal.title}
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-2">{deal.title}</h3>
                  <a
                    href={deal.link}
                    className="inline-block bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition-colors"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
