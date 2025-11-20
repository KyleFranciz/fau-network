// backend/tests/app.test.ts
import request from "supertest";
import { describe, it, expect } from "vitest";
import { app } from "../src/app"; // path: backend/tests -> backend/src/app.ts

// These are simple integration tests for your Express routes.
describe("Backend routes", () => {
  it("GET / should return the test message", async () => {
    const res = await request(app).get("/");

    expect(res.status).toBe(200);
    expect(res.text).toContain(
      "If your seeing this the backend request is working properly",
    );
  });

  it("GET /events should return an array (even if empty)", async () => {
    const res = await request(app).get("/events");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /events/popular should return an array (even if empty)", async () => {
    const res = await request(app).get("/events/popular");

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /events/category/:categoryId should return an array (even if empty)", async () => {
    const dummyCategoryId = "9999"; // unlikely to exist, but should not error

    const res = await request(app).get(
      `/events/category/${dummyCategoryId}`,
    );

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
