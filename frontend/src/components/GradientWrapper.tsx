import {StyleSheet, StyleProp, ViewStyle} from 'react-native';
import React, {ReactNode} from 'react';
import LinearGradient from 'react-native-linear-gradient';

interface GradientWrapperProps {
  children?: ReactNode;
  style?: StyleProp<ViewStyle>;
  useGreenAndBlueColors?: boolean;
  useDarkRedColors?: boolean;
  transparent?: boolean;
}

const GradientWrapper = ({
  children,
  style,
  useGreenAndBlueColors = false,
  useDarkRedColors = false,
  transparent = false,
}: GradientWrapperProps) => {
  const colors = transparent
    ? ['transparent', 'transparent']
    : useGreenAndBlueColors
    ? ['#1AA6BF', '#B7D631']
    : useDarkRedColors
    ? ['#D3231C', '#A60808']
    : ['#FCCF07', '#F69C13'];

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 1, y: 1}}
      colors={colors}
      style={style}>
      {children}
    </LinearGradient>
  );
};

export default GradientWrapper;

const styles = StyleSheet.create({});
