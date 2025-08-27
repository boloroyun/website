'use client';

import React, { useState } from 'react';
import { MessageCircle, User, Calendar, Send } from 'lucide-react';

interface BlogCommentsProps {
  postId: string;
}

const BlogComments: React.FC<BlogCommentsProps> = ({ postId }) => {
  const [commentText, setCommentText] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [website, setWebsite] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock comments data - replace with actual API call
  const comments = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      content:
        "This is such a helpful article! I've been planning my kitchen renovation and these tips are exactly what I needed.",
      createdAt: new Date('2024-01-15'),
      approved: true,
      replies: [
        {
          id: '2',
          name: 'LUX Team',
          email: 'team@luxcabinets.com',
          content:
            "Thank you for the kind words, Sarah! We're so glad you found the article helpful. Feel free to reach out if you have any specific questions about your renovation.",
          createdAt: new Date('2024-01-16'),
          approved: true,
        },
      ],
    },
    {
      id: '3',
      name: 'Mike Chen',
      email: 'mike@example.com',
      content:
        'Great breakdown of the different cabinet styles. The photos really help visualize the differences.',
      createdAt: new Date('2024-01-14'),
      approved: true,
      replies: [],
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Reset form
    setCommentText('');
    setName('');
    setEmail('');
    setWebsite('');
    setIsSubmitting(false);

    // Show success message (you can implement a proper notification system)
    alert(
      'Thank you for your comment! It will be reviewed before being published.'
    );
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <section className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <div className="mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2" />
          Comments ({comments.length})
        </h3>
        <p className="text-gray-600">
          Share your thoughts and join the conversation below.
        </p>
      </div>

      {/* Comment Form */}
      <div className="mb-12 p-6 bg-gray-50 rounded-xl">
        <h4 className="text-lg font-semibold text-gray-900 mb-4">
          Leave a Comment
        </h4>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Comment Text */}
          <div>
            <label
              htmlFor="comment"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Comment *
            </label>
            <textarea
              id="comment"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
              placeholder="Share your thoughts..."
            />
          </div>

          {/* Personal Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Name *
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="Your name"
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email *
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="website"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Website (Optional)
            </label>
            <input
              type="url"
              id="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              placeholder="https://yourwebsite.com"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !commentText.trim() ||
              !name.trim() ||
              !email.trim()
            }
            className="inline-flex items-center px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Post Comment
              </>
            )}
          </button>

          <p className="text-sm text-gray-500 mt-2">
            Your email address will not be published. Comments are moderated and
            may take some time to appear.
          </p>
        </form>
      </div>

      {/* Existing Comments */}
      <div className="space-y-8">
        {comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-gray-200 pb-8 last:border-b-0 last:pb-0"
          >
            {/* Main Comment */}
            <div className="flex space-x-4">
              <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-6 h-6 text-gray-400" />
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h5 className="font-semibold text-gray-900">
                    {comment.name}
                  </h5>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(comment.createdAt)}</span>
                  </div>
                </div>

                <p className="text-gray-700 leading-relaxed mb-3">
                  {comment.content}
                </p>

                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors">
                  Reply
                </button>
              </div>
            </div>

            {/* Replies */}
            {comment.replies.length > 0 && (
              <div className="ml-16 mt-6 space-y-6">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="flex space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h6 className="font-semibold text-gray-900">
                          {reply.name}
                        </h6>
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-3 h-3 mr-1" />
                          <span>{formatDate(reply.createdAt)}</span>
                        </div>
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Author
                        </span>
                      </div>

                      <p className="text-gray-700 leading-relaxed">
                        {reply.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* No Comments Message */}
        {comments.length === 0 && (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              No comments yet
            </h4>
            <p className="text-gray-600">
              Be the first to share your thoughts on this article!
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogComments;
