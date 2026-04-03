import {StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Colors from '../assets/Colors';
import ActionButton from './ActionButton';
import Text from './Text';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppSelector} from '../redux/store';
import {calculateTimeDifference} from '../utils/DateHelper';
import {Animated} from 'react-native';
import {timingAnimation} from '../utils/AnimationHelper';

interface VerificationActionsProps {
  handleNo: () => void;
  handleYes: () => void;
  tutorialMode?: 'APPROVE' | 'DISAPPROVE';
  isLoading?: boolean;
}

const VerificationActions = ({
  handleNo,
  handleYes,
  tutorialMode,
  isLoading = false,
}: VerificationActionsProps) => {
  const insets = useSafeAreaInsets();
  const {currentHunt, isRewardAnimationVisible} = useAppSelector(
    state => state.app,
  );

  const [calculatedTime, setCalculatedTime] = useState<string | Date>('');

  const timeOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (currentHunt) {
      if (!!tutorialMode) {
        setCalculatedTime('12m ago');
      } else {
        setCalculatedTime(
          calculateTimeDifference(currentHunt?.createdAt) + ' ago',
        );
      }
      timingAnimation(timeOpacity, 1, 500);
    }
  }, [currentHunt]);
  useEffect(() => {
    if (isRewardAnimationVisible) {
      timingAnimation(timeOpacity, 0, 500);
    }
  }, [isRewardAnimationVisible]);

  const noButtonIsDisabled =
    tutorialMode === 'APPROVE' || isRewardAnimationVisible || isLoading;
  const yesButtonIsDisabled =
    tutorialMode === 'DISAPPROVE' || isRewardAnimationVisible || isLoading;

  return (
    <View style={[styles.container, {bottom: -insets.bottom}]}>
      <ActionButton
        disabled={noButtonIsDisabled}
        title="NO"
        onPressButton={handleNo}
      />
      <View style={styles.confirmationQuestionWrapper}>
        <Text
          style={styles.question}
          fontWeight="600"
          fontSize={16}
          color={Colors.white}>
          {'Is litter being thrown away?'}
        </Text>
        <View style={styles.questionDetailsWrapper}>
          <Animated.View style={{opacity: timeOpacity}}>
            <Text
              fontWeight="300"
              color={Colors.white}
              fontSize={12}
              style={styles.time}>
              {calculatedTime?.toString()}
            </Text>
          </Animated.View>
        </View>
      </View>
      <ActionButton
        disabled={yesButtonIsDisabled}
        title="YES"
        onPressButton={handleYes}
      />
    </View>
  );
};

export default VerificationActions;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  confirmationQuestionWrapper: {
    justifyContent: 'center',
    flex: 1,
    marginHorizontal: 10,
    alignSelf: 'baseline',
    marginTop: 6,
  },
  question: {
    textAlign: 'center',
  },
  questionDetailsWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
  },
  time: {
    height: 18,
  },
});
