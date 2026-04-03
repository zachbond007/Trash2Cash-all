import {
  ImageSourcePropType,
  ImageStyle,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Colors from '../assets/Colors';
import Text from './Text';
import GradientWrapper from './GradientWrapper';
import GoogleIcon from '../assets/icons/google.png';
import FacebookIcon from '../assets/icons/facebook.png';
import AppleIcon from '../assets/icons/apple.png';
import {SocialButton} from '../types';
import Icon from './Icon';
interface ButtonProps {
  title?: string;
  containerStyle?: StyleProp<ViewStyle>;
  wrapperStyle?: StyleProp<ViewStyle>;
  onPressButton: () => void;
  backgroundColor?: string;
  type?: SocialButton;
  disabled?: boolean;
  passive?: boolean;
  useDarkRedColors?: boolean;
  useGreenAndBlueColors?: boolean;
  titleFontSize?: number;
  rightIcon?: ImageSourcePropType | null;
  leftIcon?: ImageSourcePropType | null;
  rightIconStyle?: StyleProp<ImageStyle>;
  leftIconStyle?: StyleProp<ImageStyle>;
}

const Button = ({
  onPressButton,
  title,
  backgroundColor,
  containerStyle,
  wrapperStyle,
  type,
  disabled = false,
  passive = false,
  useGreenAndBlueColors = false,
  useDarkRedColors = false,
  titleFontSize = 18,
  rightIcon = null,
  leftIcon = null,
  rightIconStyle,
  leftIconStyle,
}: ButtonProps) => {
  let buttonColor = '';
  let leftIconSocial = null;
  let buttonTitle = '';
  let borderWidth = 0;
  let borderColor = '';

  switch (type) {
    case 'GOOGLE':
      buttonColor = Colors.white;
      leftIconSocial = GoogleIcon;
      buttonTitle = title || 'Continue with Google';
      borderWidth = 1.5;
      borderColor = Colors.lightGray;
      break;
    case 'FACEBOOK':
      buttonColor = Colors.blue;
      leftIconSocial = FacebookIcon;
      buttonTitle = title || 'Continue with Facebook';
      break;
    case 'APPLE':
      buttonColor = Colors.black;
      leftIconSocial = AppleIcon;
      buttonTitle = title || 'Continue with Apple';
      break;
    default:
      buttonColor = backgroundColor ?? '';
      buttonTitle = title ?? '';
      break;
  }

  return (
    <TouchableOpacity
      disabled={disabled || passive}
      activeOpacity={passive ? 1 : 0.2}
      onPress={onPressButton}
      style={[styles.wrapper, wrapperStyle]}>
      <GradientWrapper
        transparent={!!backgroundColor || !!type}
        useGreenAndBlueColors={useGreenAndBlueColors}
        useDarkRedColors={useDarkRedColors}
        style={[
          styles.linearGradient,
          {backgroundColor: buttonColor},
          borderWidth > 0 && {
            borderWidth: borderWidth,
            borderColor: borderColor,
          },
          disabled && {opacity: 0.3},
          containerStyle,
        ]}>
        {leftIcon && (
          <Icon icon={leftIcon} iconStyle={[styles.leftIcon, leftIconStyle]} />
        )}
        {leftIconSocial && (
          <Icon icon={leftIconSocial} iconStyle={styles.leftIconSocial} />
        )}
        <Text
          color={type !== 'GOOGLE' ? Colors.white : Colors.black}
          fontWeight={type ? '400' : '700'}
          fontSize={titleFontSize}
          style={[{zIndex: 1, textAlign: 'center'}]}>
          {buttonTitle}
        </Text>
        {rightIcon && (
          <Icon
            icon={rightIcon}
            iconStyle={[styles.rightIcon, rightIconStyle]}
          />
        )}
      </GradientWrapper>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 99,
  },
  linearGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
    width: '100%',
    borderRadius: 99,
  },
  leftIconSocial: {
    height: 24,
    width: 24,
    position: 'absolute',
    left: 16,
  },
  rightIcon: {
    height: 28,
    width: 28,
    marginLeft: 8,
  },
  leftIcon: {
    height: 28,
    width: 28,
    marginLeft: 8,
  },
});
