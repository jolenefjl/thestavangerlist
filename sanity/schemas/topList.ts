import { defineType, defineField } from "sanity";
import { standardRichTextOf } from "../lib/schemaHelpers";

export const topList = defineType({
  name: "topList",
  title: "Top List",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "List Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "cardTeaser",
      title: "Card Teaser",
      type: "string",
      description: "One-line summary shown on the list card. Max 160 characters. Optional.",
      validation: (Rule) => Rule.max(160),
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
        }),
      ],
    }),
    defineField({
      name: "intro",
      title: "Intro Paragraph",
      type: "array",
      of: standardRichTextOf,
    }),
    defineField({
      name: "items",
      title: "List Items",
      type: "array",
      of: [
        {
          type: "object",
          name: "listItem",
          title: "List Item",
          fields: [
            defineField({
              name: "placeName",
              title: "Place Name",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "description",
              title: "Short Description",
              type: "text",
              rows: 3,
            }),
            defineField({
              name: "review",
              title: "Link to Full Review (optional)",
              type: "reference",
              to: [{ type: "review" }],
            }),
          ],
          preview: {
            select: { title: "placeName", subtitle: "description" },
          },
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "heroImage",
    },
  },
});
