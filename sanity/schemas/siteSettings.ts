import { defineType, defineField } from "sanity";

export const siteSettings = defineType({
  name: "siteSettings",
  title: "Site Settings",
  type: "document",
  fields: [
    defineField({
      name: "featuredReviews",
      title: "Homepage Featured Reviews",
      type: "array",
      of: [{ type: "reference", to: [{ type: "review" }] }],
      validation: (Rule) => Rule.max(4),
      description: "Choose up to 4 reviews to feature on the homepage",
    }),
    defineField({
      name: "newsletterCtaText",
      title: "Newsletter CTA Text",
      type: "string",
      description: "The subheading shown above the email signup form",
      initialValue: "The best of Stavanger, in your inbox.",
    }),
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
    select: { title: "newsletterCtaText" },
    prepare() {
      return { title: "Site Settings" };
    },
  },
});
