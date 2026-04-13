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
      description: "Main headline text, e.g. The best places to eat in",
      initialValue: "The best places to eat in",
    }),
    defineField({
      name: "heroHeadlineAccent",
      title: "Homepage — Hero Headline Accent",
      type: "string",
      description: "This word appears in italic terracotta after the headline, e.g. Stavanger.",
      initialValue: "Stavanger.",
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
