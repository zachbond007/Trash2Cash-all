import {PermissionsAndroid, Platform} from 'react-native';
import {PERMISSIONS, RESULTS, request} from 'react-native-permissions';

export const checkLocationPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } else {
    const granted = await request(PERMISSIONS.IOS.LOCATION_WHEN_IN_USE);
    if (granted === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  }
};

export const checkCameraPermissions = async () => {
  if (Platform.OS === 'android') {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } else {
    const granted = await request(PERMISSIONS.IOS.CAMERA);
    if (granted === RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  }
};
