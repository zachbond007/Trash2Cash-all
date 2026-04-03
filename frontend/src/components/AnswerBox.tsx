import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import GradientWrapper from './GradientWrapper';
import Text from './Text';
import Colors from '../assets/Colors';

interface AnswerBoxProps {
  onAnswerClick: () => void;
  disabled?: boolean;
  isSelected: boolean;
  style?: StyleProp<ViewStyle>;
  title: string;
}
const AnswerBox = ({
  onAnswerClick,
  disabled,
  style,
  isSelected,
  title,
}: AnswerBoxProps) => {
  return (
    <TouchableOpacity
      onPress={onAnswerClick}
      disabled={disabled}
      style={[
        styles.wrapper,
        style,
        disabled && !isSelected && {opacity: 0.5},
      ]}>
      <GradientWrapper transparent={!isSelected} style={styles.container}>
        <View style={[styles.circle, {borderWidth: isSelected ? 6 : 2}]} />
        <Text style={styles.title} color={Colors.white}>
          {title}
        </Text>
      </GradientWrapper>
    </TouchableOpacity>
  );
};

export default AnswerBox;

const styles = StyleSheet.create({
  wrapper: {
    flexDirection: 'row',
    marginTop: 16,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 6,
    paddingVertical: 4,
    borderRadius: 99,
    paddingRight: 12,
  },
  circle: {
    height: 16,
    width: 16,
    borderRadius: 99,
    borderColor: Colors.white,
  },
  title: {
    marginLeft: 8,
  },
});
