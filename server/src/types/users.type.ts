export interface Users {
  id: number;
  name: string;
  email: string;
  password: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export type LoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};
