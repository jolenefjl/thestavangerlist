import { defineType, defineField } from "sanity";

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
      name: "intro",
      title: "Intro Paragraph",
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
