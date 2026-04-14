import { defineType, defineField } from "sanity";

const richText = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      {
        type: "block",
        styles: [
          { title: "Normal", value: "normal" },
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
  });

export const interview = defineType({
  name: "interview",
  title: "Into the Kitchen",
  type: "document",
  fields: [
    // ── Identity ──────────────────────────────────────────────
    defineField({
      name: "founderName",
      title: "Founder Name",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "founderRole",
      title: "Role / Title",
      type: "string",
      description: "e.g. Head Chef & Co-founder",
    }),
    defineField({
      name: "linkedReview",
      title: "Linked Review",
      type: "reference",
      to: [{ type: "review" }],
      description: "Link to the existing review for this restaurant (optional)",
    }),
    defineField({
      name: "restaurantName",
      title: "Restaurant Name (plain text fallback)",
      type: "string",
      description: "Used if no review is linked above",
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "founderName", maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),

    // ── Media ─────────────────────────────────────────────────
    defineField({
      name: "heroPhoto",
      title: "Founder Hero Photo",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
      validation: (Rule) => Rule.required(),
    }),

    // ── Content ───────────────────────────────────────────────
    richText("introStory", "Intro Story"),
    defineField({
      name: "pullQuote",
      title: "Pull Quote",
      type: "string",
      description: "One standout quote — displayed large on the page",
    }),
    defineField({
      name: "qAndA",
      title: "Q&A",
      type: "array",
      of: [
        {
          type: "object",
          name: "qaBlock",
          title: "Q&A Block",
          fields: [
            defineField({
              name: "question",
              title: "Question",
              type: "string",
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: "answer",
              title: "Answer",
              type: "array",
              of: [
                {
                  type: "block",
                  styles: [{ title: "Normal", value: "normal" }],
                  marks: {
                    decorators: [
                      { title: "Bold", value: "strong" },
                      { title: "Italic", value: "em" },
                    ],
                  },
                },
              ],
            }),
          ],
          preview: {
            select: { title: "question" },
          },
        },
      ],
    }),
    defineField({
      name: "gallery",
      title: "Secondary Photo Gallery",
      type: "array",
      of: [
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            defineField({ name: "alt", title: "Alt Text", type: "string" }),
            defineField({ name: "caption", title: "Caption", type: "string" }),
          ],
        },
      ],
    }),

    // ── Meta ──────────────────────────────────────────────────
    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: "founderName",
      subtitle: "restaurantName",
      media: "heroPhoto",
    },
  },
});
