export const parseInput = (input: string, format: string): string => {
  try {
    if (format === 'json') {
      const parsed = JSON.parse(input);
      // Extract requirement from common JSON structures
      const requirement = parsed.requirement || parsed.description || parsed.text || JSON.stringify(parsed);
      return requirement;
    }

    if (format === 'markdown') {
      // Remove markdown formatting but keep content
      return input
        .replace(/^#+\s+/gm, '')  // Remove headers
        .replace(/\*\*/g, '')    // Remove bold
        .replace(/\*\//g, '')    // Remove italic
        .trim();
    }

    // For 'text' and 'document', just clean and return
    return input.trim();
  } catch (error) {
    console.error('Error parsing input:', error);
    return input.trim();
  }
};

export const normalizeRequirement = (requirement: string): string => {
  return requirement
    .trim()
    .replace(/\s+/g, ' ')  // Normalize whitespace
    .slice(0, 5000);        // Limit to 5000 chars
};
