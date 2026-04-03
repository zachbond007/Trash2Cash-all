import {
  GestureResponderEvent,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React from 'react';
import Text from './Text';
import DisapproveIcon from '../assets/icons/disapprove.png';
import ApproveIcon from '../assets/icons/approve.png';
import Colors from '../assets/Colors';

interface ActionButtonProps {
  title: 'NO' | 'YES';
  onPressButton: ((event: GestureResponderEvent) => void) | undefined;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

const ActionButton = ({
  onPressButton,
  title = 'NO',
  disabled = false,
}: ActionButtonProps) => {
  const icon = title === 'YES' ? ApproveIcon : DisapproveIcon;
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={onPressButton}
      style={[styles.container, disabled && {opacity: 0.5}]}>
      <Image style={styles.buttonIcon} source={icon} resizeMode="contain" />
      <Text color={Colors.white} fontSize={14} style={{zIndex: 99}}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default ActionButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  buttonIcon: {
    height: 54,
    width: 54,
  },
});
