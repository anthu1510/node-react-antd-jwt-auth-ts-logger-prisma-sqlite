import { TFindManyUsers } from "../../src/types";

export const findManyMockData: TFindManyUsers[] = [
  {
    id: "96ef1f9c-d73b-47cd-a589-756b78dac4d8",
    name: "Aravinth",
    email: "anthu1510@gmail.com",
    status: "active",
    createdAt: new Date("2025-03-17T14:53:20.455Z"),
    updatedAt: new Date("2025-03-17T14:53:20.455Z"),
  },
  {
    id: "e4a2a27c-02d4-45c1-96da-344048630ecf",
    name: "Raja",
    email: "Raja@gmail.com",
    status: "active",
    createdAt: new Date("2025-03-17T14:53:20.455Z"),
    updatedAt: new Date("2025-03-17T14:53:20.455Z"),
  },
];

export const findUniqueUserMockData = {
  id: 1,
  name: "Aravinth",
  email: "anthu1510@gmail.com",
  password: "sha1$53904499$1$0ad63d2917f1a99757089287196b67dfe3a17893",
  status: "active",
  createdAt: "2025-03-17T14:53:20.455Z",
  updatedAt: "2025-03-17T14:53:20.455Z",
};
