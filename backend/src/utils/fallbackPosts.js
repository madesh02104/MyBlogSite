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
];
