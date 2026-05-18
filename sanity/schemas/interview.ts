import { defineType, defineField } from "sanity";
import { interviewRichTextOf } from "../lib/schemaHelpers";

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

    // ── Article Headline ─────────────────────────────────────
    defineField({
      name: "title",
      title: "Article Title",
      type: "string",
      description: "Editorial headline shown in the hero. e.g. 'The chef who brought Hanoi to Stavanger'. Leave blank to use the founder's name.",
    }),
    defineField({
      name: "subtitle",
      title: "Subtitle",
      type: "string",
      description: "A short context line shown below the title. e.g. 'Linh Nguyen of Pho Viet on leaving Vietnam for Norway'.",
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
    defineField({
      name: "introStory",
      title: "Body Copy",
      type: "array",
      of: interviewRichTextOf,
      description: "Write freely — mix paragraphs, Q&A exchanges, pull quotes, and photos in any order using the + button.",
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

    // ── SEO overrides ─────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Overrides the page title in Google results and browser tabs. Leave blank to use the article title automatically. Keep under 60 characters.",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 3,
      description: "Overrides the description shown in Google results and link previews. Leave blank to use the auto-generated description. Aim for 120–155 characters.",
    }),
    defineField({
      name: "ogImage",
      title: "Share Image",
      type: "image",
      description: "Overrides the image shown when the link is shared on social media or in messages (iMessage, WhatsApp, Instagram, LinkedIn etc). Leave blank to use the hero photo automatically. Recommended: 1200×630px landscape crop.",
      options: { hotspot: true },
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
