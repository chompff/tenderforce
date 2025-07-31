# Blog Structure

This folder will contain markdown-based blog posts for EED TOOL.

## Structure

```
/blog/
  ├── posts/
  │   ├── 2024-01-01-getting-started-with-procurement.md
  │   ├── 2024-01-15-understanding-tender-processes.md
  │   └── ...
  ├── components/
  │   ├── BlogPost.tsx
  │   ├── BlogList.tsx
  │   └── BlogLayout.tsx
  └── utils/
      ├── markdown.ts
      └── blog-utils.ts
```

## Features (Future Implementation)

- Markdown-based blog posts with frontmatter
- Automatic blog post listing and pagination
- SEO optimization for blog posts
- Categories and tags
- RSS feed generation
- Social sharing
- Comments integration

## Frontmatter Example

```yaml
---
title: "Getting Started with Procurement"
description: "A comprehensive guide to modern procurement processes"
date: "2024-01-01"
author: "EED TOOL Team"
category: "guides"
tags: ["procurement", "beginners", "guide"]
featured: true
---
```

## Usage

Blog posts will be automatically parsed and rendered using a markdown processor with syntax highlighting and custom components support. 