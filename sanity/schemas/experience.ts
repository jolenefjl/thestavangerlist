import { defineType, defineField } from "sanity";

const standardBlock = {
  type: "block",
  styles: [
    { title: "Normal", value: "normal" },
    { title: "H2", value: "h2" },
  ],
  lists: [{ title: "Bullet", value: "bullet" }],
  marks: {
    decorators: [
      { title: "Bold", value: "strong" },
      { title: "Italic", value: "em" },
    ],
    annotations: [
      {
        type: "object",
        name: "link",
        title: "Link",
        fields: [{ name: "href", type: "url", title: "URL" }],
      },
    ],
  },
};

export const experience = defineType({
  name: "experience",
  title: "Experience",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Experience Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "name", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Outdoor", value: "Outdoor" },
          { title: "Workshop", value: "Workshop" },
          { title: "Day Trip", value: "Day Trip" },
          { title: "Cultural", value: "Cultural" },
          { title: "Nightlife", value: "Nightlife" },
          { title: "Family", value: "Family" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "area",
      title: "Area / Location",
      type: "string",
      description: "e.g. Stavanger Sentrum, Sandnes, Ryfylke",
    }),
    defineField({
      name: "priceRange",
      title: "Price Range",
      type: "string",
      options: {
        list: [
          { title: "Free", value: "Free" },
          { title: "€", value: "€" },
          { title: "€€", value: "€€" },
          { title: "€€€", value: "€€€" },
        ],
        layout: "radio",
      },
    }),
    defineField({
      name: "bestFor",
      title: "Best For",
      type: "array",
      of: [{ type: "string" }],
      options: {
        list: [
          { title: "Solo", value: "Solo" },
          { title: "Couples", value: "Couples" },
          { title: "Groups", value: "Groups" },
          { title: "Families", value: "Families" },
          { title: "Date Night", value: "Date Night" },
          { title: "Kids", value: "Kids" },
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
      name: "bookingUrl",
      title: "Booking URL",
      type: "url",
      description: "Direct booking link (optional — if different from website)",
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
            defineField({
              name: "caption",
              title: "Caption (optional)",
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
      type: "array",
      of: [
        standardBlock,
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({
              name: "alt",
              title: "Alt Text",
              type: "string",
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
    // Rating fields
    defineField({
      name: "worthYourTime",
      title: "Worth Your Time? — Score",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "worthYourTimeBlurb",
      title: "Worth Your Time? — Blurb",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "worthThePrice",
      title: "Worth the Price? — Score",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "worthThePriceBlurb",
      title: "Worth the Price? — Blurb",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "worthTheHype",
      title: "Worth the Hype? — Score",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({
      name: "worthTheHypeBlurb",
      title: "Worth the Hype? — Blurb",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "worthBringingAFriend",
      title: "Worth Bringing a Friend? — Score",
      type: "number",
      validation: (Rule) => Rule.min(1).max(5).integer(),
    }),
    defineField({
      name: "worthBringingAFriendBlurb",
      title: "Worth Bringing a Friend? — Blurb",
      type: "text",
      rows: 2,
    }),
    defineField({
      name: "worthDoingAgain",
      title: "Worth Doing Again? — Score",
      type: "number",
      validation: (Rule) => Rule.required().min(1).max(5).integer(),
    }),
    defineField({
      name: "worthDoingAgainBlurb",
      title: "Worth Doing Again? — Blurb",
      type: "text",
      rows: 2,
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
      subtitle: "category",
      media: "heroImage",
    },
  },
});
