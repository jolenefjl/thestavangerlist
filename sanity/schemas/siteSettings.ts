import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    // ── Homepage Hero ─────────────────────────────────────────
    defineField({
      name: "heroEyebrow",
      title: "Homepage — Eyebrow Text",
      type: "string",
      description: "Small label above the headline, e.g. 🍽️ Stavanger Eats",
      initialValue: "🍽️ Stavanger Eats",
    }),
    defineField({
      name: "heroHeadline",
      title: "Homepage — Hero Headline",
      type: "string",
      description: "The big headline. Use | to mark where the italic accent word starts, e.g. The best places to eat in |Stavanger.",
      initialValue: "The best places to eat in |Stavanger.",
    }),
    defineField({
      name: "heroSubheading",
      title: "Homepage — Hero Subheading",
      type: "string",
      initialValue: "Honest reviews for the Stavanger region — every place tested, never sponsored.",
    }),
    // ── Newsletter ────────────────────────────────────────────
    defineField({
      name: "newsletterCtaText",
      title: "Newsletter CTA Text",
      type: "string",
      description: "Heading shown above the email signup form",
      initialValue: "The best of Stavanger, in your inbox.",
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
