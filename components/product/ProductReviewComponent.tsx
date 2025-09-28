'use client';

import { ChevronDown, Star } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '../ui/textarea';
import { useForm } from '@mantine/form';
import Link from 'next/link';

interface ProductReview {
  id: string;
  rating: number;
  review: string;
  reviewCreatedAt: Date;
  verified: boolean;
  reviewBy: string | null;
}

interface ProductReviewComponentProps {
  reviews: ProductReview[];
  averageRating: number;
  totalReviews: number;
}

const ProductReviewComponent= ({
  reviews,
  averageRating,
  totalReviews,
}) => {
  const [sortBy, setSortBy] = useState('Most Recent');
  const form = useForm({
    initialValues: {
      rating: '',
      review: '',
      title: '',
    },
    validate: {
      rating: (value) => (value ? null : 'Rating is required.'),
      review: (value) =>
        value.trim().length > 0 ? null : 'Review cannot be empty.',
      title: (value) => (value ? null : 'Title is required.'),
    },
  });
  // Calculate rating breakdown from reviews
  const calculateRatingBreakdown = () => {
    const breakdown = [
      { stars: 5, count: 0 },
      { stars: 4, count: 0 },
      { stars: 3, count: 0 },
      { stars: 2, count: 0 },
      { stars: 1, count: 0 },
    ];

    reviews.forEach((review) => {
      const starIndex = breakdown.findIndex(
        (item) => item.stars === Math.floor(review.rating)
      );
      if (starIndex !== -1) {
        breakdown[starIndex].count++;
      }
    });

    return breakdown.map((item) => ({
      ...item,
      percentage:
        totalReviews > 0 ? Math.round((item.count / totalReviews) * 100) : 0,
    }));
  };

  const ratingBreakdown = calculateRatingBreakdown();

  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'Highest Rated':
        return b.rating - a.rating;
      case 'Lowest Rated':
        return a.rating - b.rating;
      case 'Most Recent':
      default:
        return (
          new Date(b.reviewCreatedAt).getTime() -
          new Date(a.reviewCreatedAt).getTime()
        );
    }
  });

  // Get user initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };
  return (
    <div className="ownContainer p-4 mt-[20px]">
      <h2 className="heading">Customer Reviews</h2>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/3">
          {totalReviews > 0 ? (
            <>
              <div className="flex items-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-6 h-6 ${
                      star <= Math.round(averageRating)
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
                <span className="ml-2 text-xl font-semibold">
                  {averageRating.toFixed(1)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Based on {totalReviews} reviews
              </p>
              {ratingBreakdown.map((rating) => (
                <div key={rating.stars} className="flex items-center mb-2">
                  <div className="flex items-center w-24">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= rating.stars
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5 ml-2">
                    <div
                      className="bg-yellow-400 h-2.5 rounded-full"
                      style={{ width: `${rating.percentage}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-gray-600 w-12">
                    {rating.percentage}%
                  </span>
                  <span className="ml-2 text-sm text-gray-600 w-12">
                    ({rating.count})
                  </span>
                </div>
              ))}
              <Link href={'/review'}>
                <button className="text-sm text-blue-600 mt-2">
                  See all reviews
                </button>
              </Link>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">No reviews yet</p>
              <p className="text-gray-400 text-sm mt-2">
                Be the first to review this product!
              </p>
            </div>
          )}
        </div>
        <div className="md:w-2/3">
          <div className="flex justify-between mb-4">
            <Dialog>
              <DialogTrigger asChild>
                <Button>Leave a Review</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <h2>Submit Your Review</h2>
                </DialogHeader>

                <form
                // onSubmit={form.onSubmit(handleSubmit)}
                >
                  {/* Rating Select */}
                  <div style={{ marginBottom: '1rem' }}>
                    <Select
                      onValueChange={(value) =>
                        form.setFieldValue('rating', value)
                      }
                      value={form.values.rating}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Rating" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Rating</SelectLabel>
                          <SelectItem value="1">1 Star</SelectItem>
                          <SelectItem value="2">2 Stars</SelectItem>
                          <SelectItem value="3">3 Stars</SelectItem>
                          <SelectItem value="4">4 Stars</SelectItem>
                          <SelectItem value="5">5 Stars</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Review Textarea */}
                  <div style={{ marginBottom: '1rem' }}>
                    <Textarea
                      placeholder="Write your review here"
                      {...form.getInputProps('review')}
                    />
                  </div>

                  {/* Submit Button */}
                  <DialogFooter>
                    <Button type="submit">Submit Review</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none border rounded py-2 px-4 pr-8 leading-tight focus:outline focus:border-blue-500"
              >
                {' '}
                <option>Most Recent</option>
                <option>Highest Rated</option>
                <option>Lowest Rated</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="space-y-6">
            {sortedReviews.length > 0 ? (
              sortedReviews.slice(0, 5).map((review) => (
                <div key={review.id} className="border-t pt-4">
                  <div className="flex items-start mb-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                      {getInitials(review.reviewBy || 'Anonymous')}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center mb-1">
                        <span className="font-semibold mr-2">
                          {review.reviewBy || 'Anonymous'}
                        </span>
                        {review.verified && (
                          <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                            Verified
                          </span>
                        )}
                        <span className="text-gray-500 text-sm ml-auto">
                          {formatDate(review.reviewCreatedAt)}
                        </span>
                      </div>
                      <div className="flex mb-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-4 h-4 ${
                              star <= review.rating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed">
                        {review.review}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 border-t">
                <p className="text-gray-500">
                  No reviews available for this product.
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Be the first to share your experience!
                </p>
              </div>
            )}

            {sortedReviews.length > 5 && (
              <div className="text-center pt-4">
                <Link href="/review">
                  <button className="text-blue-600 hover:text-blue-800 font-medium">
                    View all {totalReviews} reviews
                  </button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductReviewComponent;
