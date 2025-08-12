
export interface Change {
  value: string;
  added?: boolean;
  removed?: boolean;
  count?: number;
}

declare global {
  // This declares the 'Diff' object from the jsdiff CDN script
  // so that TypeScript knows about it globally.
  const Diff: {
    diffLines(
      oldStr: string,
      newStr: string,
      options?: { newlineIsToken?: boolean; ignoreWhitespace?: boolean; ignoreCase?: boolean }
    ): Change[];
    diffWordsWithSpace(
        oldStr: string,
        newStr: string,
        options?: { ignoreCase?: boolean }
    ): Change[];
  };
}
