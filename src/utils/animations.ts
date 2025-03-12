
import { useEffect, useState, useRef, RefObject } from 'react';

export const useInView = (ref: RefObject<HTMLElement>, options = {}, once = true) => {
  const [isInView, setIsInView] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        if (once && ref.current) {
          observer.unobserve(ref.current);
        }
      } else if (!once) {
        setIsInView(false);
      }
    }, {
      threshold: 0.1,
      ...options,
    });
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref, options, once]);
  
  return isInView;
};

export const useParallax = (ref: RefObject<HTMLElement>, speed = 0.1) => {
  useEffect(() => {
    if (!ref.current) return;
    
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const element = ref.current;
      if (element) {
        element.style.transform = `translateY(${scrollY * speed}px)`;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [ref, speed]);
};

export const useScrollPosition = () => {
  const [scrollPosition, setScrollPosition] = useState(0);
  
  useEffect(() => {
    const updatePosition = () => {
      setScrollPosition(window.scrollY);
    };
    
    window.addEventListener('scroll', updatePosition);
    
    updatePosition();
    
    return () => window.removeEventListener('scroll', updatePosition);
  }, []);
  
  return scrollPosition;
};

export const useLazyLoad = (ref: RefObject<HTMLImageElement>) => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        const img = ref.current;
        if (img && img.dataset.src) {
          img.src = img.dataset.src;
          img.onload = () => setIsLoaded(true);
        }
        observer.unobserve(entry.target);
      }
    });
    
    observer.observe(ref.current);
    
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [ref]);
  
  return isLoaded;
};
