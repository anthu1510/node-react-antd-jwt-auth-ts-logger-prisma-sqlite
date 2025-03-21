import { expect, test, vi, describe } from "vitest";
import request from "supertest";
import { findManyMockData } from "./mocks/auth.mock.data";
import { PrismaClient } from "@prisma/client";
import app from "../src/app";
import type { Users } from "@prisma/client";
import pwdHash from "password-hash";

vi.mock("@prisma/client", () => {
  const mockPrisma = {
    users: {
      findMany: vi.fn().mockResolvedValue(findManyMockData),
      create: vi.fn().mockImplementation((data) =>
        Promise.resolve({
          id: 1,
          ...data.data,
        })
      ),
      findUnique: vi.fn().mockImplementation(({ where }) => {
        if (where.email === "anthu1510@gmail.com") {
          return Promise.resolve({
            id: 1,
            name: "Aravinth",
            email: "anthu1510@gmail.com",
            password:
              "sha1$53904499$1$0ad63d2917f1a99757089287196b67dfe3a17893",
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
  test("should create a new user", async () => {
    const mockNewUser = {
      name: "Aravinth",
      email: "anthu1510@gmail.com",
      password: "12345",
      status: "active",
    };
    const generateSpy = vi
      .spyOn(pwdHash, "generate")
      .mockImplementation((password: string) => {
        return password === "12345"
          ? "sha1$53904499$1$0ad63d2917f1a99757089287196b67dfe3a17893"
          : "";
      });

    const response = await request(app)
      .post("/api/auth/create")
      .send(mockNewUser);
    expect(generateSpy).toHaveBeenCalledWith("12345");
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("id", 1);
    expect(prisma.users.create).toHaveBeenCalledWith({
      data: {
        ...mockNewUser,
        password: "sha1$53904499$1$0ad63d2917f1a99757089287196b67dfe3a17893",
      },
      omit: { password: true },
    });
    expect(response.body).toEqual(
      expect.objectContaining<
        Omit<Users, "password" | "createdAt" | "updatedAt">
      >({
        id: expect.any(Number), // id should be a string
        name: expect.any(String), // name should be a string
        email: expect.any(String), // email should be a string
        status: expect.any(String), // email should be a string
      })
    );
    generateSpy.mockRestore();
  });

  test("should login the user", async () => {
    const mockLogin = { email: "anthu1510@gmail.com", password: "12345" };

    const verifySpy = vi
      .spyOn(pwdHash, "verify")
      .mockImplementation(
        (password: string, hashedPassword: string): boolean => {
          return (
            password === "12345" &&
            hashedPassword ===
              "sha1$53904499$1$0ad63d2917f1a99757089287196b67dfe3a17893"
          );
        }
      );

    const response = await request(app).post("/api/auth/login").send(mockLogin);
    expect(prisma.users.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.users.findUnique).toHaveBeenCalledWith({
      where: { email: mockLogin.email },
    });
    expect(verifySpy).toHaveBeenCalledWith(
      mockLogin.password,
      "sha1$53904499$1$0ad63d2917f1a99757089287196b67dfe3a17893"
    );

    const result = pwdHash.verify(
      mockLogin.password,
      "sha1$53904499$1$0ad63d2917f1a99757089287196b67dfe3a17893"
    );

    expect(result).toBe(true);
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      accessToken: expect.any(String), // Matches any string (JWT is always a string)
      refreshToken: expect.any(String),
    });

    verifySpy.mockRestore();
  });

  test("should get all the users", async () => {
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
