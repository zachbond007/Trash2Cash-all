import React, {ReactElement} from 'react';
import {
  TextInput as RNTextInput,
  StyleSheet,
  View,
  Image,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  TextInputProps,
} from 'react-native';
import Colors from '../assets/Colors';
import EyeIcon from '../assets/icons/eye.png';
import Text from './Text';

interface CustomTextInputProps extends Partial<TextInputProps> {
  containerStyle?: StyleProp<ViewStyle>;
  rightIcon?: boolean;
  useFormInput?: boolean;
  title?: string;
  props?: TextInputProps;
  onRightIconClick?: () => void;
}
const TextInput = ({
  containerStyle,
  rightIcon,
  useFormInput,
  title,
  onRightIconClick,
  ...props
}: CustomTextInputProps): ReactElement => {
  let fontFamily;
  let fontSize;

  if (useFormInput) {
    fontFamily = 'Poppins-Medium';
    fontSize = 16;
  } else {
    fontFamily = 'Poppins-Regular';
    fontSize = 14;
  }

  return (
    <View style={containerStyle}>
      {title && (
        <Text
          color={Colors.mediumGray}
          style={{marginLeft: 24, marginBottom: 8}}>
          {title}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          useFormInput && styles.formInputContainer,
        ]}>
        <RNTextInput
          placeholderTextColor={Colors.mediumGray}
          style={[styles.textInput, {fontFamily, fontSize}]}
          autoCapitalize="none"
          {...props}
        />
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconClick}>
            <Image
              source={EyeIcon}
              style={styles.rightIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};
export default TextInput;
const styles = StyleSheet.create({
  inputContainer: {
    height: 56,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderRadius: 99,
    backgroundColor: Colors.textInputBackground,
  },
  formInputContainer: {
    borderWidth: 3,
    borderColor: Colors.grayBorder,
    backgroundColor: Colors.white,
    height: 50,
  },
  textInput: {
    flex: 1,
    paddingLeft: 24,
    color: Colors.black,
    height: 50,
    top: 2,
  },
  rightIcon: {
    height: 30,
    width: 30,
    marginRight: 30,
    marginLeft: 8,
  },
});
