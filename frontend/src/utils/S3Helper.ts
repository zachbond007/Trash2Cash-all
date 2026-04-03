import {Storage} from 'aws-amplify';
import uuid from 'react-native-uuid';

export const uploadImage = async (
  imageUri: string,
  path: string,
): Promise<string> => {
  const imageName = (__DEV__ ? 'dev/' : 'prod/') + path + uuid.v4().toString();
  try {
    const imageType = getImageType(imageUri);
    const photo = await fetch(imageUri);
    const photoBlob = await photo.blob();
    const result = await Storage.put(imageName, photoBlob, {
      contentType: imageType,
      level: 'public',
    });
    const imageKey = 'public/' + result.key;
    return imageKey;
  } catch (err) {
    console.log('Error uploading file', err);
    return '';
  }
};

export const getImageType = (uri: string) => {
  const fileExtension = uri.split('.').pop();
  let type = '';
  switch (fileExtension) {
    case 'jpg':
      type = 'image/jpeg';
      break;
    case 'png':
      type = 'image/png';
      break;
    default:
      type = 'image/jpeg';
      break;
  }
  return type;
};
