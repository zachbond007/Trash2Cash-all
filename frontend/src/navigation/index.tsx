import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import AuthNavigator from './AuthNavigator';
import AppNavigator from './AppNavigator';
import {useAppSelector} from '../redux/store';

const RootNav = () => {
  const {loggedIn} = useAppSelector(state => state.app);

  const config = {
    screens: {
      ResetPassword: 'resetPassword',
      Register: 'register', // trashtocash://register?email=user@example.com&verified=true
    },
  };

  const linking = {
    prefixes: [
      'https://trash2cash.us',
      'https://trash2cashapp.page.link',
      'trashtocash://',
    ],
    config,
  };

  return (
    <NavigationContainer linking={linking}>
      {loggedIn ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

export default RootNav;
