import {Animated, StyleSheet, View} from 'react-native';
import React, {useCallback, useEffect, useRef} from 'react';
import MoneyIcon from '../assets/icons/money.png';
import Text from './Text';
import {screenHeight, screenWidth} from '../utils/UIHelper';
import HuntOwner from './HuntOwner';
import {timingAnimation} from '../utils/AnimationHelper';
import Colors from '../assets/Colors';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {
  setIsRewardAnimationFinished,
  setIsRewardAnimationVisible,
} from '../redux/slices/appSlice';

interface LevelUpAnimationProps {
  isLevelUpModalClosed: boolean;
}
const LevelUpAnimation = ({isLevelUpModalClosed}: LevelUpAnimationProps) => {
  const dispatch = useAppDispatch();
  const {levelBarPercent, isApprove, rewardXp, user, isRewardAnimationVisible} =
    useAppSelector(state => state.app);
  const {currentXp, targetXp, level} = user!;
  const xpHorizontalPosition = useRef(new Animated.Value(24)).current;
  const xpTopPosition = useRef(new Animated.Value(screenHeight / 2)).current;
  const moneyOpacity = useRef(new Animated.Value(1)).current;
  const xpOpacity = useRef(new Animated.Value(1)).current;
  const earnedXpOpacity = useRef(new Animated.Value(0)).current;
  const containerOpacity = useRef(new Animated.Value(0)).current;
  const backgroundOverlayOpacity = useRef(new Animated.Value(0)).current;

  const isLevelUp = levelBarPercent >= 100;
  const xpHorizontalPositionFirstStepValue = 84 + (screenWidth / 10) * 3;
  const xpHorizontalPositionSecondStepValue =
    (isLevelUp && isApprove
      ? 18
      : isLevelUp && !isApprove
      ? 36
      : isApprove
      ? 8
      : 26) +
    ((screenWidth - 158) *
      (isApprove
        ? 100 - (isLevelUp ? 100 : levelBarPercent)
        : isLevelUp
        ? 100
        : levelBarPercent)) /
      100;

  const startXpAnimaiton = useCallback(() => {
    timingAnimation(backgroundOverlayOpacity, 1, 1000);
    timingAnimation(containerOpacity, 1, 1000, 0, () => {
      timingAnimation(
        xpHorizontalPosition,
        xpHorizontalPositionFirstStepValue,
        1000,
        300,
      );

      timingAnimation(moneyOpacity, 0, 1000, 700);
      timingAnimation(xpTopPosition, 74, 1000, 300, () => {
        timingAnimation(xpOpacity, 0, 500);
        timingAnimation(earnedXpOpacity, 1, 500);
        timingAnimation(
          xpHorizontalPosition,
          xpHorizontalPositionSecondStepValue,
          700,
        );
        timingAnimation(xpTopPosition, 60, 700, 0, () => {
          if (!isLevelUp) {
            timingAnimation(backgroundOverlayOpacity, 0, 500, 500);
          }
          timingAnimation(containerOpacity, 0, 500, 500, () => {
            dispatch(setIsRewardAnimationFinished(true));
          });
        });
      });
    });
  }, []);
  useEffect(() => {
    startXpAnimaiton();
  }, []);
  useEffect(() => {
    if (isLevelUpModalClosed) {
      timingAnimation(backgroundOverlayOpacity, 0, 500, 0, () => {
        dispatch(setIsRewardAnimationVisible(false));
      });
    }
  }, [isLevelUpModalClosed]);
  return (
    <>
      <Animated.View style={[styles.container, {opacity: containerOpacity}]}>
        <Animated.Image
          style={[
            styles.money,
            {top: 32 + screenHeight / 2 / 5, opacity: moneyOpacity},
            isApprove
              ? {right: 84 + (screenWidth / 10) * 3}
              : {left: 84 + (screenWidth / 10) * 3},
          ]}
          source={MoneyIcon}
          resizeMode="contain"
        />
        <Animated.Image
          style={[
            styles.money,
            {top: 32 + (screenHeight / 2 / 5) * 2, opacity: moneyOpacity},
            isApprove
              ? {right: 84 + (screenWidth / 10) * 2}
              : {left: 84 + (screenWidth / 10) * 2},
          ]}
          source={MoneyIcon}
          resizeMode="contain"
        />
        <Animated.Image
          style={[
            styles.money,
            {top: 32 + (screenHeight / 2 / 5) * 3, opacity: moneyOpacity},
            isApprove
              ? {right: 84 + screenWidth / 10}
              : {left: 84 + screenWidth / 10},
          ]}
          source={MoneyIcon}
          resizeMode="contain"
        />
        <Animated.View
          style={[
            styles.xpBoxWrapper,
            {top: xpTopPosition},
            isApprove
              ? {right: xpHorizontalPosition}
              : {left: xpHorizontalPosition},
          ]}>
          <Animated.View
            style={[
              styles.xpBoxContainer,
              {opacity: xpOpacity, position: 'absolute'},
              isApprove ? {right: 0} : {left: 0},
            ]}>
            <Text fontWeight="700" color={Colors.white}>
              {`${rewardXp}XP`}
            </Text>
          </Animated.View>
          <Animated.View
            style={[styles.xpBoxContainer, {opacity: earnedXpOpacity}]}>
            <View style={styles.xpBoxTriangle} />
            <Text fontWeight="700" color={Colors.white}>
              {isLevelUp
                ? 'Level up!'
                : `${targetXp - currentXp}XP to level ${level + 1}`}
            </Text>
          </Animated.View>
        </Animated.View>
        <HuntOwner />
      </Animated.View>
      <Animated.View
        style={[styles.backgroundOverlay, {opacity: backgroundOverlayOpacity}]}
      />
    </>
  );
};

export default LevelUpAnimation;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    top: 0,
    alignItems: 'center',
    width: screenWidth,
    zIndex: 99,
  },
  money: {
    height: 40,
    width: 40,
    position: 'absolute',
  },
  xpBoxWrapper: {
    position: 'absolute',
    zIndex: 5,
  },
  xpBoxContainer: {
    paddingHorizontal: 18,
    paddingVertical: 6,
    borderRadius: 99,
    alignItems: 'center',
    backgroundColor: Colors.orange,
  },
  xpBoxTriangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 16,
    borderRightWidth: 16,
    borderBottomWidth: 20,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: Colors.orange,
    position: 'absolute',
    top: -12,
  },
  backgroundOverlay: {
    backgroundColor: Colors.backgroundOverlay,
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
    zIndex: 1,
  },
});
