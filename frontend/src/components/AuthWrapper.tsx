import React, {ReactNode} from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import Colors from '../assets/Colors';
import Text from './Text';
import LogoIcon from '../assets/icons/logo.png';
import Button from './Button';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParams} from '../types';
import Wrapper from './Wrapper';

interface AuthWrapperProps {
  children: ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
  buttonStyle?: StyleProp<ViewStyle>;
  buttonDisabled: boolean;
  isSignInDescription?: boolean;
  onButtonClick: () => void;
  description?: string;
  title: string;
  buttonTitle: string;
}
const AuthWrapper = ({
  children,
  contentContainerStyle,
  buttonStyle,
  buttonDisabled,
  onButtonClick,
  title,
  buttonTitle,
  description,
  isSignInDescription,
}: AuthWrapperProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const onSignInClick = () => {
    navigation.navigate('Login');
  };
  const keyboardVerticalOffset = Platform.OS === 'ios' ? 30 : 0;
  const behavior = Platform.OS === 'ios' ? 'padding' : undefined;
  return (
    <Wrapper>
      <KeyboardAvoidingView
        style={{flex: 1}}
        behavior={behavior}
        keyboardVerticalOffset={keyboardVerticalOffset}>
        <ScrollView
          contentContainerStyle={styles.container}
          style={styles.wrapper}>
          <Image source={LogoIcon} resizeMode="contain" style={styles.logo} />
          <Text fontSize={20} fontWeight="600">
            {title}
          </Text>
          {description &&
            (isSignInDescription ? (
              <View style={styles.descriptionWrapper}>
                <Text>{`Already have an account? `}</Text>
                <TouchableOpacity onPress={onSignInClick}>
                  <Text
                    fontWeight="500"
                    fontSize={16}
                    color={Colors.lightBlue}
                    style={styles.signInButtonTitle}>
                    {`Sign back in`}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text style={styles.description}>{description}</Text>
            ))}
          <View style={contentContainerStyle}>{children}</View>
          <Button
            disabled={buttonDisabled}
            title={buttonTitle}
            onPressButton={onButtonClick}
            containerStyle={[styles.button, buttonStyle]}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </Wrapper>
  );
};
export default AuthWrapper;
const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
  container: {
    paddingBottom: 60,
  },
  logo: {
    height: 50,
    width: '100%',
    marginVertical: 24,
  },
  descriptionWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 40,
  },
  signInButtonTitle: {
    textDecorationLine: 'underline',
  },
  description: {
    marginTop: 8,
    marginBottom: 40,
  },
  button: {
    marginHorizontal: 12,
  },
});
