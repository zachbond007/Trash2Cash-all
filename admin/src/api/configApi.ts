import { apiUrl } from "./common/Config";
import { get } from "./common/RequestHelper";

const baseUrl = apiUrl + "configs/";

export const getConfigByKey = async (key: string): Promise<any> => {
  const jwtToken = JSON.parse(localStorage.getItem("auth")!).data.jwtToken;
  const url = baseUrl + "getConfigByKey/" + key;
  const res = await get(url, jwtToken);
  return res.data;
};
