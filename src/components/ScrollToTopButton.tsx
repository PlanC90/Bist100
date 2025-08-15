import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

interface ScrollToTopButtonProps {
  isDark: boolean;
}

export const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ isDark }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) { // Show button after scrolling 300px
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`fixed bottom-6 right-6 p-3 rounded-full shadow-lg transition-opacity duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
        isDark
          ? 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-slate-900'
          : 'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-400 focus:ring-offset-slate-100'
      } ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-label="Yukarı Çık"
    >
      <ArrowUp className="h-6 w-6" />
    </button>
  );
};
