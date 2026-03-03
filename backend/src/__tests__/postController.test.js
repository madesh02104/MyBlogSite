jest.mock("@prisma/client", () => ({
  PrismaClient: jest.fn().mockImplementation(() => ({
    post: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  })),
}));

import { createPost } from "../controllers/postController.js";

describe("createPost", () => {
  it("returns 400 when title is missing", async () => {
    const req = { body: { content: "some content" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title and content are required",
    });
  });

  it("returns 400 when content is missing", async () => {
    const req = { body: { title: "some title" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      message: "Title and content are required",
    });
  });

  it("returns 400 when both title and content are missing", async () => {
    const req = { body: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

    await createPost(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
  });
});
