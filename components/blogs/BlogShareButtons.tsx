'use client';

import { useState } from 'react';
import { APP_URL } from '@/lib/site-config';

interface BlogShareButtonsProps {
  title: string;
  slug: string;
  compact?: boolean;
}

/**
 * Social share buttons for blog posts.
 * Supports compact mode (icon-only, for header) and full mode (with label, standalone section).
 * Buttons: Twitter/X, LinkedIn, Copy Link with "Copied!" feedback.
 */
export default function BlogShareButtons({ title, slug, compact = false }: BlogShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const postUrl = `${APP_URL}/blogs/${slug}`;

  const shareOnTwitter = () => {
    const params = new URLSearchParams({
      text: title,
      url: postUrl,
      via: 'ShaikhSamir786',
    });
    window.open(`https://twitter.com/intent/tweet?${params.toString()}`, '_blank', 'noopener,noreferrer,width=550,height=450');
  };

  const shareOnLinkedIn = () => {
    const params = new URLSearchParams({ url: postUrl });
    window.open(`https://www.linkedin.com/sharing/share-offsite/?${params.toString()}`, '_blank', 'noopener,noreferrer,width=550,height=450');
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(postUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback: select from temporary input
      const input = document.createElement('input');
      input.value = postUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (compact) {
    return (
      <div className="flex items-center gap-1">
        <button
          onClick={shareOnTwitter}
          className="p-1.5 rounded-md text-text-muted hover:text-foreground hover:bg-footer-bg transition-colors"
          title="Share on X"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </button>
        <button
          onClick={shareOnLinkedIn}
          className="p-1.5 rounded-md text-text-muted hover:text-foreground hover:bg-footer-bg transition-colors"
          title="Share on LinkedIn"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
        </button>
        <button
          onClick={copyLink}
          className={`p-1.5 rounded-md transition-colors ${copied ? 'text-green-500 bg-green-50 dark:bg-green-900/20' : 'text-text-muted hover:text-foreground hover:bg-footer-bg'}`}
          title={copied ? 'Copied!' : 'Copy link'}
        >
          {copied ? (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          ) : (
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap items-center gap-3 py-6 px-5 bg-footer-bg rounded-xl border border-border-primary">
      <span className="text-sm font-medium text-foreground mr-1">Share this post</span>
      <button
        onClick={shareOnTwitter}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted bg-background border border-border-primary rounded-lg hover:text-foreground hover:border-text-muted transition-colors"
        title="Share on X"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
        X
      </button>
      <button
        onClick={shareOnLinkedIn}
        className="flex items-center gap-2 px-3 py-1.5 text-sm text-text-muted bg-background border border-border-primary rounded-lg hover:text-foreground hover:border-text-muted transition-colors"
        title="Share on LinkedIn"
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
        LinkedIn
      </button>
      <button
        onClick={copyLink}
        className={`flex items-center gap-2 px-3 py-1.5 text-sm border rounded-lg transition-colors ${copied ? 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'text-text-muted bg-background border-border-primary hover:text-foreground hover:border-text-muted'}`}
        title={copied ? 'Copied!' : 'Copy link'}
      >
        {copied ? (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        )}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  );
}
