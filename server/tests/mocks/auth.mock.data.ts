import type { Users } from "@prisma/client";

export const findManyMockData: Users[] = [
  {
    id: 1,
    name: "Aravinth",
    email: "anthu1510@gmail.com",
    status: "active",
    createdAt: "2025-03-17T14:53:20.455Z",
    updatedAt: "2025-03-17T14:53:20.455Z",
  },
  {
    id: 2,
    name: "Raja",
    email: "Raja@gmail.com",
    status: "active",
    createdAt: "2025-03-17T14:53:20.455Z",
    updatedAt: "2025-03-17T14:53:20.455Z",
  },
];
