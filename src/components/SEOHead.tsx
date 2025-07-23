import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  aiCapabilities?: string;
  useCases?: string;
  structuredData?: object;
}

const SEOHead = ({ 
  title, 
  description, 
  keywords,
  aiCapabilities,
  useCases,
  structuredData 
}: SEOHeadProps) => {
  const location = useLocation();

  useEffect(() => {
    // Update document title
    if (title) {
      document.title = `${title} | HyperDrive AI Agents`;
    }

    // Update meta description
    if (description) {
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', description);
      }
    }

    // Update AI-specific meta tags for AEO
    if (aiCapabilities) {
      let metaAI = document.querySelector('meta[name="ai:capabilities"]');
      if (!metaAI) {
        metaAI = document.createElement('meta');
        metaAI.setAttribute('name', 'ai:capabilities');
        document.head.appendChild(metaAI);
      }
      metaAI.setAttribute('content', aiCapabilities);
    }

    if (useCases) {
      let metaUseCases = document.querySelector('meta[name="ai:use-cases"]');
      if (!metaUseCases) {
        metaUseCases = document.createElement('meta');
        metaUseCases.setAttribute('name', 'ai:use-cases');
        document.head.appendChild(metaUseCases);
      }
      metaUseCases.setAttribute('content', useCases);
    }

    // Update keywords
    if (keywords) {
      let metaKeywords = document.querySelector('meta[name="keywords"]');
      if (!metaKeywords) {
        metaKeywords = document.createElement('meta');
        metaKeywords.setAttribute('name', 'keywords');
        document.head.appendChild(metaKeywords);
      }
      metaKeywords.setAttribute('content', keywords);
    }

    // Update canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', `${window.location.origin}${location.pathname}`);

    // Add structured data if provided
    if (structuredData) {
      const existingScript = document.querySelector('script[data-seo="page-specific"]');
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      script.setAttribute('data-seo', 'page-specific');
      script.textContent = JSON.stringify(structuredData);
      document.head.appendChild(script);
    }

    // Update Open Graph tags
    if (title) {
      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) {
        ogTitle.setAttribute('content', `${title} | HyperDrive AI Agents`);
      }
    }

    if (description) {
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) {
        ogDescription.setAttribute('content', description);
      }
    }

    // Update Twitter meta tags
    if (title) {
      const twitterTitle = document.querySelector('meta[name="twitter:title"]');
      if (twitterTitle) {
        twitterTitle.setAttribute('content', `${title} | HyperDrive AI Agents`);
      }
    }

    if (description) {
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) {
        twitterDescription.setAttribute('content', description);
      }
    }

  }, [title, description, keywords, aiCapabilities, useCases, structuredData, location.pathname]);

  return null;
};

export default SEOHead;