import Geolocation from '@react-native-community/geolocation';
import {Alert, Linking, Platform} from 'react-native';

export const getDirections = (address: string) => {
  // Google Maps
  const googleMapsUrl =
    Platform.OS === 'android'
      ? 'google.navigation:q=' + encodeURIComponent(address)
      : 'https://www.google.com/maps/dir/?api=1&destination=' +
        encodeURIComponent(address) +
        '&travelmode=driving';

  // Apple Maps
  const appleMapsUrl =
    'http://maps.apple.com/?daddr=' + encodeURIComponent(address) + '&dirflg=d';

  Alert.alert(
    'Open in...',
    '',
    [
      {
        text: 'Open in Google Maps',
        onPress: () => Linking.openURL(googleMapsUrl),
      },
      {
        text: 'Open in Apple Maps',
        onPress: () => Linking.openURL(appleMapsUrl),
      },
      {
        text: 'Cancel',
        style: 'cancel',
      },
    ],
    {cancelable: true},
  );
};

const RADIUS = 3000; // radius in meters

const getDistanceInMeter = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const deg2rad = (deg: any) => {
    return deg * (Math.PI / 180);
  };

  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d * 1000; // Distance in meters
};

export const isInRadius = (lat: number, lng: number, userLat: number, userLng: number): boolean => {
  const distance = getDistanceInMeter(userLat, userLng, lat, lng);
  if (distance <= RADIUS) {
    console.log('You are in the radius');
    return true;
  }
  console.log('You are not in the radius');
  return false;
};

export const getDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
) => {
  const meter = getDistanceInMeter(lat1, lon1, lat2, lon2);
  const milesPerMeter = 0.000621371;
  const mile = meter * milesPerMeter;
  return mile;
};
