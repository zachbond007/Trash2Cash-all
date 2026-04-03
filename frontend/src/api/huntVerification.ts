import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from './common/Config';
import {post} from './common/RequestHelper';
import {
  SubmitHuntVerificationRequest,
  SubmitHuntVerificationResponse,
} from './types';

const baseUrl = apiUrl + 'huntVerifications/';
export const submitHuntVerification = async (
  request: SubmitHuntVerificationRequest,
): Promise<SubmitHuntVerificationResponse> => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  const url = baseUrl + 'submitHuntVerification';
  const result = await post(url, request, jwtToken);
  return result.data as SubmitHuntVerificationResponse;
};
