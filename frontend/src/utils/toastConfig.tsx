import React from 'react';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {BaseToastProps} from 'react-native-toast-message';
import Colors from '../assets/Colors';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Text from '../components/Text';
import {screenWidth} from './UIHelper';

interface BaseCustomToastProps {
  props: BaseToastProps;
  containerStyle?: StyleProp<ViewStyle>;
}

const BaseCustomToast = ({props, containerStyle}: BaseCustomToastProps) => {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.container, {top: insets.top + 16}, containerStyle]}>
      <Text fontSize={14} fontWeight="600" style={styles.titleContainer}>
        {props.text1!}
      </Text>
      <Text fontSize={12}>{props.text2!}</Text>
    </View>
  );
};

export const toastConfig = {
  error: (props: BaseToastProps) => {
    return <BaseCustomToast props={props} />;
  },
  success: (props: BaseToastProps) => {
    return (
      <BaseCustomToast
        containerStyle={{borderLeftColor: Colors.lightGreen}}
        props={props}
      />
    );
  },
  copyMessage: () => {
    return (
      <View style={styles.copyMessageContainer}>
        <Text fontSize={18} color={Colors.white}>
          {'Copied to clipboard'}
        </Text>
      </View>
    );
  },
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 7,
    borderLeftWidth: 12,
    borderLeftColor: Colors.red,
    paddingHorizontal: 14,
    paddingTop: 10,
    paddingBottom: 18,
    width: screenWidth - 68,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 99999,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  copyMessageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderRadius: 15,
    backgroundColor: Colors.mediumDarkGray,
  },
});
