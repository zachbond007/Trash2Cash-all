import {Image} from 'react-native-compressor';

export const compressImage = async (uri: string) =>
  await Image.compress(uri, {
    compressionMethod: 'auto',
    quality: 0.5,
  });
