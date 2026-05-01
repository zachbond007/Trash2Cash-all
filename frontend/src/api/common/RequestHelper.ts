import Axios from 'axios';

const headers: any = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

export const post = async (
  url: string,
  parameters: any,
  token: string | null = null,
): Promise<any> => {
  let res: any;

  if (token !== null) {
    headers.Authorization = 'Bearer ' + token;
  }
  await Axios.post(url, parameters, {
    headers: headers,
    timeout: 10000,
  })
    .then(response => {
      res = response;
    })
    .catch(err => {
      res = err.response ?? {data: null};
    });
  return res;
};

export const get = async (
  url: string,
  token: string | null = null,
): Promise<any> => {
  let res: any;
  if (token !== null) {
    headers.Authorization = 'Bearer ' + token;
  }
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 30000);
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers,
      signal: controller.signal,
    });
    const contentType = response.headers.get('content-type') ?? '';
    const data = contentType.includes('application/json')
      ? await response.json()
      : await response.text();
    res = {data, status: response.status};
  } catch {
    res = {data: null};
  } finally {
    clearTimeout(timeout);
  }
  return res;
};
