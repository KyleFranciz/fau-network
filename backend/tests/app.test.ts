// backend/tests/app.test.ts
import request from "supertest";
import { describe, it, expect, vi } from "vitest";

const buildMockQueryBuilder = () => {
  const response = { data: [], error: null };
  const builder: any = {
    select: () => builder,
    insert: () => builder,
    update: () => builder,
    delete: () => builder,
    eq: () => builder,
    gte: () => builder,
    ilike: () => builder,
    in: () => builder,
    order: () => builder,
    or: () => builder,
    single: () => {
      response.data = {};
      return builder;
    },
    then: (onFulfilled: (value: typeof response) => void, onRejected?: (reason: unknown) => void) =>
      Promise.resolve(response).then(onFulfilled, onRejected),
    catch: (onRejected: (reason: unknown) => void) =>
      Promise.resolve(response).catch(onRejected),
    finally: (onFinally: () => void) =>
      Promise.resolve(response).finally(onFinally),
  };

  return builder;
};

vi.mock("../src/supabaseClient", () => {
  return {
    supabase: {
      from: vi.fn(() => buildMockQueryBuilder()),
    },
  };
});

import { app } from "../src/index";

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
