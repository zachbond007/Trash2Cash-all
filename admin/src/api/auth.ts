import { post } from "./common/RequestHelper";
import { apiUrl } from "./common/Config";
import { LoginRequest, RegisterRequest, User } from "./types";

const baseUrl = apiUrl + "users/";
export const login = async (request: LoginRequest) => {
  let url = baseUrl + "login";
  return await post(url, request);
};

export const register = async (request: RegisterRequest) => {
  let url = baseUrl + "register";
  const response = await post(url, request);
  return response.data as User;
};
