// Shared schema building blocks — consistent rich text options across all document types.
// Import { standardRichTextOf } into any schema that has a block content field.

const photoAltField = { name: "alt", title: "Alt Text", type: "string" };

export const standardBlock = {
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

export const photoBlockSingle = {
  type: "object",
  name: "photoBlockSingle",
  title: "📷 Single Photo",
  fields: [
    {
      name: "image1",
      title: "Image",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    { name: "caption", title: "Caption (optional)", type: "string" },
  ],
  preview: {
    select: { media: "image1" },
    prepare() { return { title: "Single Photo" }; },
  },
};

export const photoBlockTwo = {
  type: "object",
  name: "photoBlockTwo",
  title: "📷 Two Photos",
  fields: [
    {
      name: "image1",
      title: "Left Image",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    {
      name: "image2",
      title: "Right Image",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    { name: "caption", title: "Caption (optional)", type: "string" },
  ],
  preview: {
    select: { media: "image1" },
    prepare() { return { title: "Two Photos" }; },
  },
};

export const photoBlockThree = {
  type: "object",
  name: "photoBlockThree",
  title: "📷 Three Photos",
  fields: [
    {
      name: "image1",
      title: "Left Image",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    {
      name: "image2",
      title: "Centre Image",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    {
      name: "image3",
      title: "Right Image",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    { name: "caption", title: "Caption (optional)", type: "string" },
  ],
  preview: {
    select: { media: "image1" },
    prepare() { return { title: "Three Photos" }; },
  },
};

export const photoBlockFour = {
  type: "object",
  name: "photoBlockFour",
  title: "📷 Four Photos",
  fields: [
    {
      name: "image1",
      title: "Image 1",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    {
      name: "image2",
      title: "Image 2",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    {
      name: "image3",
      title: "Image 3",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    {
      name: "image4",
      title: "Image 4",
      type: "image",
      options: { hotspot: true },
      fields: [photoAltField],
    },
    { name: "caption", title: "Caption (optional)", type: "string" },
  ],
  preview: {
    select: { media: "image1" },
    prepare() { return { title: "Four Photos" }; },
  },
};

/** Drop this into any `of: [...]` array to get the full standard rich text option set. */
export const standardRichTextOf = [
  standardBlock,
  photoBlockSingle,
  photoBlockTwo,
  photoBlockThree,
  photoBlockFour,
];

/** Q&A exchange — embeds inline in a rich text body */
export const qaBlock = {
  type: "object",
  name: "qaBlock",
  title: "💬 Q&A",
  fields: [
    {
      name: "question",
      title: "Question",
      type: "string",
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: "answer",
      title: "Answer",
      type: "text",
      rows: 4,
      description: "Press Enter for a new paragraph within the answer.",
    },
  ],
  preview: {
    select: { title: "question" },
    prepare({ title }: { title?: string }) {
      return { title: title ? `Q: ${title}` : "Q&A block" };
    },
  },
};

/** Large pull quote — embeds inline in a rich text body */
export const pullQuote = {
  type: "object",
  name: "pullQuote",
  title: "❝ Pull Quote",
  fields: [
    {
      name: "text",
      title: "Quote",
      type: "text",
      rows: 3,
    },
  ],
  preview: {
    select: { title: "text" },
    prepare({ title }: { title?: string }) {
      return { title: title ? `" ${title}` : "Pull quote" };
    },
  },
};

/** Extended rich text for Into the Kitchen — adds Q&A blocks and pull quotes */
export const interviewRichTextOf = [
  standardBlock,
  qaBlock,
  pullQuote,
  photoBlockSingle,
  photoBlockTwo,
  photoBlockThree,
  photoBlockFour,
];
