import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import ScrollableWrapper from '../components/ScrollableWrapper';
import SettingsButton from '../components/SettingsButton';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParams} from '../types';
import Button from '../components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../redux/store';
import {setLoggedIn} from '../redux/slices/appSlice';
import Modal from '../components/Modal';
import IconButton from '../components/IconButton';
import CloseIcon from '../assets/icons/close.png';
import Text from '../components/Text';
import {deleteUser} from '../api/user';

const Settings = () => {
  const dispatch = useAppDispatch();
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();
  const [isDeleteAccountModalVisible, setIsDeleteAccountModalVisible] =
    useState(false);

  const onLogoutClick = () => {
    AsyncStorage.setItem('jwtToken', '');
    AsyncStorage.setItem('loggedIn', '0');
    AsyncStorage.setItem('email', '');
    dispatch(setLoggedIn(null));
  };
  const onConfirmDeleteAccount = async () => {
    await deleteUser();
    onLogoutClick();
  };
  return (
    <ScrollableWrapper
      headerTitle="Settings"
      contentContainerStyle={styles.container}>
      <SettingsButton
        title="About Us"
        onPressButton={() => navigation.navigate('AboutUs')}
      />
      <SettingsButton
        title="Terms of Use"
        onPressButton={() => navigation.navigate('TermsOfUse')}
      />
      <SettingsButton
        title="Privacy Policies"
        onPressButton={() => navigation.navigate('PrivacyPolicy')}
      />
      <View style={styles.footerContainer}>
        <Button onPressButton={onLogoutClick} title="Logout" />
        <Button
          useDarkRedColors
          onPressButton={() => setIsDeleteAccountModalVisible(true)}
          title="Delete Account :("
          wrapperStyle={styles.deleteAccountButtonWrapper}
          containerStyle={styles.deleteAccountButtonContainer}
          titleFontSize={14}
        />
      </View>
      <Modal
        isVisible={isDeleteAccountModalVisible}
        onBackButtonPress={() => setIsDeleteAccountModalVisible(false)}
        onBackdropPress={() => setIsDeleteAccountModalVisible(false)}
        containerStyle={styles.deleteAccountModalContainer}>
        <IconButton
          icon={CloseIcon}
          onPressButton={() => setIsDeleteAccountModalVisible(false)}
        />
        <Text
          fontSize={15}
          fontWeight="500"
          style={styles.deleteAccountModalTitle}>
          {'Are you sure you want to delete your account?'}
        </Text>
        <Button
          title="Yes, delete my account"
          onPressButton={onConfirmDeleteAccount}
          useDarkRedColors
          wrapperStyle={styles.deleteAccountModalConfirmButtonWrapper}
          containerStyle={styles.deleteAccountModalConfirmButtonContainer}
          titleFontSize={14}
        />
      </Modal>
    </ScrollableWrapper>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    flex: 1,
  },
  footerContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 20,
  },
  deleteAccountButtonWrapper: {
    marginTop: 42,
  },
  deleteAccountButtonContainer: {
    marginHorizontal: 67,
    width: '80%',
    height: 40,
  },
  deleteAccountModalContainer: {
    padding: 16,
    marginHorizontal: 12,
  },
  deleteAccountModalTitle: {
    textAlign: 'center',
    paddingHorizontal: 56,
    marginTop: 16,
  },
  deleteAccountModalConfirmButtonWrapper: {
    marginTop: 36,
    alignSelf: 'center',
  },
  deleteAccountModalConfirmButtonContainer: {
    height: 40,
    paddingHorizontal: 44,
  },
});
