import {Animated, StyleSheet, View} from 'react-native';
import React, {useRef, useState} from 'react';
import TextInput from '../components/TextInput';
import Text from '../components/Text';
import Wrapper from '../components/Wrapper';
import LogoIcon from '../assets/icons/logo.png';
import Button from '../components/Button';
import {timingAnimation} from '../utils/AnimationHelper';
import EmailAnimation from '../assets/animations/email.json';
import LottieView from 'lottie-react-native';
import {validateEmail} from '../utils/ValidationHelper';
import {forgotPassword} from '../api/user';
import Toast from 'react-native-toast-message';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isEmailSent, setIsEmailSent] = useState(false);
  const contentOpacity = useRef(new Animated.Value(1)).current;
  const logoScale = useRef(new Animated.Value(1)).current;
  const logoMarginTop = useRef(new Animated.Value(24)).current;

  const onSubmit = async () => {
    const isEmailValid = validateEmail(email);
    if (isEmailValid) {
      forgotPassword({email});
      timingAnimation(contentOpacity, 0, 500, 0, () => {
        setIsEmailSent(true);
        timingAnimation(logoScale, 2, 500);
        timingAnimation(logoMarginTop, 100, 500);
        timingAnimation(contentOpacity, 1, 500);
      });
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
    }
  };

  return (
    <Wrapper>
      <View style={styles.wrapper}>
        <Animated.Image
          source={LogoIcon}
          resizeMode="contain"
          style={[
            styles.logo,
            {marginTop: logoMarginTop, transform: [{scale: logoScale}]},
          ]}
        />
        <Animated.View
          style={[styles.contentWrapper, {opacity: contentOpacity}]}>
          {!isEmailSent ? (
            <>
              <Text fontSize={20} fontWeight="600">
                {'Forgot password'}
              </Text>
              <TextInput
                placeholder="Your email address"
                value={email}
                onChangeText={text => setEmail(text)}
                keyboardType="email-address"
                useFormInput
                containerStyle={styles.input}
              />
              <Button
                disabled={!email}
                title="Send code"
                onPressButton={onSubmit}
                containerStyle={styles.button}
              />
            </>
          ) : (
            <View style={styles.checkEmailWrapper}>
              <LottieView
                source={EmailAnimation}
                autoPlay
                loop
                style={styles.mailIcon}
              />
              <Text
                style={styles.emailVerificationTitle}
                fontSize={20}
                fontWeight="600">
                {`Check your email`}
              </Text>
              <Text style={styles.emailVerificationDescription}>
                {`Password reset instructions have been sent to your email`}
              </Text>
            </View>
          )}
        </Animated.View>
      </View>
    </Wrapper>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 24,
  },
  logo: {
    height: 50,
    width: '100%',
    marginBottom: 24,
  },
  contentWrapper: {
    flex: 1,
  },
  button: {
    marginHorizontal: 12,
    marginTop: 56,
  },
  checkEmailWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mailIcon: {
    height: 100,
  },
  emailVerificationTitle: {
    marginTop: 24,
    marginBottom: 16,
    textAlign: 'center',
  },
  emailVerificationDescription: {
    textAlign: 'center',
    paddingHorizontal: 64,
  },
  input: {
    marginTop: 44,
  },
});
