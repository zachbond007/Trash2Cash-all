import { get, post } from './common/RequestHelper';
import { apiUrl } from './common/Config';
import {
  ForgotPasswordRequest,
  LoginRequest,
  RegisterEmailVerificationRequest,
  RegisterUserRequest,
  ResetPasswordRequest,
  SigninWithSocialRequest,
  UpdateUserRequest,
  VerifyEmailRequest,
} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFCMToken } from '../utils/NotificationsHelper';
import axios from 'axios'; // Import axios for making HTTP requests
import logger from '../utils/logger'; // Import the logger

const baseUrl = apiUrl + 'users/';

export const registerUser = async (request: RegisterUserRequest) => {
  const fcmToken = await getFCMToken();
  request.fcmToken = fcmToken;
  const url = baseUrl + 'registerWithEmail';
  try {
    const result = await post(url, request);
    return result.data;
  } catch (error) {
    logger.error('Error in registerUser:', error);
  }
};

export const uploadProfileImage = async (imageUri: string): Promise<string> => {
  const url = baseUrl + 'uploadProfileImage';
  const formData = new FormData();
  formData.append('file', {
    uri: imageUri,
    type: 'image/jpeg',
    name: 'profile.jpg',
  } as any);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    });
    return response.data?.imageKey ?? '';
  } catch (error) {
    logger.error('Error in uploadProfileImage:', error);
    return '';
  }
};

export const registerEmailVerification = async (request: RegisterEmailVerificationRequest) => {
  const url = baseUrl + 'registerEmailVerification';
  const result = await post(url, request);
  return result;
};

export const verifyEmail = async (request: VerifyEmailRequest) => {
  const url = baseUrl + 'verifyEmail';
  const result = await post(url, request);
  return result.data;
};

export const login = async (request: LoginRequest) => {
  const url = baseUrl + 'login';
  const result = await post(url, request);
  return result.data;
};

export const forgotPassword = async (request: ForgotPasswordRequest) => {
  const url = baseUrl + 'forgotPassword';
  const result = await post(url, request);
  return result.data;
};

export const resetPassword = async (request: ResetPasswordRequest) => {
  const url = baseUrl + 'resetPassword';
  const result = await post(url, request);
  return result.data;
};

export const fetchUserData = async () => {
  const fcmToken = await getFCMToken();
  const token = await AsyncStorage.getItem('jwtToken');
  const url = baseUrl + 'fetchUserData';
  const result = await post(url, { fcmToken }, token);
  return result.data;
};

export const fetchProfileData = async () => {
  const token = await AsyncStorage.getItem('jwtToken');
  const url = baseUrl + 'fetchProfileData';
  const result = await get(url, token);
  return result.data;
};

export const updateUserData = async (req: UpdateUserRequest) => {
  const token = await AsyncStorage.getItem('jwtToken');
  const url = baseUrl + 'updateUser';
  const result = await post(url, req, token);
  return result.data;
};

export const signinWithSocial = async (req: SigninWithSocialRequest) => {
  const fcmToken = await getFCMToken();
  req.fcmToken = fcmToken;
  const url = baseUrl + 'registerWithSocial';
  try {
    const result = await post(url, req);
    return result.data;
  } catch (error) {
    logger.error('Error in signinWithSocial:', error);
  }
};

export const deleteUser = async () => {
  const token = await AsyncStorage.getItem('jwtToken');
  const url = baseUrl + 'deleteUser';
  const result = await post(url, {}, token);
  return result.data;
};
