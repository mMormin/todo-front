/**
 * Parse task text for hashtags and return cleaned text
 * @param text Raw task text that might include hashtags
 * @returns Cleaned task text without hashtags
 */
export const parseTaskText = (
  text: string
): { text: string; hashtag: string | null } => {
  const match = text.match(/^(.+?)(?:\s+#([^\s]+))?$/);

  if (match) {
    return {
      text: match[1].trim(),
      hashtag: match[2] ? match[2].trim() : null,
    };
  }

  return { text, hashtag: null };
};
