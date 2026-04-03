import {StyleSheet} from 'react-native';
import React from 'react';
import {screenWidth} from '../utils/UIHelper';
import LinearGradient from 'react-native-linear-gradient';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const GradientOverlay = () => {
  const insets = useSafeAreaInsets();

  return (
    <LinearGradient
      start={{x: 0, y: 0}}
      end={{x: 0, y: 1}}
      colors={['transparent', 'rgba(0, 0, 0,0.7)']}
      style={[styles.overlay, {bottom: -insets.bottom}]}
    />
  );
};
export default GradientOverlay;

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    width: screenWidth,
    height: 200,
    zIndex: 0,
  },
});
