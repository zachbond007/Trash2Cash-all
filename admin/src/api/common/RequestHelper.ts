import Axios from "axios";

const headers: any = {
  Accept: "application/json",
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
};

export const post = async (
  url: string,
  parameters: any,
  token: string | null = null
): Promise<any> => {
  let res: any;

  if (token !== null) {
    headers.Authorization = "Bearer " + token;
  }
  await Axios.post(url, parameters, {
    headers: headers,
  })
    .then((response) => {
      res = response;
    })
    .catch((err) => {
      res = err.response.data;
    });
  return res;
};

export const get = async (
  url: string,
  token: string | null = null
): Promise<any> => {
  let res: any;
  if (token !== null) {
    headers.Authorization = "Bearer " + token;
  }
  await Axios.get(url, {
    headers: headers,
  })
    .then((response: any) => {
      res = response;
    })
    .catch((err) => {
      res = err.response;
    });
  return res;
};
