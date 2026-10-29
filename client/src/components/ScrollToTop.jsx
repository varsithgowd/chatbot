import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Ensures that navigating between pages always scrolls the window to the top (0, 0),
 * preventing the new page from preserving the previous page's scroll position.
 */
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
