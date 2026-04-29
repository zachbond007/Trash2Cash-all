import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import TextInput from '../components/TextInput';
import Text from '../components/Text';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import Colors from '../assets/Colors';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AuthStackParams} from '../types';
import AuthWrapper from '../components/AuthWrapper';
import Modal from '../components/Modal';
import LottieView from 'lottie-react-native';
import EmailAnimation from '../assets/animations/email.json';
import VerifiedAnimation from '../assets/animations/verified.json';
import {useAppDispatch} from '../redux/store';
import {setLoggedIn, setUser} from '../redux/slices/appSlice';
import Toast from 'react-native-toast-message';
import {validateEmail} from '../utils/ValidationHelper';
import {registerUser, uploadProfileImage, verifyEmail} from '../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {requestNotificationPermission} from '../utils/NotificationsHelper';
import Loader from '../components/Loader';

const Register = () => {
  const {email: routeEmail, data} =
    useRoute<RouteProp<AuthStackParams, 'Register'>>().params || {};
  const dispatch = useAppDispatch();
  const [name, setName] = useState('');
  const [email, setEmail] = useState(routeEmail);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [avatar, setAvatar] = useState<Asset>();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEmailVerificationModalVisible, setIsEmailVerificationModalVisible] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onVerifiedAnimationFinish = () => {
    setTimeout(() => {
      dispatch(setLoggedIn('FROM_REGISTER'));
      setTimeout(() => {
        setIsEmailVerificationModalVisible(false);
      }, 100);
    }, 500);
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const openGallery = async () => {
    const image = await launchImageLibrary({
      mediaType: 'photo',
    });
    if (image.assets) {
      setAvatar(image.assets[0]);
    }
  };

  const onSubmit = async () => {
    const isEmailValid = validateEmail(email);
    const isPasswordValid = password.length >= 6;
    const isPasswordConfirmed = password === confirmPassword;

    if (!isEmailValid) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
    } else if (!isPasswordValid) {
      Toast.show({
        type: 'error',
        text1: 'Invalid Password',
        text2: 'Password must be at least 6 characters',
      });
    } else if (!isPasswordConfirmed) {
      Toast.show({
        type: 'error',
        text1: 'Password Mismatch',
        text2: 'Password and Confirm Password should match',
      });
    } else {
      let imageKey = '';
      setIsEmailVerificationModalVisible(true);
      setIsLoading(true);
      if (avatar) {
        imageKey = await uploadProfileImage(avatar.uri!);
        if (!imageKey) {
          setIsEmailVerificationModalVisible(false);
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Image upload failed',
            text2: 'Please try a different photo or continue without one.',
          });
          return;
        }
      }
      const verificationToken = await AsyncStorage.getItem(
        'email_verification_token',
      );

      const newUser = await registerUser({
        name,
        email,
        username,
        password,
        avatar: imageKey,
        verificationToken: verificationToken!,
      });
      if (newUser && newUser.jwtToken) {
        await requestNotificationPermission();
        dispatch(setUser(newUser));
        await AsyncStorage.setItem('jwtToken', newUser.jwtToken);
        await AsyncStorage.setItem('email', email);
        setIsLoading(false);
      } else {
        setIsEmailVerificationModalVisible(false);
        setTimeout(() => {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'An error occured during registration.',
            text2: newUser,
          });
        }, 1000);
      }
    }
  };

  const isSubmitDisabled =
    !email || !confirmPassword || !name || !password || !username;
  const hasProfilePicture = !!avatar;
  const addProfilePictureTitle = hasProfilePicture
    ? 'change profile pic'
    : '+ add profile pic';

  return (
    <AuthWrapper
      buttonDisabled={isSubmitDisabled}
      onButtonClick={onSubmit}
      contentContainerStyle={styles.registerFormContainer}
      buttonStyle={styles.createAccountButton}
      title="Create an account!"
      buttonTitle="Create account">
      <TextInput
        containerStyle={styles.registerFormInput}
        placeholder="Your name"
        value={name}
        onChangeText={text => setName(text)}
        useFormInput
      />
      <TextInput
        editable={false}
        containerStyle={styles.registerFormInput}
        placeholder="Your email address"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        useFormInput
      />
      <TextInput
        containerStyle={styles.registerFormInput}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
        useFormInput
      />
      <TextInput
        containerStyle={styles.registerFormInput}
        placeholder="Password (min 6 characters)"
        value={password}
        onChangeText={text => setPassword(text)}
        onRightIconClick={togglePasswordVisibility}
        secureTextEntry={!showPassword}
        rightIcon
        useFormInput
      />
      <TextInput
        containerStyle={styles.registerFormInput}
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={text => setConfirmPassword(text)}
        onRightIconClick={toggleConfirmPasswordVisibility}
        secureTextEntry={!showConfirmPassword}
        rightIcon
        useFormInput
      />
      <View style={styles.addProfilePictureWrapper}>
        {!!avatar && (
          <Image
            source={{uri: avatar.uri}}
            resizeMode="cover"
            style={styles.profilePicture}
          />
        )}
        <TouchableOpacity
          onPress={openGallery}
          style={[hasProfilePicture && {right: -112}]}>
          <Text
            style={styles.addProfilePictureTitle}
            color={Colors.mediumGray}
            fontSize={12}
            fontWeight="500">
            {addProfilePictureTitle}
          </Text>
        </TouchableOpacity>
      </View>
      <Modal
        hideModalContentWhileAnimating
        containerStyle={styles.emailVerificationModalContainer}
        isVisible={isEmailVerificationModalVisible}>
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <LottieView
              speed={0.65}
              source={VerifiedAnimation}
              autoPlay
              loop={false}
              style={styles.mailIcon}
              onAnimationFinish={onVerifiedAnimationFinish}
            />
            <Text
              style={styles.emailVerificationModalTitle}
              fontSize={20}
              fontWeight="600">
              {`Verified!`}
            </Text>
            <Text style={styles.emailVerificationModalDescription}>
              {`You have successfully verified your account`}
            </Text>
          </>
        )}
      </Modal>
    </AuthWrapper>
  );
};

export default Register;

const styles = StyleSheet.create({
  registerFormContainer: {
    marginTop: 44,
  },
  registerFormInput: {
    marginBottom: 24,
  },
  addProfilePictureWrapper: {
    borderWidth: 4,
    borderColor: Colors.grayBorder,
    borderRadius: 99,
    alignSelf: 'center',
    height: 112,
    width: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    borderRadius: 99,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  addProfilePictureTitle: {
    textAlign: 'center',
  },
  createAccountButton: {
    marginTop: 28,
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
