import {Animated} from 'react-native';

export const timingAnimation = (
  animatedValue: Animated.Value,
  toValue: number,
  duration: number,
  delay?: number,
  callback?: () => void,
) => {
  Animated.timing(animatedValue, {
    toValue,
    duration,
    delay: delay ?? 0,
    useNativeDriver: false,
  }).start(callback);
};
