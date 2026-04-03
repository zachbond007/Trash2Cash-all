import {AppState, Platform, StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Text from '../components/Text';
import Colors from '../assets/Colors';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {AuthStackParams, SocialButton} from '../types';
import {validateEmail} from '../utils/ValidationHelper';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {AccessToken, LoginManager} from 'react-native-fbsdk-next';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import AuthWrapper from '../components/AuthWrapper';
import Toast from 'react-native-toast-message';
import {appleAuth} from '@invertase/react-native-apple-authentication';
import {registerEmailVerification, signinWithSocial} from '../api/user';
import {
  setIstTutorial,
  setLoggedIn,
  setRewardXp,
  setUser,
} from '../redux/slices/appSlice';
import {useAppDispatch} from '../redux/store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestNotificationPermission} from '../utils/NotificationsHelper';
import Modal from '../components/Modal';
import LottieView from 'lottie-react-native';
import EmailAnimation from '../assets/animations/email.json';

const PreRegister = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const {pageBehaviour = 'RETURNING_USER'} =
    useRoute<RouteProp<AuthStackParams, 'PreRegister'>>().params;
  const [email, setEmail] = useState('');
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] =
    useState(false);

  useEffect(() => {
    AppState.addEventListener('change', state => {
      if (state === 'background') {
        setIsEmailVerificationModalVisible(false);
      }
    });
  }, []);

  useEffect(() => {
    if (pageBehaviour === 'NEW_USER') {
      const prepareData = async () => {
        dispatch(setIstTutorial(false));
        const rewardXp = await AsyncStorage.getItem('rewardXp');
        dispatch(setRewardXp(JSON.parse(rewardXp!)));
      };
      prepareData();
    }
  }, []);

  const signInGoogle = async () => {
    const result = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(result.idToken);
    const cred = await auth().signInWithCredential(googleCredential);
    await postSocialSignIn(cred);
  };

  const signInFacebook = async () => {
    const result = await LoginManager.logInWithPermissions([
      'public_profile',
      'email',
    ]);
    if (result.isCancelled) {
      console.log('====', 'User cancelled the login process', '====');
      return;
    }
    const data = await AccessToken.getCurrentAccessToken();
    if (!data) {
      console.log('====', 'Could not get Facebook access token', '====');
      return;
    }
    const credential = auth.FacebookAuthProvider.credential(data.accessToken);
    const cred = await auth().signInWithCredential(credential);
    await postSocialSignIn(cred);
  };

  const signInApple = async () => {
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });
    if (!appleAuthRequestResponse.identityToken) {
      throw new Error('Apple Sign-In failed - no identify token returned');
    }
    const {identityToken, nonce} = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    const cred = await auth().signInWithCredential(appleCredential);

    await postSocialSignIn(cred, true);
  };
  const removeEmailRest = (email: string) => {
    var atIndex = email.indexOf('@');
    if (atIndex >= 0) {
      return email.substring(0, atIndex);
    } else {
      // No "@" symbol found, return the original email
      return email;
    }
  };
  const postSocialSignIn = async (
    resp: FirebaseAuthTypes.UserCredential,
    isAppleSignin = false,
  ) => {
    const response = await signinWithSocial({
      email: resp.user.email!,
      name: isAppleSignin
        ? removeEmailRest(resp.user.email!)
        : resp.user.displayName!,
      avatar: resp.user.photoURL!,
      uid: resp.user.uid,
    });
    await requestNotificationPermission();
    dispatch(setUser(response));
    dispatch(setLoggedIn('FROM_REGISTER'));
    await AsyncStorage.setItem('jwtToken', response.jwtToken);
    await AsyncStorage.setItem('email', resp.user.email!);
  };
  const onContinueWithSocialButtonClick = (type: SocialButton) => {
    switch (type) {
      case 'GOOGLE':
        signInGoogle();
        break;
      case 'FACEBOOK':
        signInFacebook();
        break;
      case 'APPLE':
        signInApple();
        break;
    }
  };
  const onSubmit = () => {
    const isEmailValid = validateEmail(email);
    if (isEmailValid) {
      // navigation.navigate('Register', {email});
      setIsEmailVerificationModalVisible(true);
      registerEmailVerification({email});
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
    }
  };

  return (
    <AuthWrapper
      title="Create an account!"
      isSignInDescription={pageBehaviour === 'RETURNING_USER'}
      buttonDisabled={email.length === 0}
      onButtonClick={onSubmit}
      description="To claim rewards, you need to create an account first."
      buttonTitle="Verify email"
      buttonStyle={styles.verifyButton}>
      <Button
        containerStyle={styles.socialSignUpButton}
        type="GOOGLE"
        titleFontSize={14}
        onPressButton={() => onContinueWithSocialButtonClick('GOOGLE')}
      />
      {/* <Button
        containerStyle={styles.socialSignUpButton}
        type="FACEBOOK"
        titleFontSize={14}
        onPressButton={() => onContinueWithSocialButtonClick('FACEBOOK')}
      /> */}
      {Platform.OS === 'ios' && (
        <Button
          containerStyle={styles.socialSignUpButton}
          type="APPLE"
          titleFontSize={14}
          onPressButton={() => onContinueWithSocialButtonClick('APPLE')}
        />
      )}
      <View style={styles.emailSignUpTitleWrapper}>
        <View style={styles.decorativeLine} />
        <Text style={styles.emailSignUpTitle} fontWeight="500">
          {`Or sign up with email`}
        </Text>
        <View style={styles.decorativeLine} />
      </View>
      <TextInput
        placeholder="Your email address"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
      />
      <Modal
        hideModalContentWhileAnimating
        containerStyle={styles.emailVerificationModalContainer}
        isVisible={isEmailVerificationModalVisible}>
        <>
          <LottieView
            speed={0.65}
            source={EmailAnimation}
            autoPlay
            loop
            style={styles.mailIcon}
          />
          <Text
            style={styles.emailVerificationModalTitle}
            fontSize={20}
            fontWeight="600">
            {`Verify your email address`}
          </Text>
          <Text style={styles.emailVerificationModalDescription}>
            {`Verification link has been sent to your email.`}
          </Text>
        </>
      </Modal>
    </AuthWrapper>
  );
};

export default PreRegister;

const styles = StyleSheet.create({
  socialSignUpButton: {
    marginBottom: 12,
  },
  emailSignUpTitleWrapper: {
    marginVertical: 36,
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 18,
  },
  decorativeLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.mediumGray,
  },
  emailSignUpTitle: {
    marginHorizontal: 16,
  },
  verifyButton: {
    marginTop: 36,
  },
  emailVerificationModalContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 24,
    alignItems: 'center',
  },
  mailIcon: {
    height: 100,
  },
  emailVerificationModalTitle: {
    marginTop: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  emailVerificationModalDescription: {
    textAlign: 'center',
  },
});
