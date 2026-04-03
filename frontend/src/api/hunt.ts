import {get} from './common/RequestHelper';
import {apiUrl} from './common/Config';

import {
  CreateHuntRequest,
  GetHuntsForVerificationRequest,
  VerificationHunt,
} from './types';
import {post} from './common/RequestHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = apiUrl + 'hunts/';

export const createHunt = async (req: CreateHuntRequest) => {
  const url = baseUrl + 'createHunt';
  const token = await AsyncStorage.getItem('jwtToken');
  const result = await post(url, req, token);
  return result.data;
};

export const getHuntsForVerification = async (
  req: GetHuntsForVerificationRequest,
): Promise<VerificationHunt[]> => {
  const url = baseUrl + 'getHuntsForVerification';
  const token = await AsyncStorage.getItem('jwtToken');
  const result = await post(url, req, token);
  return result.data as VerificationHunt[];
};
