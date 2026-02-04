## Issue Analysis

The build error occurs because the `post-1770124868.892411.md` file has an incorrectly formatted `tags` field in its frontmatter. The current format is:

```yaml
tags:
  - Uncategorizedcategory: "it"
```

This is causing the YAML parser to interpret the entire line as an object instead of a string, which violates the collection schema that expects an array of strings for tags.

## Fix Plan

1. **Correct the frontmatter formatting** in `post-1770124868.892411.md`:

   * Move the `category` field to a new line at the same indentation level as `tags`

   * Fix the tag value to be just "Uncategorized"

2. **Verify the fix** by running the build command to ensure the error is resolved

## Expected Result

After the fix, the frontmatter should look like:

```yaml
tags:
  - Uncategorized
category: "it"
```

This will ensure the tags field contains a valid array of strings and the category field is properly separated.
