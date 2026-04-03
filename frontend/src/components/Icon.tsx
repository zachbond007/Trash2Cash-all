import {Image, ImageSourcePropType, ImageStyle, StyleProp} from 'react-native';
import React from 'react';
interface IconProps {
  icon: ImageSourcePropType;
  iconStyle?: StyleProp<ImageStyle>;
  height?: number;
  width?: number;
}

const Icon = ({icon, iconStyle, height = 24, width = 24}: IconProps) => {
  return (
    <Image
      source={icon}
      resizeMode="contain"
      style={[iconStyle, {height: height, width: width}]}
    />
  );
};

export default Icon;
