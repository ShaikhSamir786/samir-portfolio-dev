import { MIN_WORD_COUNT } from "./config.mjs";

/**
 * Validates a generated blog post against quality criteria.
 * Checks for: word count, code blocks, H2 sections, no clichés,
 * excerpt length, and presence of specific numbers/metrics.
 * @param {Object} post - The generated post object
 * @param {string} post.markdown - The markdown content
 * @param {string} post.excerpt - The post excerpt
 * @returns {Object} { passes: boolean, score: number, checks: Object, wordCount: number }
 */
export function validatePost(post) {
  const wordCount = post.markdown.trim().split(/\s+/).length;

  const checks = {
    wordCount: wordCount >= MIN_WORD_COUNT,
    hasCodeBlock: /```[\s\S]+?```/.test(post.markdown),
    hasH2Sections: /^## .+$/m.test(post.markdown),
    noClichés: !/game.?changer|leverage|synergy|seamless|cutting.?edge|robust/i.test(post.markdown),
    excerptLength: post.excerpt && post.excerpt.length <= 200,
    hasNumbers: /\d+/.test(post.markdown),
    hasVariety: !/^(#{1,2}\s+.+\n?){1,2}$/.test(post.markdown.trim()),
  };

  const score = Object.values(checks).filter(Boolean).length;
  const passes = score >= 5;

  return { passes, score, checks, wordCount };
}
