import React, {useEffect} from 'react';
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import Colors from '../assets/Colors';
import DefaultAvatar from '../assets/images/placeholder_avatar.png';
import GradientWrapper from './GradientWrapper';
import Text from './Text';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParams} from '../types';
import {s3BaseUrl} from '../api/common/Config';
import {useAppSelector} from '../redux/store';
interface UserProps {
  avatar: any;
  level: number;
  isHuntOwner?: boolean;
  containerStyle?: StyleProp<ViewStyle>;
  isSocialUser: boolean | null;
}

const User = ({
  avatar,
  level,
  isHuntOwner = false,
  containerStyle,
  isSocialUser = false,
}: UserProps) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();
  const {isTutorial} = useAppSelector(state => state.app);
  const avatarUri = isSocialUser || isTutorial ? avatar : s3BaseUrl + avatar;
  const userImageStyle = isHuntOwner ? styles.smallUserImage : styles.userImage;
  const _avatar = !isTutorial
    ? avatarUri === null ||
      avatarUri.trim() === '' ||
      avatarUri.trim() === s3BaseUrl
      ? DefaultAvatar
      : {uri: avatarUri}
    : avatar === null
    ? DefaultAvatar
    : avatar;

  return (
    <TouchableOpacity
      disabled={isHuntOwner || isTutorial}
      style={[styles.userContainer, containerStyle]}
      onPress={() => navigation.navigate('Profile')}>
      <FastImage
        defaultSource={DefaultAvatar}
        source={_avatar}
        resizeMode={FastImage.resizeMode.cover}
        style={userImageStyle}
      />
      <GradientWrapper style={styles.levelContainer}>
        <View style={styles.levelBorder} />
        <Text fontWeight="700" fontSize={14} color={Colors.white}>
          {level}
        </Text>
      </GradientWrapper>
    </TouchableOpacity>
  );
};

export default User;

const styles = StyleSheet.create({
  userContainer: {
    alignItems: 'center',
    top: -6,
  },
  smallUserImage: {
    height: 36,
    width: 36,
    borderRadius: 99,
  },
  userImage: {
    height: 40,
    width: 40,
    borderRadius: 99,
  },
  levelContainer: {
    height: 22,
    width: 22,
    borderRadius: 99,
    alignItems: 'center',
    position: 'absolute',
    justifyContent: 'center',
    bottom: -14,
  },
  levelBorder: {
    position: 'absolute',
    borderWidth: 1,
    borderRadius: 99,
    borderColor: Colors.white,
    height: '103%',
    width: '103%',
  },
});
