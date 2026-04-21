import { apiUrl } from "./common/Config";
import { Offer } from "./types";
import { get, post } from "./common/RequestHelper";

const baseUrl = apiUrl + "onlineVouchers/";

export const submitImportCoupon = async (request: Offer[]): Promise<any> => {
  const jwtToken = JSON.parse(localStorage.getItem("auth")!).data.jwtToken;
  const url = baseUrl + "submitImportCoupon";
  const res = await post(url, request, jwtToken);
  return res.data;
};

export const getOnlineOffers = async (): Promise<any> => {
  const jwtToken = JSON.parse(localStorage.getItem("auth")!).data.jwtToken;
  const url = baseUrl + "getOnlineOffers";
  const res = await get(url, jwtToken);
  return res.data;
};
