import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    // ── Site Identity ─────────────────────────────────────────
    defineField({
      name: "siteName",
      title: "Site Name",
      type: "string",
      description: "Used in the nav logo and footer",
      initialValue: "The Stavanger List",
    }),

    // ── Homepage Hero ─────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Homepage — Eyebrow Text",
      type: "string",
      description: "Small label above the headline",
      initialValue: "🍽️ Stavanger Eats",
    }),
    defineField({
      name: "heroHeadline",
      title: "Homepage — Hero Headline",
      type: "text",
      rows: 3,
      description: "Press Enter for line breaks. The accent word below is appended at the end in italic.",
      initialValue: "The best places\nto eat in",
    }),
    defineField({
      name: "heroHeadlineAccent",
      title: "Homepage — Hero Headline Accent",
      type: "string",
      description: "This word appears in italic coral after the headline, e.g. Stavanger.",
      initialValue: "Stavanger.",
    }),
    defineField({
      name: "heroSubheading",
      title: "Homepage — Hero Subheading",
      type: "string",
      initialValue: "Honest reviews for the Stavanger region — every place tested, never sponsored.",
    }),
    defineField({
      name: "homepageCtaText",
      title: "Homepage — CTA Button Text",
      type: "string",
      initialValue: "Browse All Reviews",
    }),

    // ── Homepage Section Titles ───────────────────────────────
    defineField({
      name: "homepageFeaturedTitle",
      title: "Homepage — Featured Section Title",
      type: "string",
      initialValue: "Jo's Picks",
    }),
    defineField({
      name: "homepageTopListsTitle",
      title: "Homepage — Top Lists Section Title",
      type: "string",
      initialValue: "Top Lists",
    }),
    defineField({
      name: "homepageLatestTitle",
      title: "Homepage — Latest Reviews Section Title",
      type: "string",
      initialValue: "Latest Reviews",
    }),

    // ── Featured Reviews ──────────────────────────────────────
    defineField({
      name: "featuredReviews",
      title: "Homepage Featured Reviews",
      type: "array",
      of: [{ type: "reference", to: [{ type: "review" }] }],
      validation: (Rule) => Rule.max(4),
      description: "Choose up to 4 reviews to feature on the homepage",
    }),

    // ── Stavanger Play Section ────────────────────────────────
    defineField({
      name: "homepagePlayTitle",
      title: "Homepage — Play Section Heading",
      type: "string",
      initialValue: "Things worth doing.",
      description: "Large heading shown above the featured experiences",
    }),
    defineField({
      name: "featuredExperiences",
      title: "Homepage Featured Experiences",
      type: "array",
      of: [{ type: "reference", to: [{ type: "experience" }] }],
      validation: (Rule) => Rule.max(6),
      description: "Choose up to 6 experiences to feature in the Play section on the homepage",
    }),

    // ── Eats Page ─────────────────────────────────────────────
    defineField({
      name: "eatsEyebrow",
      title: "Eats Page — Eyebrow Text",
      type: "string",
      initialValue: "🍽️ Stavanger Eats",
    }),
    defineField({
      name: "eatsPageTitle",
      title: "Eats Page — Page Title",
      type: "string",
      initialValue: "Restaurant Reviews",
    }),

    // ── Rating Criteria ───────────────────────────────────────
    defineField({
      name: "verdictTitle",
      title: "Review Page — Verdict Section Title",
      type: "string",
      initialValue: "My Verdict",
    }),
    defineField({
      name: "ratingCaloriesLabel",
      title: "Rating 1 — Label",
      type: "string",
      initialValue: "Worth the Calories?",
    }),
    defineField({
      name: "ratingCaloriesSub",
      title: "Rating 1 — Subtitle",
      type: "string",
      initialValue: "Food quality",
    }),
    defineField({
      name: "ratingBillLabel",
      title: "Rating 2 — Label",
      type: "string",
      initialValue: "Worth the Bill?",
    }),
    defineField({
      name: "ratingBillSub",
      title: "Rating 2 — Subtitle",
      type: "string",
      initialValue: "Value for money",
    }),
    defineField({
      name: "ratingHypeLabel",
      title: "Rating 3 — Label (optional rating)",
      type: "string",
      initialValue: "Worth the Hype?",
    }),
    defineField({
      name: "ratingHypeSub",
      title: "Rating 3 — Subtitle",
      type: "string",
      initialValue: "Does it live up to its reputation?",
    }),
    defineField({
      name: "ratingDetourLabel",
      title: "Rating 4 — Label (optional rating)",
      type: "string",
      initialValue: "Worth the Detour?",
    }),
    defineField({
      name: "ratingDetourSub",
      title: "Rating 4 — Subtitle",
      type: "string",
      initialValue: "How authentic is it?",
    }),
    defineField({
      name: "ratingServiceLabel",
      title: "Rating 5 — Label",
      type: "string",
      initialValue: "Worth Going Back For?",
    }),
    defineField({
      name: "ratingServiceSub",
      title: "Rating 5 — Subtitle",
      type: "string",
      initialValue: "Service",
    }),

    // ── Review Page — Suggest Section ─────────────────────────
    defineField({
      name: "suggestEyebrow",
      title: "Suggest Section — Eyebrow",
      type: "string",
      initialValue: "Know a great spot?",
    }),
    defineField({
      name: "suggestHeading",
      title: "Suggest Section — Heading",
      type: "string",
      initialValue: "Suggest a restaurant",
    }),
    defineField({
      name: "suggestBody",
      title: "Suggest Section — Body Text",
      type: "string",
      initialValue: "I eat everywhere so you don't have to. Tell me where to go next.",
    }),
    defineField({
      name: "suggestCtaText",
      title: "Suggest Section — Button Text",
      type: "string",
      initialValue: "Suggest a Place",
    }),

    // ── Review Page — Other Labels ────────────────────────────
    defineField({
      name: "morePhotosLabel",
      title: "Review Page — More Photos Label",
      type: "string",
      initialValue: "More Photos",
    }),
    defineField({
      name: "watchVideoLabel",
      title: "Review Page — Watch Video Label",
      type: "string",
      initialValue: "Watch the video",
    }),

    // ── Newsletter ────────────────────────────────────────────
    defineField({
      name: "newsletterEyebrow",
      title: "Newsletter — Eyebrow Text",
      type: "string",
      initialValue: "Stay in the loop",
    }),
    defineField({
      name: "newsletterCtaText",
      title: "Newsletter — Heading",
      type: "string",
      initialValue: "The best of Stavanger, in your inbox.",
    }),
    defineField({
      name: "newsletterSubtext",
      title: "Newsletter — Subtext",
      type: "string",
      initialValue: "New reviews and curated lists — no spam, ever.",
    }),
    defineField({
      name: "newsletterSuccessText",
      title: "Newsletter — Success Message",
      type: "string",
      initialValue: "You're on the list. Talk soon.",
    }),

    // ── Social ────────────────────────────────────────────────
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok URL",
      type: "url",
    }),
  ],
  preview: {
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
