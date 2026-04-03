import {Animated, Image, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import User from './User';
import Text from './Text';
import Colors from '../assets/Colors';
import {screenHeight} from '../utils/UIHelper';
import DisapproveIcon from '../assets/icons/disapprove.png';
import ReachedNoIcon from '../assets/icons/close_red.png';
import ReachedYesIcon from '../assets/icons/money.png';
import ApproveIcon from '../assets/icons/approve.png';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {timingAnimation} from '../utils/AnimationHelper';
import {increaseHuntVote} from '../redux/slices/appSlice';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

const HuntOwner = () => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const {isApprove, currentHuntDetails, currentHunt, isRewardAnimationVisible} =
    useAppSelector(state => state.app);
  const isReachedYes = currentHuntDetails?.yesCount === 5;
  const isReachedNo = currentHuntDetails?.noCount === 5;

  const [reachedIcon, setReachedIcon] = useState(
    isApprove ? ApproveIcon : DisapproveIcon,
  );
  const [reachedTitle, setReachedTitle] = useState('5 votes reached!');

  const approveValueTopPosition = useRef(new Animated.Value(0)).current;
  const approveValueOpacity = useRef(new Animated.Value(1)).current;
  const disapproveValueTopPosition = useRef(new Animated.Value(0)).current;
  const disapproveValueOpacity = useRef(new Animated.Value(1)).current;
  const reachedWrapperOpacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isRewardAnimationVisible) {
      if (isApprove) {
        if (currentHuntDetails!.yesCount === 4) {
          dispatch(increaseHuntVote());
          timingAnimation(reachedWrapperOpacity, 0, 700, 1500, () => {
            setReachedIcon(ReachedYesIcon);
            setReachedTitle(
              `${currentHuntDetails!.huntOwnerEarnedXP} points earned`,
            );
            timingAnimation(reachedWrapperOpacity, 1, 500);
          });
        } else {
          timingAnimation(approveValueOpacity, 0, 500, 1500);
          timingAnimation(approveValueTopPosition, -10, 500, 1500, () => {
            approveValueTopPosition.setValue(10);
            dispatch(increaseHuntVote());
            timingAnimation(approveValueTopPosition, 0, 500);
            timingAnimation(approveValueOpacity, 1, 500);
          });
        }
      } else {
        if (currentHuntDetails!.noCount === 4) {
          dispatch(increaseHuntVote());
          timingAnimation(reachedWrapperOpacity, 0, 700, 1500, () => {
            setReachedIcon(ReachedNoIcon);
            setReachedTitle(`0 points earned`);
            timingAnimation(reachedWrapperOpacity, 1, 500);
          });
        } else {
          timingAnimation(disapproveValueOpacity, 0, 500, 1500);
          timingAnimation(disapproveValueTopPosition, -10, 500, 1500, () => {
            disapproveValueTopPosition.setValue(10);
            dispatch(increaseHuntVote());
            timingAnimation(disapproveValueTopPosition, 0, 500);
            timingAnimation(disapproveValueOpacity, 1, 500);
          });
        }
      }
    }
  }, [isRewardAnimationVisible]);

  const yesCount = currentHuntDetails?.yesCount.toString();
  const noCount = currentHuntDetails?.noCount.toString();

  return (
    <View
      style={[styles.container, {bottom: screenHeight / 4 + insets.bottom}]}>
      {currentHuntDetails && (
        <User
          avatar={currentHuntDetails.userImageKey}
          level={currentHuntDetails.userLevel}
          containerStyle={styles.avatarContainer}
          isSocialUser={currentHuntDetails.isSocialUser}
          isHuntOwner
        />
      )}
      <View style={styles.userInfo}>
        <Text fontWeight="500">{currentHuntDetails?.userName}</Text>
        <View style={styles.voteInfoWrapper}>
          {!isReachedNo && !isReachedYes ? (
            <>
              <Image
                source={ApproveIcon}
                resizeMode="contain"
                style={styles.actionIcon}
              />
              <Animated.View
                style={{
                  top: approveValueTopPosition,
                  opacity: approveValueOpacity,
                }}>
                <Text color={Colors.green} style={styles.voteValue}>
                  {yesCount}
                </Text>
              </Animated.View>
              <Text color={Colors.green}>{'votes'}</Text>
              <Image
                source={DisapproveIcon}
                resizeMode="contain"
                style={[styles.actionIcon, {marginLeft: 10}]}
              />
              <Animated.View
                style={{
                  top: disapproveValueTopPosition,
                  opacity: disapproveValueOpacity,
                }}>
                <Text color={Colors.red} style={styles.voteValue}>
                  {noCount}
                </Text>
              </Animated.View>
              <Text color={Colors.red}>{'votes'}</Text>
            </>
          ) : (
            <Animated.View
              style={{opacity: reachedWrapperOpacity, flexDirection: 'row'}}>
              <Image
                source={reachedIcon}
                resizeMode="contain"
                style={styles.actionIcon}
              />
              <Text color={isReachedNo ? Colors.red : Colors.green}>
                {reachedTitle}
              </Text>
            </Animated.View>
          )}
        </View>
      </View>
    </View>
  );
};
export default HuntOwner;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignSelf: 'center',
    padding: 10,
    borderRadius: 99,
    zIndex: 99,
    alignItems: 'center',
    paddingRight: 14,
  },
  avatarContainer: {
    bottom: 8,
  },
  userInfo: {
    marginLeft: 8,
  },
  voteInfoWrapper: {
    flexDirection: 'row',
    marginTop: 6,
  },
  voteValue: {
    width: 10,
    textAlign: 'center',
    marginRight: 2,
  },
  actionIcon: {
    height: 18,
    width: 18,
    marginRight: 4,
  },
});
