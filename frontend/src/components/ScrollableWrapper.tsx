import React, {ReactNode, useCallback, useEffect, useRef} from 'react';
import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  ScrollViewProps,
  StyleSheet,
  View,
} from 'react-native';
import Colors from '../assets/Colors';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';
import {timingAnimation} from '../utils/AnimationHelper';
import IconButton from './IconButton';
import LeftIcon from '../assets/icons/arrow_left.png';
import Text from './Text';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParams} from '../types';

interface ScrollableWrapperProps extends ScrollViewProps {
  children: ReactNode;
  headerTitle?: string;
}
const ScrollableWrapper = ({
  children,
  headerTitle,
  ...props
}: ScrollableWrapperProps) => {
  const insets = useSafeAreaInsets();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();

  const wrapperOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startEnteringAnimation();
  }, []);

  const startEnteringAnimation = useCallback(() => {
    timingAnimation(wrapperOpacity, 1, 800);
  }, []);
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 30 : 0;
  const behavior = Platform.OS === 'ios' ? 'padding' : undefined;
  return (
    <SafeAreaView style={styles.wrapper}>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={behavior}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        {headerTitle && (
          <View style={styles.headerContainer}>
            <IconButton
              icon={LeftIcon}
              iconStyle={styles.headerLeftIcon}
              onPressButton={() => navigation.goBack()}
            />
            <Text fontSize={18} fontWeight="600">
              {headerTitle}
            </Text>
          </View>
        )}
        <Animated.ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            flex: 1,
            opacity: wrapperOpacity,
            marginBottom: -insets.bottom,
            marginTop: 16,
          }}
          {...props}>
          {children}
        </Animated.ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};
export default ScrollableWrapper;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 22,
  },
  headerLeftIcon: {
    height: 32,
    width: 32,
    tintColor: Colors.black,
    marginLeft: 16,
    marginRight: 8,
  },
});
