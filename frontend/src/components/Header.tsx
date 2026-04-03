import {
  Animated,
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../assets/Colors';
import GradientWrapper from './GradientWrapper';
import Logo from '../assets/icons/logo.png';
import User from './User';
import {screenHeight, screenWidth} from '../utils/UIHelper';
import LevelUpAnimation from './LevelUpAnimation';
import {getLevelBarWidth} from '../utils/ProgressBarHelper';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {timingAnimation} from '../utils/AnimationHelper';
import Modal from './Modal';
import Text from './Text';
import UnlockedVoucherCard from './UnlockedVoucherCard';
import {AppStackParams, AuthStackParams} from '../types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {UnlockedVoucher} from '../types/types';
import {
  setIsRewardAnimationVisible,
  setUnlockedVouchers,
  updateLevel,
} from '../redux/slices/appSlice';
import {getVouchersByLevel} from '../api/voucher';
import {
  setSelectedCategory,
  setTabBehaviour,
} from '../redux/slices/marketplaceSlice';
import IconButton from './IconButton';
import BackIcon from '../assets/icons/arrow_left_black.png';
import EllipseIcon from '../assets/icons/ellipse.png';
import Geolocation from '@react-native-community/geolocation';
import Button from './Button';
import {checkLocationPermissions} from '../utils/LocationHelper';

interface HeaderProps {
  containerStyle?: StyleProp<ViewStyle>;
}

const Header = ({containerStyle}: HeaderProps) => {
  const authNavigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const appNavigation =
    useNavigation<NativeStackNavigationProp<AppStackParams>>();
  const dispatch = useAppDispatch();
  const {
    levelBarPercent,
    user,
    isRewardAnimationVisible,
    isRewardAnimationFinished,
    unlockedVouchers,
    isTutorial,
  } = useAppSelector(state => state.app);
  const {tabBehaviour, isMarketplaceScreen, selectedCategory, localVouchers} =
    useAppSelector(state => state.marketplace);
  const [isLevelUpModalVisible, setIsLevelUpModalVisible] = useState(false);
  const [isLevelUpModalClosed, setIsLevelUpModalClosed] = useState(false);
  const [isClaim, setIsClaim] = useState(false);
  const levelBarValue = useRef(new Animated.Value(20)).current;
  const containerTopPosition = useRef(new Animated.Value(-100)).current;

  const isLocalTab = tabBehaviour === 'LOCAL';
  const isCategoryTab = tabBehaviour === 'CATEGORY';
  const isOnlineTab = tabBehaviour === 'ONLINE';

  useEffect(() => {
    timingAnimation(containerTopPosition, 0, 800);
  }, []);
  useEffect(() => {
    const calculatedLevelBarWidth = getLevelBarWidth(levelBarPercent);
    const calculatedDelay = isRewardAnimationVisible ? 1300 : 0;
    timingAnimation(
      levelBarValue,
      calculatedLevelBarWidth,
      1800,
      calculatedDelay,
    );
  }, [isRewardAnimationVisible]);
  useEffect(() => {
    const prepareData = async () => {
      if (isRewardAnimationFinished) {
        const isLevelUp = levelBarPercent >= 100;
        if (isLevelUp) {
          if (isTutorial) {
            dispatch(updateLevel(20));
            setIsLevelUpModalVisible(true);
          } else {
            const locPermission = await checkLocationPermissions();
            if (locPermission) {
              Geolocation.getCurrentPosition(async res => {
                const result = await getVouchersByLevel(
                  user!.level + 1,
                  res.coords.latitude,
                  res.coords.longitude,
                );
                dispatch(setUnlockedVouchers(result.vouchers));
                setIsLevelUpModalVisible(true);
                dispatch(updateLevel(result.nextLevelRequiredXp));
              });
            } else {
              const result = await getVouchersByLevel(user!.level + 1, 0, 0);
              dispatch(setUnlockedVouchers(result.vouchers));
              setIsLevelUpModalVisible(true);
              dispatch(updateLevel(result.nextLevelRequiredXp));
            }
          }
        } else {
          dispatch(setIsRewardAnimationVisible(false));
        }
      }
    };
    prepareData();
  }, [isRewardAnimationFinished]);

  const renderUnlockedVoucher = (item: UnlockedVoucher, index: number) => (
    <UnlockedVoucherCard
      key={index}
      onCardClick={() => {
        setIsClaim(true);
        setIsLevelUpModalVisible(false);
      }}
      unlockedVoucher={item}
      dontShowClaim={isTutorial}
    />
  );

  const onLevelUpModalHide = () => {
    if (isTutorial) {
      AsyncStorage.setItem('onboardingCompleted', '1');
      dispatch(setIsRewardAnimationVisible(false));
      authNavigation.reset({
        index: 0,
        routes: [{name: 'PreRegister', params: {pageBehaviour: 'NEW_USER'}}],
      });
    } else if (isClaim) {
      setIsLevelUpModalVisible(false);
      setIsClaim(false);
      appNavigation.navigate('Marketplace');
    }
    setIsLevelUpModalClosed(true);
    setTimeout(() => {
      setIsLevelUpModalClosed(false);
    }, 1000);
  };

  const onTabClick = (selectedTab: 'LOCAL' | 'CATEGORY') => {
    const newTabBehaviour = selectedTab === 'LOCAL' ? 'LOCAL' : 'CATEGORY';
    if (
      (newTabBehaviour === 'LOCAL' && isCategoryTab) ||
      (newTabBehaviour === 'CATEGORY' && isLocalTab)
    ) {
      dispatch(setTabBehaviour(newTabBehaviour));
    }
  };

  const onBackFromOnlineList = () => {
    if (localVouchers.length === 0) {
      dispatch(setTabBehaviour(null));
    } else {
      dispatch(setTabBehaviour('CATEGORY'));
    }
    dispatch(setSelectedCategory(null));
  };
  return (
    <Animated.View
      pointerEvents="box-none"
      style={[styles.wrapper, containerStyle, {top: containerTopPosition}]}>
      <View
        style={[
          styles.shadow,
          tabBehaviour && isMarketplaceScreen && {height: 86},
        ]}
      />
      <View style={styles.container}>
        <Image source={Logo} resizeMode="contain" style={styles.logo} />
        <View style={styles.levelBarWrapper}>
          <Animated.View
            style={[styles.levelBarContentWrapper, {width: levelBarValue}]}>
            <GradientWrapper
              style={styles.levelBarFill}
              useGreenAndBlueColors
            />
          </Animated.View>
        </View>
        <User
          avatar={user!.avatar}
          level={user!.level}
          isSocialUser={user!.isSocialUser}
        />
      </View>
      {isMarketplaceScreen && tabBehaviour && (
        <View style={styles.marketplaceTabContainer}>
          {!isOnlineTab ? (
            <>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => onTabClick('LOCAL')}
                style={[styles.tabButton, !isLocalTab && {opacity: 0.4}]}>
                <Text fontWeight="500">{'Local Businesses'}</Text>
                {isLocalTab && (
                  <GradientWrapper
                    useGreenAndBlueColors
                    style={styles.bottomLine}
                  />
                )}
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => onTabClick('CATEGORY')}
                style={[styles.tabButton, !isCategoryTab && {opacity: 0.4}]}>
                <Text fontWeight="500">{'Online Businesses'}</Text>
                {isCategoryTab && (
                  <GradientWrapper
                    useGreenAndBlueColors
                    style={styles.bottomLine}
                  />
                )}
              </TouchableOpacity>
            </>
          ) : (
            <View style={styles.onlineVouchersHeaderContainer}>
              <IconButton
                icon={BackIcon}
                onPressButton={onBackFromOnlineList}
                iconStyle={styles.backIcon}
              />
              <Image
                source={EllipseIcon}
                resizeMode="contain"
                style={styles.onlineVouchersHeaderEllipse}
              />
              <Text
                fontWeight="600"
                fontSize={20}
                style={styles.onlineVouchersHeaderTitle}>
                {selectedCategory?.title}
              </Text>
            </View>
          )}
        </View>
      )}
      {isRewardAnimationVisible && (
        <LevelUpAnimation isLevelUpModalClosed={isLevelUpModalClosed} />
      )}
      <Modal
        onModalHide={onLevelUpModalHide}
        onBackButtonPress={() => !isTutorial && setIsLevelUpModalVisible(false)}
        onBackdropPress={() => !isTutorial && setIsLevelUpModalVisible(false)}
        backdropOpacity={0}
        containerStyle={styles.levelUpModalContainer}
        isVisible={isLevelUpModalVisible}>
        <GradientWrapper
          useGreenAndBlueColors
          style={styles.levelUpModalHeaderWrapper}>
          <Text fontWeight="600" fontSize={20} color={Colors.white}>
            {`Level ${(user!.level - 1).toString()} complete!!`}
          </Text>
        </GradientWrapper>
        {unlockedVouchers.length > 0 && (
          <>
            <Text style={styles.voucherListTitle} fontSize={16}>
              {'Discounts unlocked:'}
            </Text>
            <FlatList
              data={unlockedVouchers}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.voucherListWrapper}
              renderItem={({item, index}) => renderUnlockedVoucher(item, index)}
            />
          </>
        )}
        <Button
          onPressButton={() => {
            if (isTutorial) {
              setIsClaim(true);
              setIsLevelUpModalVisible(false);
            } else {
              setIsLevelUpModalVisible(false);
            }
          }}
          wrapperStyle={{width: '80%', alignSelf: 'center', marginTop: 32}}
          title={isTutorial ? 'Create an account!' : 'Awesome!'}
        />
      </Modal>
    </Animated.View>
  );
};

export default Header;

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    zIndex: 2,
    height: screenHeight,
  },
  container: {
    flexDirection: 'row',
    width: screenWidth,
    backgroundColor: Colors.white,
    borderBottomRightRadius: 16,
    borderBottomLeftRadius: 16,
    padding: 16,
    alignItems: 'center',
    zIndex: 2,
  },
  logo: {
    width: 62,
    height: 42,
  },
  levelBarWrapper: {
    flex: 1,
    height: 20,
    backgroundColor: Colors.lightGray,
    width: 200,
    borderRadius: 99,
    marginHorizontal: 12,
  },
  levelBarContentWrapper: {
    position: 'absolute',
    left: 0,
    height: '100%',
    backgroundColor: 'green',
    borderRadius: 99,
  },
  levelBarFill: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 99,
  },
  marketplaceTabContainer: {
    flexDirection: 'row',
    marginHorizontal: 18,
    width: screenWidth - 36,
    height: 46,
    position: 'absolute',
    top: 74,
    zIndex: 99,
  },

  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
  },
  bottomLine: {
    height: 3,
    width: '100%',
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  onlineVouchersHeaderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: screenWidth - 36,
    marginBottom: 8,
  },
  backIcon: {
    height: 32,
    width: 40,
  },
  onlineVouchersHeaderEllipse: {
    width: screenWidth - 112,
    position: 'absolute',
    right: -16,
    height: 50,
  },
  onlineVouchersHeaderTitle: {
    width: screenWidth - 112,
    position: 'absolute',
    right: -16,
    textAlign: 'center',
  },
  shadow: {
    height: 40,
    width: screenWidth,
    position: 'absolute',
    top: 34,
    zIndex: 0,
    borderRadius: 16,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  levelUpModalContainer: {
    paddingBottom: 24,
  },
  levelUpModalHeaderWrapper: {
    alignItems: 'center',
    paddingVertical: 32,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  voucherListTitle: {
    alignSelf: 'center',
    marginVertical: 24,
  },
  voucherListWrapper: {
    paddingHorizontal: 12,
  },
});
