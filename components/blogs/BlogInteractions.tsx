'use client';

import { useState } from 'react';

interface Comment {
  name: string;
  comment: string;
  createdAt: string;
}

interface BlogInteractionsProps {
  slug: string;
  initialComments: Comment[];
}

export default function BlogInteractions({ slug, initialComments }: BlogInteractionsProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments || []);
  const [name, setName] = useState('');
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !commentText.trim()) return;
    
    setIsSubmitting(true);
    setError('');
    
    try {
      const res = await fetch(`/api/blogs/${slug}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, comment: commentText }),
      });
      
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to post comment');
      }
      
      const data = await res.json();
      setComments(prev => [...prev, data.comment]);
      setName('');
      setCommentText('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div id="comments" className="mt-16 pt-10 border-t border-border-primary">
      <div className="mb-12">
        <h3 className="text-2xl font-semibold text-foreground mb-6" style={{ fontFamily: "var(--font-playfair)" }}>
          Comments ({comments.length})
        </h3>
        
        <form onSubmit={handleCommentSubmit} className="mb-10 bg-footer-bg p-6 sm:p-8 rounded-2xl border border-border-primary shadow-sm">
          <h4 className="text-lg font-medium text-foreground mb-5">Leave a comment</h4>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg border border-red-100 dark:border-red-800">
              {error}
            </div>
          )}
          
          <div className="space-y-5">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1.5">Name</label>
              <input
                id="name"
                type="text"
                required
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border-primary text-foreground placeholder-text-muted rounded-xl focus:ring-2 focus:ring-border-primary focus:border-text-muted outline-none transition-all"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-foreground mb-1.5">Comment</label>
              <textarea
                id="comment"
                required
                maxLength={1000}
                rows={4}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="w-full px-4 py-3 bg-background border border-border-primary text-foreground placeholder-text-muted rounded-xl focus:ring-2 focus:ring-border-primary focus:border-text-muted outline-none transition-all resize-y"
                placeholder="What are your thoughts?"
              />
            </div>
            
            <button
              type="submit"
              disabled={isSubmitting || !name.trim() || !commentText.trim()}
              className="px-8 py-3 bg-foreground text-background font-medium rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
            >
              {isSubmitting ? 'Posting...' : 'Post Comment'}
            </button>
          </div>
        </form>

        <div className="space-y-6">
          {comments.length === 0 ? (
            <p className="text-text-muted italic">No comments yet. Be the first to share your thoughts!</p>
          ) : (
            comments.map((comment, index) => (
              <div key={index} className="pb-6 border-b border-border-primary last:border-0">
                <div className="flex justify-between items-baseline mb-2">
                  <h5 className="font-medium text-foreground">{comment.name}</h5>
                  <span className="text-xs text-text-muted tabular-nums">{formatDate(comment.createdAt)}</span>
                </div>
                <p className="text-text-secondary whitespace-pre-wrap">{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
