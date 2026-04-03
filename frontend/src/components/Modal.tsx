import React, {ReactNode} from 'react';
import {ScrollView, StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {ModalProps, default as RNModal} from 'react-native-modal';
import Colors from '../assets/Colors';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../utils/toastConfig';

interface CustomModalProps extends Partial<ModalProps> {
  containerStyle?: StyleProp<ViewStyle>;
  children: ReactNode;
  props?: ModalProps;
  scrollable?: boolean;
}
const Modal = ({
  containerStyle,
  children,
  scrollable = false,
  ...props
}: CustomModalProps) => {
  return (
    <RNModal
      hideModalContentWhileAnimating
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      animationInTiming={700}
      useNativeDriver
      style={{margin: 0}}
      {...props}>
      {scrollable ? (
        <ScrollView
          contentContainerStyle={{paddingBottom: 40}}
          style={[styles.wrapper, containerStyle]}
          showsVerticalScrollIndicator={false}>
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.wrapper, containerStyle]}>{children}</View>
      )}
      <Toast config={toastConfig} />
    </RNModal>
  );
};
export default Modal;
const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginHorizontal: 24,
  },
});
