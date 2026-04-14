import { defineType, defineField } from "sanity";

export const suggestion = defineType({
  name: "suggestion",
  title: "Suggestion",
  type: "document",
  fields: [
    defineField({
      name: "type",
      title: "Type",
      type: "string",
      initialValue: "experience",
    }),
    defineField({
      name: "suggestionName",
      title: "Name",
      type: "string",
    }),
    defineField({
      name: "location",
      title: "Location",
      type: "string",
    }),
    defineField({
      name: "whyRecommend",
      title: "Why Recommend",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "submitterEmail",
      title: "Submitter Email",
      type: "string",
    }),
    defineField({
      name: "submittedAt",
      title: "Submitted At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
  preview: {
    select: {
      title: "suggestionName",
      subtitle: "type",
    },
  },
});
