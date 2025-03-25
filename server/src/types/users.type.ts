export type TLoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
};

export type TLogin = {
  email: string;
  password: string;
};
