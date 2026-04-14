import { groq } from "next-sanity";

// Fields reused across queries
const reviewFields = groq`
  _id,
  name,
  slug,
  cuisine,
  area,
  priceRange,
  bestFor,
  heroImage,
  didItHitDifferent,
  wouldIPayAgain,
  worthTheHype,
  theRealDeal,
  didStaffCare,
  publishedAt,
  featured
`;

// Homepage: site settings (all editable content)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    siteName,
    heroEyebrow,
    heroHeadline,
    heroHeadlineAccent,
    heroSubheading,
    homepageCtaText,
    homepageFeaturedTitle,
    homepageTopListsTitle,
    homepageLatestTitle,
    eatsEyebrow,
    eatsPageTitle,
    verdictTitle,
    ratingCaloriesLabel,
    ratingCaloriesSub,
    ratingBillLabel,
    ratingBillSub,
    ratingHypeLabel,
    ratingHypeSub,
    ratingDetourLabel,
    ratingDetourSub,
    ratingServiceLabel,
    ratingServiceSub,
    suggestEyebrow,
    suggestHeading,
    suggestBody,
    suggestCtaText,
    morePhotosLabel,
    watchVideoLabel,
    newsletterEyebrow,
    newsletterCtaText,
    newsletterSubtext,
    newsletterSuccessText,
    instagramUrl,
    tiktokUrl,
    featuredReviews[]-> {
      ${reviewFields}
    }
  }
`;

// Slim query for Nav/Footer site name only
export const siteNameQuery = groq`*[_type == "siteSettings"][0].siteName`;

// Homepage: latest reviews
export const latestReviewsQuery = groq`
  *[_type == "review"] | order(publishedAt desc) [0...6] {
    ${reviewFields}
  }
`;

// Reviews index: all reviews (with optional cuisine filter)
export const allReviewsQuery = groq`
  *[_type == "review"] | order(publishedAt desc) {
    ${reviewFields}
  }
`;

// Reviews index: all unique cuisine values (for filter tabs)
export const cuisineListQuery = groq`
  array::unique(*[_type == "review"].cuisine)
`;

// Individual review: full detail by slug
export const reviewBySlugQuery = groq`
  *[_type == "review" && slug.current == $slug][0] {
    ${reviewFields},
    websiteUrl,
    tiktokUrl,
    gallery,
    body
  }
`;

// Top lists index
export const allTopListsQuery = groq`
  *[_type == "topList"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    heroImage,
    publishedAt,
    "itemCount": count(items)
  }
`;

// Individual top list by slug
export const topListBySlugQuery = groq`
  *[_type == "topList" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    intro,
    heroImage,
    publishedAt,
    items[] {
      placeName,
      description,
      review-> {
        ${reviewFields}
      }
    }
  }
`;
