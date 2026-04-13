import { defineType, defineField } from "sanity";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  groups: [
    { name: "info", title: "Restaurant Info", default: true },
    { name: "content", title: "Content" },
    { name: "ratings", title: "Ratings" },
    { name: "media", title: "Media" },
    { name: "settings", title: "Settings" },
  ],
  fields: [
    defineField({
      name: "name",
      title: "Restaurant Name",
      type: "string",
      group: "info",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      group: "info",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cuisine",
      title: "Cuisine Type",
      type: "string",
      group: "info",
      description: "e.g. Japanese, Norwegian, Brunch, Fine Dining",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "area",
      title: "Area / Location",
      type: "string",
      group: "info",
      description: "e.g. Stavanger Sentrum, Sandnes, Klepp",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "string",
      group: "info",
      options: {
        list: [
          { title: "€ — Inexpensive", value: "€" },
          { title: "€€ — Moderate", value: "€€" },
          { title: "€€€ — Expensive", value: "€€€" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "bestFor",
      title: "Best For",
      type: "array",
      group: "info",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Date Night", value: "Date Night" },
          { title: "Lunch", value: "Lunch" },
          { title: "Groups", value: "Groups" },
          { title: "Solo", value: "Solo" },
          { title: "Family", value: "Family" },
          { title: "Business", value: "Business" },
          { title: "Late Night", value: "Late Night" },
          { title: "Outdoor Seating", value: "Outdoor Seating" },
        ],
        layout: "grid",
      },
    }),
    defineField({
      name: "websiteUrl",
      title: "Website URL",
      type: "url",
      group: "info",
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      group: "media",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt Text",
          type: "string",
          description: "Describe the image for accessibility and SEO",
        }),
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "gallery",
      title: "Photo Gallery",
      type: "array",
      group: "media",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
            }),
          ],
        },
      ],
    }),
    defineField({
      name: "tiktokUrl",
      title: "TikTok Video URL",
      type: "url",
      group: "media",
      description: "Optional — paste the full TikTok video URL",
    }),
    defineField({
      name: "body",
      title: "Review Body",
      type: "array",
      group: "content",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "H2", value: "h2" },
            { title: "H3", value: "h3" },
          ],
          marks: {
            decorators: [
              { title: "Bold", value: "strong" },
              { title: "Italic", value: "em" },
            ],
          },
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    // ── Ratings ──────────────────────────────────────────────────
    defineField({
      name: "didItHitDifferent",
      title: "😋 Did It Hit Different?",
      type: "number",
      group: "ratings",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "wouldIPayAgain",
      title: "💰 Would I Pay This Price Again?",
      type: "number",
      group: "ratings",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "worthTheHype",
      title: "⭐ Worth the Hype?",
      type: "number",
      group: "ratings",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "theRealDeal",
      title: "🌍 The Real Deal?",
      type: "number",
      group: "ratings",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "didStaffCare",
      title: "👏 Did The Staff Care?",
      type: "number",
      group: "ratings",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    // ── Settings ─────────────────────────────────────────────────
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      group: "settings",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
      group: "settings",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "name",
      subtitle: "cuisine",
      media: "heroImage",
    },
  },
});
