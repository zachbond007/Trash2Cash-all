import React, {ReactNode, useCallback, useEffect, useRef} from 'react';
import {Animated, StyleSheet, ViewProps} from 'react-native';
import Colors from '../assets/Colors';
import {SafeAreaView} from 'react-native-safe-area-context';
import {timingAnimation} from '../utils/AnimationHelper';

interface WrapperProps extends ViewProps {
  children: ReactNode;
}
const Wrapper = ({children, ...props}: WrapperProps) => {
  const wrapperOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startEnteringAnimation();
  }, []);

  const startEnteringAnimation = useCallback(() => {
    timingAnimation(wrapperOpacity, 1, 800);
  }, []);

  return (
    <SafeAreaView style={styles.wrapper}>
      <Animated.View style={{flex: 1, opacity: wrapperOpacity}} {...props}>
        {children}
      </Animated.View>
    </SafeAreaView>
  );
};
export default Wrapper;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});
