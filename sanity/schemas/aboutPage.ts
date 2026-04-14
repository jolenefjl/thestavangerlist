import { defineType, defineField } from "sanity";

const richTextField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: "array",
    of: [
      {
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
    defineField({
      name: "storyEyebrow",
      title: "My Story — Eyebrow Label",
      type: "string",
      initialValue: "My Story",
    }),
    defineField({
      name: "storyHeadline",
      title: "My Story — Section Headline",
      type: "string",
      initialValue: "Growing up with food as a language.",
    }),
    richTextField("storyBlock1", "My Story — Paragraph 1 (KL roots)"),
    richTextField("storyBlock2", "My Story — Paragraph 2 (Arriving in Stavanger)"),
    richTextField("storyBlock3", "My Story — Paragraph 3 (The in-between perspective)"),

    // ── Why I Started ─────────────────────────────────────────
    defineField({
      name: "whyEyebrow",
      title: "Why I Started — Eyebrow Label",
      type: "string",
      initialValue: "Why I Started This",
    }),
    defineField({
      name: "whyHeadline",
      title: "Why I Started — Section Headline",
      type: "string",
      initialValue: "I built the thing I wished existed.",
    }),
    richTextField("whySection", "Why I Started — Body Text"),

    // ── What You'll Find ──────────────────────────────────────
    defineField({
      name: "whatEyebrow",
      title: "What You'll Find — Eyebrow Label",
      type: "string",
      initialValue: "What You'll Find Here",
    }),
    defineField({
      name: "whatHeadline",
      title: "What You'll Find — Section Headline",
      type: "string",
      initialValue: "Honest, tested, never sponsored.",
    }),
    richTextField("whatSection", "What You'll Find — Body Text"),

    // ── Social ────────────────────────────────────────────────
    defineField({
      name: "socialEyebrow",
      title: "Social Section — Eyebrow Label",
      type: "string",
      initialValue: "Come Find Me",
    }),
    defineField({
      name: "socialHeadline",
      title: "Social Section — Headline",
      type: "string",
      initialValue: "On TikTok and Instagram.",
    }),
    defineField({
      name: "socialBlurb",
      title: "Social Section — Blurb",
      type: "text",
      rows: 2,
      initialValue: "I post food reviews, Stavanger spots, and the occasional overly enthusiastic take on a bowl of ramen.",
    }),
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
