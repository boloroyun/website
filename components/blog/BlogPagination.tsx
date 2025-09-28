'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BlogPaginationProps {
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  baseUrl: string;
  searchParams?: Record<string, string | undefined>;
}

const BlogPagination= ({
  currentPage,
  totalPages,
  hasNextPage,
  hasPrevPage,
  baseUrl,
  searchParams = {},
}) => {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams();

    // Add page parameter
    if (page > 1) {
      params.set('page', page.toString());
    }

    // Add other search parameters
    Object.entries(searchParams).forEach(([key, value]) => {
      if (value && value.trim()) {
        params.set(key, value);
      }
    });

    const queryString = params.toString();
    return queryString ? `${baseUrl}?${queryString}` : baseUrl;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const range = [];
    const rangeWithDots = [];

    // Calculate the range of pages to show
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i);
    }

    // Add first page
    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    // Add main range
    rangeWithDots.push(...range);

    // Add last page
    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    // Remove duplicates and return
    return rangeWithDots.filter(
      (item, index, arr) => arr.indexOf(item) === index
    );
  };

  const pageNumbers = getPageNumbers();

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-lg shadow-sm">
      <div className="flex flex-1 justify-between sm:hidden">
        {/* Mobile Navigation */}
        {hasPrevPage ? (
          <Link
            href={buildUrl(currentPage - 1)}
            className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Previous
          </Link>
        ) : (
          <span className="relative inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
            Previous
          </span>
        )}

        {hasNextPage ? (
          <Link
            href={buildUrl(currentPage + 1)}
            className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next
          </Link>
        ) : (
          <span className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-gray-50 px-4 py-2 text-sm font-medium text-gray-400 cursor-not-allowed">
            Next
          </span>
        )}
      </div>

      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>

        <div>
          <nav
            className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            aria-label="Pagination"
          >
            {/* Previous Button */}
            {hasPrevPage ? (
              <Link
                href={buildUrl(currentPage - 1)}
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-l-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed">
                <span className="sr-only">Previous</span>
                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
              </span>
            )}

            {/* Page Numbers */}
            {pageNumbers.map((pageNum, index) => {
              if (pageNum === '...') {
                return (
                  <span
                    key={`dots-${index}`}
                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-gray-700 ring-1 ring-inset ring-gray-300 focus:outline-offset-0"
                  >
                    ...
                  </span>
                );
              }

              const isCurrentPage = pageNum === currentPage;

              return (
                <Link
                  key={pageNum}
                  href={buildUrl(pageNum as number)}
                  className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ring-1 ring-inset ring-gray-300 focus:z-20 focus:outline-offset-0 ${
                    isCurrentPage
                      ? 'z-10 bg-black text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {/* Next Button */}
            {hasNextPage ? (
              <Link
                href={buildUrl(currentPage + 1)}
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-400 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0"
              >
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </Link>
            ) : (
              <span className="relative inline-flex items-center rounded-r-md px-2 py-2 text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed">
                <span className="sr-only">Next</span>
                <ChevronRight className="h-5 w-5" aria-hidden="true" />
              </span>
            )}
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default BlogPagination;
