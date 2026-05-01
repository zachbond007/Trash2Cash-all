import messaging from '@react-native-firebase/messaging';
import {PermissionsAndroid, Platform} from 'react-native';
import DeviceInfo from 'react-native-device-info';

export const requestNotificationPermission = async () => {
  if (Platform.OS === 'ios') {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
      return true;
    }
    return false;
  } else {
    if (Number(Platform.Version) < 33) {
      return true;
    }

    const res = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
    );
    return res === 'granted';
  }
};

export const getFCMToken = async () => {
  try {
    const hasPermission = await requestNotificationPermission();
    if (!hasPermission) {
      return '';
    }

    const isSimulator = await DeviceInfo.isEmulator();
    if (Platform.OS == 'ios' && isSimulator) {
      await messaging().setAPNSToken('test');
    }
    const token = await messaging().getToken();
    return token;
  } catch (error) {
    return '';
  }
};
