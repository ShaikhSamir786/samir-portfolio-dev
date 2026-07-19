import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import rehypeStringify from "rehype-stringify";

/**
 * Converts markdown to sanitized HTML safe for rendering.
 * Pipeline: markdown -> GFM parsing -> rehype -> sanitize -> HTML string.
 * Allows className on code/span for syntax highlighting styles.
 * @param {string} markdown - Raw markdown content from the AI model
 * @returns {Promise<string>} Sanitized HTML string
 */
export async function markdownToSafeHtml(markdown) {
  const schema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      code: [...(defaultSchema.attributes?.code ?? []), "className"],
      span: [...(defaultSchema.attributes?.span ?? []), "className"],
    },
  };

  const file = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize, schema)
    .use(rehypeStringify)
    .process(markdown);

  return String(file);
}
