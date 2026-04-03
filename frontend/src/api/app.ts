import {get} from './common/RequestHelper';
import {apiUrl} from './common/Config';

const baseUrl = apiUrl + 'configs/';

export const fetchConfigData = async () => {
  const url = baseUrl + 'fetchConfigData';
  const result = await get(url);
  return result.data;
};
