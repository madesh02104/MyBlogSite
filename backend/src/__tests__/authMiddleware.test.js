import jwt from "jsonwebtoken";

jest.mock("../prisma/client.js", () => ({
  __esModule: true,
  default: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

import prisma from "../prisma/client.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

process.env.JWT_SECRET = "test-secret";

describe("protect middleware", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns 401 when no token is provided", async () => {
    const req = { headers: {} };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and attaches user when token is valid", async () => {
    const token = jwt.sign({ id: "user-123" }, "test-secret");
    prisma.user.findUnique.mockResolvedValue({
      id: "user-123",
      username: "alice",
      email: "alice@test.com",
      isAdmin: false,
    });

    const req = { headers: { authorization: `Bearer ${token}` } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await protect(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.user.id).toBe("user-123");
  });

  it("returns 401 when token is invalid", async () => {
    const req = { headers: { authorization: "Bearer bad.token.here" } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    await protect(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });
});

describe("admin middleware", () => {
  it("returns 401 when user is not an admin", () => {
    const req = { user: { isAdmin: false } };
    const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    const next = jest.fn();

    admin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next when user is an admin", () => {
    const req = { user: { isAdmin: true } };
    const res = {};
    const next = jest.fn();

    admin(req, res, next);

    expect(next).toHaveBeenCalled();
  });
});
