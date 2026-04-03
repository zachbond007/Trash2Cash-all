import {
  Image,
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
interface IconButtonProps {
  icon: ImageSourcePropType;
  containerStyle?: StyleProp<ViewStyle>;
  onPressButton: () => void;
  iconStyle?: StyleProp<ImageStyle>;
}

const IconButton = ({
  onPressButton,
  icon,
  containerStyle,
  iconStyle,
}: IconButtonProps) => {
  return (
    <TouchableOpacity onPress={onPressButton} style={containerStyle}>
      <Image
        source={icon}
        resizeMode="contain"
        style={[styles.icon, iconStyle]}
      />
    </TouchableOpacity>
  );
};

export default IconButton;

const styles = StyleSheet.create({
  icon: {
    height: 24,
    width: 24,
  },
});
