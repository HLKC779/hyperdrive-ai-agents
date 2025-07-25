import { ReactNode, useEffect } from 'react';
import DOMPurify from 'dompurify';

interface SecurityValidatorProps {
  children: ReactNode;
}

// XSS protection utility functions
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'ol', 'ul', 'li', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    ALLOWED_ATTR: ['class'],
    FORBID_TAGS: ['script', 'iframe', 'object', 'embed', 'base', 'link', 'meta'],
    FORBID_ATTR: ['onerror', 'onload', 'onclick', 'onmouseover', 'onfocus', 'onblur', 'onchange', 'onsubmit']
  });
};

export const sanitizeText = (text: string): string => {
  // Remove any HTML tags and dangerous characters
  return text.replace(/<[^>]*>/g, '')
             .replace(/javascript:/gi, '')
             .replace(/data:/gi, '')
             .replace(/vbscript:/gi, '')
             .replace(/on\w+\s*=/gi, '');
};

export const validateUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:', 'mailto:'].includes(parsed.protocol);
  } catch {
    return false;
  }
};

export const sanitizeJson = (obj: any): any => {
  if (typeof obj === 'string') {
    return sanitizeText(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeJson);
  }
  if (obj && typeof obj === 'object') {
    const cleaned: any = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cleaned[sanitizeText(key)] = sanitizeJson(obj[key]);
      }
    }
    return cleaned;
  }
  return obj;
};

// Content Security Policy headers
export const CSP_HEADER = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://esm.sh https://cdn.jsdelivr.net",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data: https:",
  "connect-src 'self' https://*.supabase.co https://api.openai.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "object-src 'none'"
].join('; ');

const SecurityValidator = ({ children }: SecurityValidatorProps) => {
  useEffect(() => {
    // Set security headers for the current page
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = CSP_HEADER;
    document.head.appendChild(meta);

    // Add X-Frame-Options header equivalent
    const frameOptions = document.createElement('meta');
    frameOptions.httpEquiv = 'X-Frame-Options';
    frameOptions.content = 'DENY';
    document.head.appendChild(frameOptions);

    // Add X-Content-Type-Options header equivalent
    const contentType = document.createElement('meta');
    contentType.httpEquiv = 'X-Content-Type-Options';
    contentType.content = 'nosniff';
    document.head.appendChild(contentType);

    return () => {
      document.head.removeChild(meta);
      document.head.removeChild(frameOptions);
      document.head.removeChild(contentType);
    };
  }, []);

  return <>{children}</>;
};

export default SecurityValidator;