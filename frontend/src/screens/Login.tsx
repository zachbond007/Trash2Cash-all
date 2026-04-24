import {StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import AuthWrapper from '../components/AuthWrapper';
import TextInput from '../components/TextInput';
import Text from '../components/Text';
import Colors from '../assets/Colors';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParams} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {login} from '../api/user';
import {useAppDispatch} from '../redux/store';
import {setLoggedIn, setUser} from '../redux/slices/appSlice';
import {validateEmail} from '../utils/ValidationHelper';
import Toast from 'react-native-toast-message';
import {requestNotificationPermission} from '../utils/NotificationsHelper';

const Login = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const onForgotPasswordClick = () => {
    navigation.navigate('ForgotPassword');
  };
  const onSubmit = async () => {
    const isEmailValid = validateEmail(email);
    if (isEmailValid) {
      const result = await login({email, password});
      if (result?.jwtToken) {
        await AsyncStorage.setItem('jwtToken', result.jwtToken);
        await AsyncStorage.setItem('email', email);
        dispatch(setUser(result));
        await requestNotificationPermission();
        dispatch(setLoggedIn('FROM_LOGIN'));
      } else {
        Toast.show({
          type: 'error',
          text1: 'Login Failed',
          text2: 'Please check your email and password and try again.',
        });
      }
    } else {
      Toast.show({
        type: 'error',
        text1: 'Invalid Email',
        text2: 'Please enter a valid email address',
      });
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const isSubmitDisabled = !email || password.length < 6;
  return (
    <AuthWrapper
      title="Sign in!"
      buttonDisabled={isSubmitDisabled}
      onButtonClick={onSubmit}
      buttonTitle="Sign in"
      contentContainerStyle={styles.formContainer}>
      <TextInput
        placeholder="Your email address"
        value={email}
        onChangeText={text => setEmail(text)}
        keyboardType="email-address"
        useFormInput
      />
      <TextInput
        containerStyle={styles.registerFormInput}
        placeholder="Password"
        value={password}
        onChangeText={text => setPassword(text)}
        onRightIconClick={togglePasswordVisibility}
        secureTextEntry={!showPassword}
        rightIcon
        useFormInput
      />
      <TouchableOpacity
        style={styles.forgotPasswordWrapper}
        onPress={onForgotPasswordClick}>
        <Text
          color={Colors.lightBlue}
          style={styles.forgotPassword}>{`Forgot password?`}</Text>
      </TouchableOpacity>
    </AuthWrapper>
  );
};

export default Login;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 44,
  },
  registerFormInput: {
    marginTop: 24,
  },
  forgotPasswordWrapper: {
    alignItems: 'flex-end',
    marginVertical: 18,
  },
  forgotPassword: {
    textDecorationLine: 'underline',
  },
});
