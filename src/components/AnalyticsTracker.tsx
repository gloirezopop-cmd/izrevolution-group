import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Generate a random session ID if not exists
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session_id');
  if (!sessionId) {
    sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem('analytics_session_id', sessionId);
  }
  return sessionId;
};

export const AnalyticsTracker = () => {
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const trackPageView = async () => {
      try {
        await supabase.from('analytics_events').insert({
          event_type: 'page_view',
          path: location.pathname,
          user_id: user?.id || null,
          session_id: getSessionId(),
          metadata: {
            search: location.search,
            referrer: document.referrer || 'Direct'
          }
        });
      } catch (err) {
        // Silently fail for analytics
        console.error('Failed to track analytics', err);
      }
    };

    trackPageView();
  }, [location.pathname, user?.id]);

  return null; // This component doesn't render anything
};
