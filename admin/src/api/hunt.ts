import { apiUrl } from "./common/Config";
import { AdminVerifyHuntRequest } from "./types";
import { post } from "./common/RequestHelper";

const baseUrl = apiUrl + "hunts/";

export const adminVerifyHunt = async (
  request: AdminVerifyHuntRequest
): Promise<any> => {
  const jwtToken = JSON.parse(localStorage.getItem("auth")!).data.jwtToken;
  const response = await post(baseUrl + "adminVerifyHunt", request, jwtToken);
  return response.data;
};
