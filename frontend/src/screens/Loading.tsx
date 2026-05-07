import {Animated, Image, StyleSheet} from 'react-native';
import React, {useEffect, useRef} from 'react';
import BackgroundImage from '../assets/images/background.png';
import Logo from '../assets/icons/logo.png';
import {screenHeight, screenWidth} from '../utils/UIHelper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {AuthStackParams} from '../types';
import Colors from '../assets/Colors';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAppDispatch} from '../redux/store';
import {
  setRewardXp,
  setLoggedIn,
  setUser,
  setIstTutorial,
} from '../redux/slices/appSlice';
import {tutorialUser} from '../assets/DATA';
import {timingAnimation} from '../utils/AnimationHelper';
import {fetchUserData} from '../api/user';
import FastImage from 'react-native-fast-image';
import {s3BaseUrl} from '../api/common/Config';
import {fetchConfigData} from '../api/app';
import {getFCMToken} from '../utils/NotificationsHelper';
import Toast from 'react-native-toast-message';

const Loading = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const dispatch = useAppDispatch();

  const wrapperOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // AsyncStorage.clear();
    // AsyncStorage.removeItem('lastLoginDate');
    // AsyncStorage.removeItem('dayStreak');
    // FastImage.clearDiskCache();
    // FastImage.clearMemoryCache();
    const prepareData = async () => {
      try {
        const configData = await fetchConfigData();
        if (configData) {
          const imageUris = configData.merchantImageUris;
          const imagesToPreload =
            imageUris &&
            imageUris.length > 0 &&
            imageUris.map((x: string) => {
              return {uri: `${s3BaseUrl}${x}`};
            });
          if (imagesToPreload && imagesToPreload.length > 0) {
          FastImage.preload(imagesToPreload);
          }
          dispatch(setRewardXp(configData.verificationRewardXP));
          const token = await AsyncStorage.getItem('jwtToken');

          if (token) {
            const result = await fetchUserData();
            if (result) {
              const avatarUri = result.isSocialUser
                ? result.avatar
                : s3BaseUrl + result.avatar;
              FastImage.preload([{uri: `${avatarUri}`, priority: 'high'}]);
              dispatch(setUser(result));
              timingAnimation(wrapperOpacity, 0, 500, 0, () => {
                dispatch(setLoggedIn('FROM_LOGIN'));
              });
            } else {
              Toast.show({
                type: 'error',
                text1: 'An error occured. Restart the app',
                text2: 'Error: Fetching user data',
              });
            }
          } else {
            const returningUser = await AsyncStorage.getItem(
              'onboardingCompleted',
            );
            if (returningUser === '1') {
              timingAnimation(wrapperOpacity, 0, 500, 0, () => {
                navigation.reset({
                  index: 0,
                  routes: [
                    {
                      name: 'PreRegister',
                      params: {pageBehaviour: 'RETURNING_USER'},
                    },
                  ],
                });
              });
            } else {
              await AsyncStorage.setItem(
                'rewardXp',
                configData.verificationRewardXP.toString(),
              );
              dispatch(setUser(tutorialUser));
              dispatch(setRewardXp(25));
              timingAnimation(wrapperOpacity, 0, 500, 0, () => {
                dispatch(setIstTutorial(true));
                navigation.reset({
                  index: 0,
                  routes: [{name: 'Onboarding'}],
                });
              });
            }
          }
        } else {
          Toast.show({
            type: 'error',
            text1: 'An error occured. Restart the app',
            text2: 'Error: Fetching config data',
          });
        }
      } catch (error) {
        Toast.show({
          type: 'error',
          text1: 'An error occured. Restart the app',
          text2: `Error: ${error}`,
        });
      }
    };
    setTimeout(() => {
      try {
        prepareData();
      } catch (error) {
        prepareData();
      }
    }, 1000);
  }, []);
  return (
    <Animated.View style={[styles.container, {opacity: wrapperOpacity}]}>
      <Image
        source={BackgroundImage}
        resizeMode="cover"
        style={styles.backgroundImage}
      />
      <Image source={Logo} resizeMode="contain" style={styles.logo} />
    </Animated.View>
  );
};

export default Loading;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  backgroundImage: {
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
    opacity: 0.6,
  },
  logo: {
    height: 130,
    width: screenWidth,
  },
});
