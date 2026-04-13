import { defineType, defineField } from "sanity";

export const review = defineType({
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Restaurant Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      description: "Click Generate — this becomes the page URL (e.g. toko-bintang)",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cuisine",
      title: "Cuisine Type",
      type: "string",
      description: "e.g. Japanese, Norwegian, Brunch, Fine Dining",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "area",
      title: "Area / Location",
      type: "string",
      description: "e.g. Stavanger Sentrum, Sandnes, Klepp",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "string",
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
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
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
      description: "Optional — paste the full TikTok video URL",
    }),
    defineField({
      name: "body",
      title: "Review Body",
      description: "Write your review. Use the image button in the toolbar to drop photos inline between paragraphs.",
      type: "array",
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
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
              description: "Describe the image for accessibility",
            }),
            defineField({
              name: "caption",
              title: "Caption (optional)",
              type: "string",
            }),
          ],
        },
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "didItHitDifferent",
      title: "😋 Did It Hit Different?",
      type: "number",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "wouldIPayAgain",
      title: "💰 Would I Pay This Price Again?",
      type: "number",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "worthTheHype",
      title: "⭐ Worth the Hype?",
      type: "number",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "theRealDeal",
      title: "🌍 The Real Deal?",
      type: "number",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "didStaffCare",
      title: "👏 Did The Staff Care?",
      type: "number",
      description: "Score 1–5",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Featured on Homepage",
      type: "boolean",
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
