import React, {useEffect} from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import Loading from '../screens/Loading';
import Login from '../screens/Login';
import {AuthStackParams} from '../types';
import Onboarding from '../screens/Onboarding';
import HuntVerificationTutorial from '../screens/HuntVerificationTutorial';
import PreRegister from '../screens/PreRegister';
import Register from '../screens/Register';
import ForgotPassword from '../screens/ForgotPassword';
import ResetPassword from '../screens/ResetPassword';
import {useNavigation} from '@react-navigation/native';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import {verifyEmail} from '../api/user';
import Toast from 'react-native-toast-message';
import {screenHeight} from '../utils/UIHelper';
import AsyncStorage from '@react-native-async-storage/async-storage';

const {Navigator, Screen} = createNativeStackNavigator<AuthStackParams>();

const AuthNavigator = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();

  const handleDynamicLink = async (link: any) => {
    let urlString = link.url as string;
    urlString = urlString.replace('https://trash2cashapp.page.link/', '');
    const mode = urlString.split('?')[0];
    urlString = urlString.replace(mode + '?data=', '');
    let data = '';
    let email = '';
    if (urlString.includes('&email=')) {
      data = urlString.split('&email=')[0];
      email = urlString.split('&email=')[1];
    } else {
      data = urlString;
    }
    const result = await verifyEmail({email, token: data!});
    if (result) {
      AsyncStorage.setItem('email_verification_token', data!);
      if (mode === 'email-verify') {
        navigation.navigate('Register', {data: data, email: email});
      } else if (mode === 'forgot-password') {
        navigation.navigate('ResetPassword', {data: data});
      }
    } else {
      Toast.show({
        type: 'Error',
        text1: 'Wrong verification token',
        position: 'top',
        topOffset: screenHeight / 3,
        visibilityTime: 1200,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = dynamicLinks().onLink(handleDynamicLink);
    // When the component is unmounted, remove the listener
    return () => unsubscribe();
  }, []);

  return (
    <Navigator
      initialRouteName={'Loading'}
      screenOptions={{headerShown: false}}>
      <Screen
        name="Loading"
        component={Loading}
        options={{headerShown: false}}
      />
      <Screen name="Login" component={Login} options={{headerShown: false}} />
      <Screen
        name="Register"
        component={Register}
        options={{headerShown: false}}
      />
      <Screen
        name="PreRegister"
        component={PreRegister}
        options={{headerShown: false}}
      />
      <Screen
        name="Onboarding"
        component={Onboarding}
        options={{headerShown: false}}
      />
      <Screen
        name="HuntVerificationTutorial"
        component={HuntVerificationTutorial}
        options={{headerShown: false}}
      />
      <Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{headerShown: false}}
      />
      <Screen
        name="ResetPassword"
        component={ResetPassword}
        options={{headerShown: false}}
      />
    </Navigator>
  );
};

export default AuthNavigator;
