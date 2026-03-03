import jwt from "jsonwebtoken";
import generateToken from "../utils/generateToken.js";

process.env.JWT_SECRET = "test-secret";

describe("generateToken", () => {
  it("returns a signed JWT containing the correct payload", () => {
    const token = generateToken("user-123", "alice", "alice@test.com", false);
    const decoded = jwt.verify(token, "test-secret");

    expect(decoded.id).toBe("user-123");
    expect(decoded.username).toBe("alice");
    expect(decoded.email).toBe("alice@test.com");
    expect(decoded.isAdmin).toBe(false);
  });

  it("sets isAdmin to true for admin users", () => {
    const token = generateToken("admin-1", "admin", "admin@test.com", true);
    const decoded = jwt.verify(token, "test-secret");

    expect(decoded.isAdmin).toBe(true);
  });

  it("throws when verified with the wrong secret", () => {
    const token = generateToken("user-123", "alice", "alice@test.com", false);

    expect(() => jwt.verify(token, "wrong-secret")).toThrow();
  });
});
