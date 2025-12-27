import { useEffect, useRef, useCallback } from 'react';

interface AnalyticsEvent {
  sessionId: string;
  pageUrl: string;
  pageTitle: string | null;
  eventType: string;
  x: number;
  y: number;
  viewportWidth: number;
  viewportHeight: number;
  elementTag: string | null;
  elementId: string | null;
  elementClass: string | null;
  elementText: string | null;
  userAgent: string | null;
}

const getSessionId = (): string => {
  let sessionId = sessionStorage.getItem('pigbank_session_id');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem('pigbank_session_id', sessionId);
  }
  return sessionId;
};

export function useAnalyticsTracker() {
  const eventsBuffer = useRef<AnalyticsEvent[]>([]);
  const flushTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const sessionId = useRef<string>(getSessionId());

  const flushEvents = useCallback(async () => {
    if (eventsBuffer.current.length === 0) return;
    
    const eventsToSend = [...eventsBuffer.current];
    eventsBuffer.current = [];
    
    try {
      await fetch('/api/analytics/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ events: eventsToSend }),
      });
    } catch (error) {
      console.error('Failed to send analytics events:', error);
      eventsBuffer.current = [...eventsToSend, ...eventsBuffer.current];
    }
  }, []);

  const scheduleFlush = useCallback(() => {
    if (flushTimeoutRef.current) {
      clearTimeout(flushTimeoutRef.current);
    }
    flushTimeoutRef.current = setTimeout(flushEvents, 2000);
  }, [flushEvents]);

  const trackEvent = useCallback((e: MouseEvent | TouchEvent, eventType: string) => {
    const target = e.target as HTMLElement;
    
    let x: number, y: number;
    if ('touches' in e) {
      x = e.touches[0]?.clientX || 0;
      y = e.touches[0]?.clientY || 0;
    } else {
      x = e.clientX;
      y = e.clientY;
    }

    const event: AnalyticsEvent = {
      sessionId: sessionId.current,
      pageUrl: window.location.pathname,
      pageTitle: document.title,
      eventType,
      x,
      y,
      viewportWidth: window.innerWidth,
      viewportHeight: window.innerHeight,
      elementTag: target.tagName?.toLowerCase() || null,
      elementId: target.id || null,
      elementClass: target.className?.toString()?.slice(0, 200) || null,
      elementText: target.textContent?.slice(0, 100) || null,
      userAgent: navigator.userAgent,
    };

    eventsBuffer.current.push(event);
    
    if (eventsBuffer.current.length >= 10) {
      flushEvents();
    } else {
      scheduleFlush();
    }
  }, [flushEvents, scheduleFlush]);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => trackEvent(e, 'click');
    const handleTouchStart = (e: TouchEvent) => trackEvent(e, 'tap');

    document.addEventListener('click', handleClick, { passive: true });
    document.addEventListener('touchstart', handleTouchStart, { passive: true });

    const handleBeforeUnload = () => {
      if (eventsBuffer.current.length > 0) {
        const data = JSON.stringify({ events: eventsBuffer.current });
        navigator.sendBeacon('/api/analytics/events', new Blob([data], { type: 'application/json' }));
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (flushTimeoutRef.current) {
        clearTimeout(flushTimeoutRef.current);
      }
      flushEvents();
    };
  }, [trackEvent, flushEvents]);
}
