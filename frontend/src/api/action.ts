import {get} from './common/RequestHelper';
import {apiUrl} from './common/Config';

import {ActionType} from './types';

const baseUrl = apiUrl + 'actions/';

export const getActionByType = async (type: ActionType) => {
  const url = baseUrl + type;
  const result = await get(url);
  return result.data;
};
