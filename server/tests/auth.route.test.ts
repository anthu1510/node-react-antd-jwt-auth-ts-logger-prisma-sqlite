import { expect, test, vi, describe, beforeEach } from "vitest";
import request from "supertest";
import { PrismaClient } from "@prisma/client";
import app from "../src/app";
import type { Users } from "@prisma/client";

vi.mock("../src/config/env", () => ({
  env: {
    NODE_ENV: "test",
    ACCESS_TOKEN_SECRET: "test_secret",
    REFRESH_TOKEN_SECRET: "test_refresh_secret",
  },
}));

vi.mock("@prisma/client", () => {
  const mockPrisma = {
    users: {
      findMany: vi.fn().mockResolvedValue([
        {
          id: 1,
          name: "Aravinth",
          email: "anthu1510@gmail.com",
          status: "active",
          createdAt: "2025-03-17T14:53:20.455Z",
          updatedAt: "2025-03-17T14:53:20.455Z",
        },
      ]),
      create: vi
        .fn()
        .mockImplementation((data) =>
          Promise.resolve({ id: "1", ...data.data })
        ),
      findUnique: vi.fn().mockImplementation(({ where }) => {
        if (
          where.email === "anthu1510@gmail.com" &&
          where.password === "12345"
        ) {
          return Promise.resolve({
            id: 1,
            name: "Aravinth",
            email: "anthu1510@gmail.com",
            password: "12345",
            status: "active",
            createdAt: "2025-03-17T14:53:20.455Z",
            updatedAt: "2025-03-17T14:53:20.455Z",
          });
        }
        return Promise.resolve(null);
      }),
    },
  };
  return { PrismaClient: vi.fn(() => mockPrisma) };
});

const prisma = new PrismaClient();

describe("Auth API", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("should create a new user", async () => {
    const mockNewUser = {
      name: "Aravinth",
      email: "anthu1510@gmail.com",
      password: "12345",
      status: "active",
    };
    const response = await request(app)
      .post("/api/auth/create")
      .send(mockNewUser);
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", "1");
    expect(response.body).toEqual({ id: "1", ...mockNewUser });
    expect(prisma.users.create).toHaveBeenCalledWith({ data: mockNewUser });
  });

  test("should login the user", async () => {
    const mockLogin = { email: "anthu1510@gmail.com", password: "12345" };

    const response = await request(app).post("/api/auth/login").send(mockLogin);

    expect(prisma.users.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.users.findUnique).toHaveBeenCalledWith({
      where: { email: mockLogin.email, password: mockLogin.password },
    });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      accessToken: expect.any(String), // Matches any string (JWT is always a string)
      refreshToken: expect.any(String),
    });
  });

  test("should get all the users", async () => {
    const mockResponse = {
      id: 1,
      name: "Aravinth",
      email: "anthu1510@gmail.com",
      password: "12345",
      status: "active",
      createdAt: "2025-03-17T14:53:20.455Z",
      updatedAt: "2025-03-17T14:53:20.455Z",
    };
    const response = await request(app).get("/api/auth");
    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);

    expect(response.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining<Omit<Users, "password">>({
          id: expect.any(Number), // id should be a string
          name: expect.any(String), // name should be a string
          email: expect.any(String), // email should be a string
          status: expect.any(String), // email should be a string
          createdAt: expect.any(String), // email should be a string
          updatedAt: expect.any(String), // email should be a string
        }),
      ])
    );
  });
});
