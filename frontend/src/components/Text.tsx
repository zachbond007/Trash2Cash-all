import {Text as RNText, TextStyle, StyleProp} from 'react-native';
import React, {ReactNode} from 'react';
import Colors from '../assets/Colors';

interface TextProps {
  style?: StyleProp<TextStyle>;
  fontWeight?: '300' | '400' | '500' | '600' | '700';
  fontSize?: number;
  color?: string;
  children: string | ReactNode;
}

const Text = ({style, fontWeight, fontSize, children, color}: TextProps) => {
  let fontFamily;

  switch (fontWeight) {
    case '300':
      fontFamily = 'Poppins-Light';
      break;
    case '500':
      fontFamily = 'Poppins-Medium';
      break;
    case '600':
      fontFamily = 'Poppins-SemiBold';
      break;
    case '700':
      fontFamily = 'Poppins-Bold';
      break;
    default:
      fontFamily = 'Poppins-Regular';
      break;
  }

  return (
    <RNText
      style={[
        style,
        {
          fontFamily,
          fontSize: fontSize ?? 14,
          color: color ?? Colors.black,
        },
      ]}>
      {children}
    </RNText>
  );
};

export default Text;
