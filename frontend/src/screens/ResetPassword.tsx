import {StyleSheet} from 'react-native';
import React, {useState} from 'react';
import AuthWrapper from '../components/AuthWrapper';
import TextInput from '../components/TextInput';
import {useAppDispatch} from '../redux/store';
import {setLoggedIn, setUser} from '../redux/slices/appSlice';
import {AuthStackParams} from '../types';
import {useRoute, RouteProp} from '@react-navigation/native';
import {resetPassword} from '../api/user';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const ResetPassword = () => {
  const {data} = useRoute<RouteProp<AuthStackParams, 'ResetPassword'>>().params;
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async () => {
    const result = await resetPassword({
      newPassword: password,
      token: data!,
    });
    if (result) {
      await AsyncStorage.setItem('jwtToken', result.jwtToken);
      await AsyncStorage.setItem('email', result.email);
      dispatch(setUser(result));
      dispatch(setLoggedIn('FROM_LOGIN'));
    } else {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Something went wrong. Please try again later.',
      });
    }
  };
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };
  const isSubmitDisabled = password.length < 6 || password !== confirmPassword;
  return (
    <AuthWrapper
      title="New password"
      buttonDisabled={isSubmitDisabled}
      onButtonClick={onSubmit}
      buttonTitle="Sign in"
      contentContainerStyle={styles.formContainer}
      buttonStyle={styles.submitButton}>
      <TextInput
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
    </AuthWrapper>
  );
};

export default ResetPassword;

const styles = StyleSheet.create({
  formContainer: {
    marginTop: 44,
  },
  registerFormInput: {
    marginTop: 24,
  },
  submitButton: {
    marginTop: 56,
  },
});
