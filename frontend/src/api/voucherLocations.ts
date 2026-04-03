import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from './common/Config';
import {post} from './common/RequestHelper';
import {NearestLocation} from '../types/types';
import {GetNearestLocationsRequest} from './types';

const baseUrl = apiUrl + 'voucherLocations/';

export const getNearestLocations = async (
  req: GetNearestLocationsRequest,
): Promise<NearestLocation[]> => {
  const url = baseUrl + 'getNearestLocations';
  const token = await AsyncStorage.getItem('jwtToken');
  const result = await post(url, req, token);
  return result.data as NearestLocation[];
};
