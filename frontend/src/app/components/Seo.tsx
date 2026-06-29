import { Helmet } from "react-helmet-async";

interface SeoProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
}

const SITE_NAME = "WhyBuilder";
const DEFAULT_DESCRIPTION = "Decision infrastructure for housing. Verified rentals in Nairobi with safety scores, noise ratings, commute data, and landlord trust scores.";
const DEFAULT_IMAGE = "/images/placeholders/icon-placeholder.svg";
const SITE_URL = "https://whybuilder.com";

export function Seo({ title, description, image, url }: SeoProps) {
  const fullTitle = title ? `${title} | ${SITE_NAME}` : DEFAULT_TITLE;
  const metaDescription = description || DEFAULT_DESCRIPTION;
  const metaImage = image || DEFAULT_IMAGE;
  const canonicalUrl = url ? `${SITE_URL}${url}` : SITE_URL;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={metaDescription} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:image" content={metaImage} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={metaDescription} />
      <meta property="twitter:image" content={metaImage} />

      {/* Additional SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="keywords" content="Nairobi rentals, verified properties, housing decisions, safety scores, neighbourhood guide, WhyBuilder" />
    </Helmet>
  );
}
