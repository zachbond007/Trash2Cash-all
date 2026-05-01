import {StyleSheet, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import Text from '../components/Text';
import CloseIcon from '../assets/icons/close.png';
import SettingsIcon from '../assets/icons/settings.png';
import UserIcon from '../assets/icons/user.png';
import CalendarIcon from '../assets/icons/calendar.png';
import LevelCardIcon from '../assets/icons/level.png';
import IconButton from '../components/IconButton';
import Icon from '../components/Icon';
import Button from '../components/Button';
import Colors from '../assets/Colors';
import {screenWidth} from '../utils/UIHelper';
import InfoCard from '../components/InfoCard';
import {MainStackParams} from '../types';
import GradientWrapper from '../components/GradientWrapper';
import ScrollableWrapper from '../components/ScrollableWrapper';
import {useAppSelector} from '../redux/store';
import PointHistoryListItem from '../components/PointHistoryListItem';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {fetchProfileData} from '../api/user';
import {PointHistory} from '../types/types';
import {monthNames} from '../assets/DATA';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Profile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();
  const {levelBarPercent, user} = useAppSelector(state => state.app);
  const [profileDetails, setProfileDetails] = useState({
    dayStreak: 0,
    photosSubmitted: 0,
    photosVerified: 0,
    offersRedeemed: 0,
  });
  const [pointsHistoryList, setPointsHistoryList] = useState<PointHistory[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const prepareData = async () => {
      const result = await fetchProfileData();
      const dayStreak = await AsyncStorage.getItem('dayStreak');
      setPointsHistoryList(result.pointHistory);
      setProfileDetails({
        dayStreak: dayStreak ? parseInt(dayStreak) : 0,
        photosSubmitted: result.photosSubmitted,
        photosVerified: result.photosVerified,
        offersRedeemed: result.offersRedeemed,
      });
      setIsLoading(false);
    };
    prepareData();
  }, []);

  const _joinDate = new Date(user!.createdAt);
  const joinDate =
    'Joined ' +
    monthNames[_joinDate.getMonth()] +
    ' ' +
    _joinDate.getFullYear();
  return (
    <ScrollableWrapper contentContainerStyle={styles.container}>
      <View style={styles.headerCardWrapper}>
        <View style={styles.headerCardShadow} />
        <View style={styles.headerContainer}>
          <View style={styles.headerTopContainer}>
            <IconButton
              icon={CloseIcon}
              onPressButton={() => navigation.goBack()}
            />
            <Text fontSize={18} fontWeight="600" style={styles.headerTitle}>
              {'Profile'}
            </Text>
            <IconButton
              icon={SettingsIcon}
              onPressButton={() => navigation.navigate('Settings')}
              iconStyle={styles.settingsIcon}
            />
          </View>
          <View style={styles.userInfoContainer}>
            <View style={styles.nameContainer}>
              <Text fontSize={18} fontWeight="600">
                {user?.name}
              </Text>
              <Button
                title="Edit Profile"
                onPressButton={() => navigation.navigate('EditProfile')}
                titleFontSize={12}
                wrapperStyle={styles.editProfileButtonWrapper}
                containerStyle={styles.editProfileButton}
              />
            </View>
            <View style={styles.userDetails}>
              <Icon height={16} width={16} icon={UserIcon} />
              <Text
                style={styles.userText}
                fontSize={12}
                color={Colors.darkGray}>
                {user?.username}
              </Text>
            </View>
            <View style={styles.userDetails}>
              <Icon height={16} width={16} icon={CalendarIcon} />
              <Text
                style={styles.userText}
                fontSize={12}
                color={Colors.darkGray}>
                {joinDate}
              </Text>
            </View>
          </View>
        </View>
      </View>
      <View style={styles.infoCardsWrapper}>
        <InfoCard
          isLoading={isLoading}
          value={profileDetails.dayStreak}
          type="DAY_STREAK"
        />
        <InfoCard
          isLoading={isLoading}
          value={profileDetails.photosSubmitted}
          type="PHOTOS_SUBMITTED"
        />
      </View>
      <View style={styles.infoCardsWrapper}>
        <InfoCard
          isLoading={isLoading}
          value={profileDetails.photosVerified}
          type="PHOTOS_VERIFIED"
        />
        <InfoCard
          isLoading={isLoading}
          value={profileDetails.offersRedeemed}
          type="OFFERS_REDEEMED"
        />
      </View>
      <GradientWrapper style={styles.levelCard} useGreenAndBlueColors>
        <View style={styles.levelCardLeftContainer}>
          <Icon width={110} height={90} icon={LevelCardIcon} />
          <Text
            color={Colors.white}
            fontWeight="600"
            style={styles.levelIconTitle}>
            {`Level ${user?.level}`}
          </Text>
        </View>
        <View style={styles.levelCardRightContainer}>
          <Text
            color={Colors.white}
            fontSize={20}
            fontWeight="600"
            style={styles.levelCardTitle}>
            {`Level ${user?.level}`}
          </Text>
          <Text color={Colors.white} fontSize={12}>
            {`${user!.targetXp - user!.currentXp} XP to level ${
              user!.level + 1
            }`}
          </Text>
          <View style={styles.levelBarWrapper}>
            <View style={styles.levelBarBack} />
            <View
              style={[styles.levelBarFront, {width: `${levelBarPercent}%`}]}
            />
          </View>
        </View>
      </GradientWrapper>
      <View style={styles.footerContainer}>
        <Text fontSize={16} fontWeight="600" style={styles.footerTitle}>
          {'Points History'}
        </Text>
        {pointsHistoryList.length > 0 &&
          pointsHistoryList.map((item, index) => (
            <PointHistoryListItem key={index} {...item} />
          ))}
      </View>
    </ScrollableWrapper>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    paddingBottom: 50,
  },
  headerCardWrapper: {
    paddingBottom: 24,
    marginBottom: 8,
  },
  headerContainer: {
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
  headerCardShadow: {
    height: 40,
    width: screenWidth,
    position: 'absolute',
    backgroundColor: Colors.white,
    bottom: 0,
    zIndex: 0,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerTopContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  closeIcon: {
    height: 24,
    width: 24,
  },
  headerTitle: {
    flex: 1,
    marginLeft: 8,
  },
  settingsIcon: {
    height: 33,
    width: 33,
  },
  userInfoContainer: {
    marginTop: 10,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editProfileButtonWrapper: {
    marginLeft: 10,
  },
  editProfileButton: {
    height: 28,
    width: 96,
  },
  userDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  userText: {
    marginLeft: 8,
  },
  infoCardsWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 8,
  },
  levelCard: {
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 15,
    flexDirection: 'row',
    paddingLeft: 12,
    paddingRight: 16,
    paddingTop: 16,
    paddingBottom: 28,
    alignItems: 'center',
  },
  levelCardLeftContainer: {
    alignItems: 'center',
  },

  levelCardRightContainer: {
    marginLeft: 14,
    flex: 1,
  },
  levelIconTitle: {
    position: 'absolute',
    bottom: 17,
    alignSelf: 'center',
    transform: [{rotate: '-8deg'}],
    height: 21,
  },
  levelCardTitle: {
    marginBottom: 8,
  },
  levelBarWrapper: {
    marginTop: 8,
    height: 26,
    width: '100%',
    borderRadius: 99,
    overflow: 'hidden',
  },
  levelBarBack: {
    position: 'absolute',
    height: 26,
    left: 0,
    width: '100%',
    borderRadius: 99,
    backgroundColor: Colors.white,
    opacity: 0.3,
  },
  levelBarFront: {
    position: 'absolute',
    height: 26,
    left: 0,
    backgroundColor: Colors.white,
  },
  footerContainer: {
    marginHorizontal: 16,
    marginTop: 28,
  },
  footerTitle: {
    marginBottom: 16,
  },
});
