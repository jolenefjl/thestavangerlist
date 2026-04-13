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

// Homepage: site settings (featured reviews + social links)
export const siteSettingsQuery = groq`
  *[_type == "siteSettings"][0] {
    newsletterCtaText,
    instagramUrl,
    tiktokUrl,
    featuredReviews[]-> {
      ${reviewFields}
    }
  }
`;

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
