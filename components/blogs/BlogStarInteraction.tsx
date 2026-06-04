'use client';

import { useState, useEffect } from 'react';

interface BlogStarInteractionProps {
  slug: string;
  initialStars: number;
}

export default function BlogStarInteraction({ slug, initialStars }: BlogStarInteractionProps) {
  const [stars, setStars] = useState(initialStars);
  const [hasStarred, setHasStarred] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const starred = localStorage.getItem(`starred_${slug}`);
      if (starred) {
        setHasStarred(true);
      } else {
        // Show tooltip if not starred
        const showTimer = setTimeout(() => setShowTooltip(true), 2000);
        const hideTimer = setTimeout(() => setShowTooltip(false), 8000);
        return () => {
          clearTimeout(showTimer);
          clearTimeout(hideTimer);
        };
      }
    }
  }, [slug]);

  const handleStar = async () => {
    if (hasStarred) return;
    
    // Optimistic UI update
    setStars(prev => prev + 1);
    setHasStarred(true);
    setShowTooltip(false);
    localStorage.setItem(`starred_${slug}`, 'true');
    
    try {
      const res = await fetch(`/api/blogs/${slug}/star`, { method: 'POST' });
      if (!res.ok) throw new Error('Failed to star');
    } catch (err) {
      // Revert if failed
      setStars(prev => prev - 1);
      setHasStarred(false);
      localStorage.removeItem(`starred_${slug}`);
    }
  };

  return (
    <div className="relative flex items-center">
      {/* Tooltip */}
      <div 
        className={`absolute right-0 top-full mt-2 w-max bg-gray-900 text-white text-[10px] font-medium px-2.5 py-1.5 rounded shadow-lg transition-all duration-500 z-10 ${
          showTooltip && !hasStarred ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        If you like this blog, do leave a star
        <div className="absolute bottom-full right-3 border-[4px] border-transparent border-b-gray-900"></div>
      </div>
      
      <button 
        onClick={handleStar}
        disabled={hasStarred}
        className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full transition-all duration-300 ${
          hasStarred 
            ? 'bg-yellow-50 text-yellow-600 cursor-default' 
            : 'bg-gray-50 text-gray-500 hover:bg-yellow-50 hover:text-yellow-500 cursor-pointer shadow-sm border border-gray-100 hover:border-yellow-200'
        }`}
        title={hasStarred ? "You starred this post" : "Star this post"}
      >
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
        </svg>
        <span className="font-medium">{stars}</span>
      </button>
    </div>
  );
}
