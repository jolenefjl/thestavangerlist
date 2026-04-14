import { defineType, defineField } from "sanity";

const richTextField = (name: string, title: string) =>
  defineField({
    name,
    title,
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
  });

export const aboutPage = defineType({
  name: "aboutPage",
  title: "About Page",
  type: "document",
  fields: [
    // ── Hero ──────────────────────────────────────────────────
    defineField({
      name: "heroPhoto",
      title: "Hero Photo",
      type: "image",
      options: { hotspot: true },
      description: "Your main photo — shown large at the top of the page",
      fields: [
        defineField({ name: "alt", title: "Alt Text", type: "string" }),
      ],
    }),
    defineField({
      name: "heroHeadline",
      title: "Hero Headline",
      type: "string",
      initialValue: "Hi, I'm Jo. And I eat everything.",
    }),
    defineField({
      name: "heroIntro",
      title: "Hero Intro Paragraph",
      type: "text",
      rows: 3,
      initialValue: "Malaysian-born, Stavanger-based. 11 years in this city and I'm still finding places that surprise me.",
    }),

    // ── Story ─────────────────────────────────────────────────
    richTextField("storyBlock1", "My Story — Paragraph 1 (KL roots)"),
    richTextField("storyBlock2", "My Story — Paragraph 2 (Arriving in Stavanger)"),
    richTextField("storyBlock3", "My Story — Paragraph 3 (The in-between perspective)"),

    // ── Why I Started ─────────────────────────────────────────
    richTextField("whySection", "Why I Started The Stavanger List"),

    // ── What You'll Find ──────────────────────────────────────
    richTextField("whatSection", "What You'll Find Here"),

    // ── Social ────────────────────────────────────────────────
    defineField({
      name: "tiktokUrl",
      title: "TikTok URL",
      type: "url",
      description: "Link to your TikTok profile",
    }),
    defineField({
      name: "instagramUrl",
      title: "Instagram URL",
      type: "url",
      description: "Link to your Instagram profile",
    }),

    // ── SEO ───────────────────────────────────────────────────
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      initialValue: "About Jo — The Stavanger List",
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "string",
      initialValue: "Malaysian-born food writer living in Stavanger for 11 years. Honest reviews, no sponsorships.",
    }),
  ],
  preview: {
    prepare() {
      return { title: "About Page" };
    },
  },
});
