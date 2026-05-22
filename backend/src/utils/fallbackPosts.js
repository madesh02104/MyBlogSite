export const fallbackPosts = [
  {
    id: "fallback-1",
    title: "Welcome to the Blog",
    content: `# Fallback Post

This is a local fallback post. Start the database to see the full content.

## Typography

Use **bold** and *italic* for emphasis, and combine them as ***bold italic***.

### Lists

- Item one
- Item two
- Item three

1. First step
2. Second step
3. Third step

> Blockquotes work well for callouts and notes.

### Code

Here is a fenced code block:


\`\`\`js
const message = "Hello from fallback content";
console.log(message);
\`\`\`

Inline code looks like this: \`const isActive = true;\`.
`,
    published: true,
    createdAt: "2026-05-21T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-2",
    title: "Local Development Tips",
    content: `# Local Development Tips

If the database is offline, the API serves these posts so the UI can render.

## What to check

- Backend server is running
- Frontend is using the correct API base URL
- Database is reachable when you want real data

### Example snippet

\`\`\`bash
npm run dev
\`\`\`

Inline code example: \`DATABASE_URL\`.
`,
    published: true,
    createdAt: "2026-05-20T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-3",
    title: "Database Offline Notice",
    content: `# Database Offline Notice

Connect your Postgres instance to fetch real posts. Update DATABASE_URL in backend/.env.

## Quick checklist

- Postgres is running locally
- The port is correct
- Credentials match your local setup

### Inline code

Use \`psql\` to test connectivity.
`,
    published: true,
    createdAt: "2026-05-19T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-4",
    title: "Editorial Calendar Preview",
    content: `# Editorial Calendar Preview

Use this placeholder to simulate posts in the feed when the database is down.

## Sample slots

- Monday: Launch notes
- Wednesday: Case study
- Friday: How-to guide

### Tip

Keep titles short for better list readability.
`,
    published: true,
    createdAt: "2026-05-18T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-5",
    title: "Feature Spotlight: Comments",
    content: `# Feature Spotlight: Comments

This post stands in when the backend cannot reach the database.

## Why comments matter

- Keep readers engaged
- Capture feedback
- Drive repeat visits

### Note

Real comments will appear when Postgres is available.
`,
    published: true,
    createdAt: "2026-05-17T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-6",
    title: "Writing Workflow",
    content: `# Writing Workflow

Use fallback posts to keep the UI stable during local development.

## Draft to publish

1. Outline the story
2. Draft the sections
3. Review and polish

### Reminder

Fallback content is only for offline mode.
`,
    published: true,
    createdAt: "2026-05-16T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-7",
    title: "API Status Update",
    content: `# API Status Update

Local database is unreachable, so this placeholder is returned.

## Troubleshooting

- Check DATABASE_URL
- Restart Docker containers
- Verify Prisma migrations

### Quick test

Use \`npm run dev\` to start the backend.
`,
    published: true,
    createdAt: "2026-05-15T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-8",
    title: "Design Notes for Hero Section",
    content: `# Design Notes for Hero Section

Fallback content keeps the layout from collapsing when data is missing.

## Visual goals

- Clear headline
- Friendly subheading
- Strong primary CTA

### Tip

Use consistent spacing between sections.
`,
    published: true,
    createdAt: "2026-05-14T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-9",
    title: "Post Metadata Checklist",
    content: `# Post Metadata Checklist

This is a mock post for local fallback responses.

## Include

- Title
- Summary
- Created date
- Read time

### Note

Metadata can be enhanced later from real data.
`,
    published: true,
    createdAt: "2026-05-13T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-10",
    title: "Routing Sanity Check",
    content: `# Routing Sanity Check

Use this placeholder to verify that routes render correctly.

## Pages to test

- Home
- Single post
- Login
- Register

### Tip

Watch the network tab for API failures.
`,
    published: true,
    createdAt: "2026-05-12T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-11",
    title: "Image Upload Notes",
    content: `# Image Upload Notes

This placeholder keeps the UI populated when uploads are offline.

## Checklist

- Verify max file size
- Confirm storage path
- Test error handling

### Tip

Use a small jpeg to smoke test quickly.
`,
    published: true,
    createdAt: "2026-05-11T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-12",
    title: "SEO Snippet Draft",
    content: `# SEO Snippet Draft

Fallback post to validate excerpt rendering.

## Draft

Keep the excerpt under 160 characters to avoid truncation.

### Tip

Ensure the title is descriptive and concise.
`,
    published: true,
    createdAt: "2026-05-10T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-13",
    title: "Navigation Links Review",
    content: `# Navigation Links Review

Placeholder content for quick navigation checks.

## Links

- Home
- About
- Blog
- Contact

### Tip

Active state should be visually clear.
`,
    published: true,
    createdAt: "2026-05-09T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-14",
    title: "Drafting a Case Study",
    content: `# Drafting a Case Study

Fallback entry to mimic longer content blocks.

## Outline

1. Problem statement
2. Approach
3. Outcome

### Tip

Use short paragraphs for readability.
`,
    published: true,
    createdAt: "2026-05-08T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-15",
    title: "Release Notes Template",
    content: `# Release Notes Template

Placeholder for testing markdown formatting.

## Sections

- Added
- Changed
- Fixed

### Tip

Keep entries brief and scannable.
`,
    published: true,
    createdAt: "2026-05-07T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-16",
    title: "Content Migration Plan",
    content: `# Content Migration Plan

Mock post to test long-form layout in offline mode.

## Steps

- Export legacy data
- Map fields
- Import and verify

### Tip

Track errors in a shared log.
`,
    published: true,
    createdAt: "2026-05-06T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-17",
    title: "Accessibility Pass",
    content: `# Accessibility Pass

Fallback content for verifying headings and contrasts.

## Checklist

- Correct heading order
- Adequate color contrast
- Focus styles visible

### Tip

Use keyboard navigation for quick checks.
`,
    published: true,
    createdAt: "2026-05-05T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-18",
    title: "User Feedback Capture",
    content: `# User Feedback Capture

Placeholder post for forms and CTA testing.

## Ideas

- Short survey
- Email prompt
- Feature request

### Tip

Keep forms minimal to reduce friction.
`,
    published: true,
    createdAt: "2026-05-04T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-19",
    title: "Performance Notes",
    content: `# Performance Notes

Offline post to validate list virtualization or pagination.

## Checks

- First contentful paint
- API latency
- Image sizes

### Tip

Use lighthouse for quick profiling.
`,
    published: true,
    createdAt: "2026-05-03T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-20",
    title: "Dark Theme Considerations",
    content: `# Dark Theme Considerations

Fallback content to test contrast variants.

## Elements

- Cards
- Buttons
- Links

### Tip

Ensure muted text still passes contrast.
`,
    published: true,
    createdAt: "2026-05-02T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-21",
    title: "Onboarding Flow",
    content: `# Onboarding Flow

Placeholder post for validating new user UI.

## Steps

1. Register
2. Verify email
3. Create first post

### Tip

Keep steps visible in the UI.
`,
    published: true,
    createdAt: "2026-05-01T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-22",
    title: "Analytics Snapshot",
    content: `# Analytics Snapshot

Offline post to test stats cards and charts.

## Mock metrics

- 1,240 views
- 86 clicks
- 12 signups

### Tip

Use consistent number formatting.
`,
    published: true,
    createdAt: "2026-04-30T00:00:00.000Z",
    comments: [],
  },
  {
    id: "fallback-23",
    title: "Content Review Notes",
    content: `# Content Review Notes

Fallback post to validate the edit flow UI.

## Review list

- Grammar pass
- Link check
- Image alt text

### Tip

Track edits in a checklist.
`,
    published: true,
    createdAt: "2026-04-29T00:00:00.000Z",
    comments: [],
  },
];
