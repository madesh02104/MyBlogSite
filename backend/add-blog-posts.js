import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

const blogPosts = [
  {
    title: "The Future of Web Development: What's Next in 2024",
    content: `Web development is evolving at an unprecedented pace, and 2024 promises to be a transformative year for the industry. From the rise of AI-powered development tools to the increasing importance of performance and accessibility, developers need to stay ahead of the curve.

One of the most exciting trends is the integration of artificial intelligence into the development workflow. Tools like GitHub Copilot and similar AI assistants are revolutionizing how we write code, offering intelligent suggestions and even generating entire functions based on comments and context.

Performance optimization has also taken center stage, with Core Web Vitals becoming crucial metrics for SEO and user experience. Google's emphasis on page speed and user interaction metrics means developers must prioritize performance from the start of their projects.

Another significant shift is the growing adoption of Web Components and the move towards more modular, reusable code. This approach not only improves maintainability but also enables better collaboration between teams.

The rise of edge computing and serverless architectures is also changing how we deploy and scale applications. With platforms like Vercel, Netlify, and Cloudflare Workers, developers can now build and deploy applications that are faster, more reliable, and more cost-effective than ever before.

As we look towards the future, it's clear that web development will continue to be shaped by these emerging technologies and methodologies. The key to success will be staying adaptable and continuously learning new skills.`,
    published: true,
  },
  {
    title: "Getting Started with React: A Beginner's Guide",
    content: `React has become one of the most popular JavaScript libraries for building user interfaces, and for good reason. Its component-based architecture, virtual DOM, and extensive ecosystem make it an excellent choice for both beginners and experienced developers.

Let's start with the basics. React is a JavaScript library developed by Facebook (now Meta) that allows you to build user interfaces using reusable components. Each component is a self-contained piece of code that can manage its own state and render HTML.

One of React's most powerful features is its virtual DOM. Instead of directly manipulating the browser's DOM, React creates a virtual representation of the UI in memory. When the state of a component changes, React compares the virtual DOM with the actual DOM and only updates what's necessary. This approach makes React applications incredibly fast and efficient.

JSX is another key feature that makes React special. It allows you to write HTML-like code directly in your JavaScript files, making your components more readable and easier to understand. While JSX might look like HTML, it's actually transformed into JavaScript function calls during the build process.

State management is crucial in React applications. The useState hook allows functional components to manage their own state, while the useEffect hook handles side effects like API calls and DOM manipulation. For more complex state management, you might want to consider Context API or external libraries like Redux.

As you progress in your React journey, you'll encounter concepts like props, lifecycle methods, and hooks. Don't worry if these seem overwhelming at first – they become second nature with practice.

The React ecosystem is vast, with tools like Create React App, Next.js, and various UI libraries that can help you build applications faster. Start with the fundamentals, build small projects, and gradually explore more advanced concepts.`,
    published: true,
  },
  {
    title: "The Art of Clean Code: Writing Maintainable Software",
    content: `Clean code is not just about making your program work – it's about making it readable, maintainable, and understandable for other developers (including your future self). Writing clean code is an art that requires practice, patience, and a commitment to continuous improvement.

The first principle of clean code is meaningful naming. Variables, functions, and classes should have names that clearly express their purpose. Instead of using generic names like 'data' or 'temp', use descriptive names like 'userProfile' or 'calculateTotalPrice'. Remember, code is read much more often than it is written.

Functions should be small and do one thing well. The Single Responsibility Principle applies not just to classes but to functions as well. If your function is doing multiple things, consider breaking it down into smaller, more focused functions. This makes your code easier to test, debug, and maintain.

Comments should explain why something is done, not what is done. If you find yourself writing comments to explain what your code does, consider refactoring the code to be more self-explanatory. Good code is self-documenting through clear naming and structure.

Error handling is another crucial aspect of clean code. Don't ignore errors or use empty catch blocks. Handle errors gracefully and provide meaningful error messages that help with debugging. Consider using custom error types and proper logging.

Code formatting and consistency are also important. Use consistent indentation, spacing, and naming conventions throughout your project. Many IDEs and linters can help enforce these standards automatically.

Remember, clean code is not about perfection – it's about continuous improvement. Refactor your code regularly, learn from code reviews, and always be willing to improve your coding practices.`,
    published: true,
  },
  {
    title: "Understanding Database Design: From Theory to Practice",
    content: `Database design is a fundamental skill that every developer should master. Whether you're building a simple blog or a complex enterprise application, understanding how to design efficient, scalable databases is crucial for success.

The first step in database design is understanding your data requirements. What entities does your application need to store? What are the relationships between these entities? Answering these questions helps you create an effective Entity-Relationship Diagram (ERD).

Normalization is a key concept in database design. It involves organizing data to reduce redundancy and improve data integrity. The goal is to eliminate data anomalies and ensure that each piece of information is stored in only one place. However, over-normalization can lead to performance issues, so finding the right balance is important.

Indexing is another critical aspect of database performance. Proper indexing can dramatically improve query performance, but too many indexes can slow down write operations. Understanding when and how to use indexes is essential for optimizing database performance.

When designing your database schema, consider the types of queries your application will perform most frequently. This helps you optimize your table structure and indexing strategy. For example, if you frequently query users by email, make sure the email column is indexed.

Data types and constraints are also important considerations. Choose appropriate data types for your columns, and use constraints to ensure data integrity. Foreign key constraints help maintain referential integrity, while check constraints can enforce business rules.

As your application grows, you might need to consider more advanced concepts like database partitioning, sharding, and replication. These techniques help you scale your database to handle larger amounts of data and higher traffic loads.

Remember, good database design is an iterative process. Start with a simple design and refine it as you learn more about your application's requirements and performance characteristics.`,
    published: true,
  },
  {
    title: "Mastering CSS Grid and Flexbox: Modern Layout Techniques",
    content: `CSS Grid and Flexbox have revolutionized how we create layouts on the web. These powerful layout systems provide developers with unprecedented control over how elements are positioned and sized on the page.

CSS Grid is a two-dimensional layout system that allows you to create complex grid-based layouts with ease. It's perfect for page layouts, card grids, and any situation where you need to align items in both rows and columns. Grid containers use properties like grid-template-columns, grid-template-rows, and grid-gap to define the structure.

Flexbox, on the other hand, is a one-dimensional layout system designed for distributing space along a single axis. It's ideal for navigation bars, form layouts, and any situation where you need to align items in a row or column. Flex containers use properties like justify-content, align-items, and flex-direction to control alignment and distribution.

One of the most powerful features of both systems is their ability to create responsive layouts. With CSS Grid, you can use functions like repeat(), minmax(), and auto-fit to create layouts that adapt to different screen sizes. Flexbox's flex-grow, flex-shrink, and flex-basis properties allow elements to grow and shrink based on available space.

Understanding when to use Grid vs Flexbox is crucial. Use Grid for overall page layouts and two-dimensional arrangements. Use Flexbox for component-level layouts and one-dimensional arrangements. Often, the best approach is to combine both – use Grid for the main layout and Flexbox for individual components.

Both systems also provide excellent support for accessibility. They allow you to create layouts that work well with screen readers and maintain logical document flow, even when visual presentation changes.

As you become more comfortable with these layout systems, you'll find that many of the CSS hacks and workarounds you used in the past are no longer necessary. Grid and Flexbox provide clean, semantic solutions for most layout challenges.`,
    published: true,
  },
  {
    title: "The Importance of API Design: Building Better Interfaces",
    content: `API design is often overlooked in software development, but it's one of the most important aspects of building successful applications. A well-designed API can make the difference between a system that's easy to use and maintain, and one that's frustrating and error-prone.

The first principle of good API design is consistency. Your API should follow consistent naming conventions, use consistent HTTP methods, and return consistent response formats. This makes it easier for developers to understand and use your API without constantly referring to documentation.

RESTful design principles are fundamental to creating good APIs. Use appropriate HTTP methods (GET, POST, PUT, DELETE) for different operations, and use meaningful URLs that represent resources rather than actions. For example, use /users instead of /getUsers.

Error handling is crucial in API design. Always return appropriate HTTP status codes and provide meaningful error messages. Include error codes and descriptions that help developers understand what went wrong and how to fix it.

Versioning is another important consideration. As your API evolves, you'll need to make changes that might break existing clients. Use versioning strategies like URL versioning (/api/v1/users) or header versioning to manage these changes gracefully.

Documentation is essential for any API. Use tools like Swagger/OpenAPI to generate interactive documentation that shows developers exactly how to use your API. Include examples, error responses, and clear descriptions of each endpoint.

Performance should also be considered in API design. Use pagination for large datasets, implement caching where appropriate, and consider using GraphQL for complex queries that require multiple round trips to the server.

Security is paramount in API design. Always validate input data, use HTTPS, implement proper authentication and authorization, and follow security best practices like rate limiting and input sanitization.

Remember, good API design is about making life easier for the developers who will use your API. Think about their needs, provide clear documentation, and design with the future in mind.`,
    published: true,
  },
];

async function addBlogPosts() {
  try {
    console.log("📝 Adding blog posts to database...");

    for (const post of blogPosts) {
      const createdPost = await prisma.post.create({
        data: post,
      });
      console.log(`✅ Created post: "${createdPost.title}"`);
    }

    console.log("\n🎉 All blog posts have been added successfully!");
    console.log(`📊 Total posts created: ${blogPosts.length}`);
  } catch (error) {
    console.error("❌ Error adding blog posts:", error);
  } finally {
    await prisma.$disconnect();
  }
}

addBlogPosts();
