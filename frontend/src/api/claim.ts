import {apiUrl} from './common/Config';
import {AddClaimRequest} from './types';
import {post} from './common/RequestHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const baseUrl = apiUrl + 'claims/';

export const addClaim = async (req: AddClaimRequest) => {
  const token = await AsyncStorage.getItem('jwtToken');
  await post(baseUrl, req, token);
};
