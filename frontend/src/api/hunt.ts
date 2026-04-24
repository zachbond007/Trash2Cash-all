import {get} from './common/RequestHelper';
import {apiUrl} from './common/Config';
import {
  CreateHuntRequest,
  GetHuntsForVerificationRequest,
  VerificationHunt,
} from './types';
import {post} from './common/RequestHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Axios from 'axios';

const baseUrl = apiUrl + 'hunts/';

export const uploadHuntImage = async (imageUri: string): Promise<string> => {
  const token = await AsyncStorage.getItem('jwtToken');
  const url = baseUrl + 'uploadImage';
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'hunt.jpg',
  } as any);
  try {
    const response = await Axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: 'Bearer ' + token,
      },
      timeout: 30000,
    });
    return response.data?.imageKey ?? '';
  } catch (err) {
    console.log('[uploadHuntImage] error:', err);
    return '';
  }
};

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