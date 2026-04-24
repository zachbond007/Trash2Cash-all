import React, {useCallback, useEffect, useRef, useState} from 'react';
import GradientOverlay from '../components/GradientOverlay';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {
  Animated,
  TouchableOpacity,
  Image,
  View,
  StyleSheet,
} from 'react-native';
import appsFlyer from 'react-native-appsflyer';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {submitHuntVerification} from '../api/huntVerification';
import {ItemSize, VerificationHunt} from '../api/types';
import {huntSizeAnswers} from '../assets/DATA';
import AnswerBox from '../components/AnswerBox';
import Loader from '../components/Loader';
import VerificationActions from '../components/VerificationActions';
import {
  setIsTabBarVisible,
  setIsQuestionMode,
  setIsApprove,
  setIsRewardAnimationFinished,
  setCurrentHuntDetails,
  increaseLevelBarPercent,
  setIsRewardAnimationVisible,
  setCurrentHunt,
} from '../redux/slices/appSlice';
import {timingAnimation} from '../utils/AnimationHelper';
import {calculateLevelBarPercentage} from '../utils/ProgressBarHelper';
import {screenWidth, screenHeight} from '../utils/UIHelper';
import Colors from '../assets/Colors';
import Text from '../components/Text';
import ArrowIcon from '../assets/icons/arrow_left.png';
import Swiper from 'react-native-deck-swiper';
import FastImage, {Source} from 'react-native-fast-image';
import {s3BaseUrl} from '../api/common/Config';
import {getHuntsForVerification} from '../api/hunt';
import Icon from '../components/Icon';
import FacePalmIcon from '../assets/icons/face_palm.png';
import {getPreviouslySwipedCards} from '../utils/SwiperHelper';
import Toast from 'react-native-toast-message';

const HuntVerification = () => {
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();

  const {
    isRewardAnimationFinished,
    user,
    isApprove,
    isTutorial,
    rewardXp,
    currentHunt,
    isRewardAnimationVisible,
    isQuestionMode,
  } = useAppSelector(state => state.app);

  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [noButtonClicked, setNoButtonClicked] = useState(false);

  const [verificationHunts, setVerificationHunts] = useState<
    VerificationHunt[]
  >([]);
  const [isHuntImagesLoading, setIsHuntImagesLoading] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(true);
  const [autoSwipingRight, setAutoSwipingRight] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [noSelectedHuntIds, setNoSelectedHuntIds] = useState<number[]>([]);
  const [yesSelectedHuntIds, setYesSelectedHuntIds] = useState<number[]>([]);

  const noHuntWrapperOpacity = useRef(new Animated.Value(0)).current;
  const huntImagesLoaderOpacity = useRef(new Animated.Value(0)).current;
  const huntImagesLoaderTopPosition = useRef(
    new Animated.Value(-screenHeight / 2),
  ).current;

  const swiperRef = useRef<any>(null);

  const huntSizeSelectionWrapperOpacity = useRef(new Animated.Value(0)).current;
  const footerContainerOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const swiperData = useCallback(() => {
    const originalSwipeCount =
      noSelectedHuntIds.length + yesSelectedHuntIds.length;

    const previouslySwipedDuplicateCards = getPreviouslySwipedCards(
      verificationHunts,
      noSelectedHuntIds,
      yesSelectedHuntIds,
    );
    // console.log('==originalSwipeCount==', originalSwipeCount, '====');
    // previouslySwipedDuplicateCards.map((x: any) =>
    //   console.log('=ppp==', x?.huntId, ' === ', s3BaseUrl + x?.imageKey),
    // );
    return [
      ...previouslySwipedDuplicateCards,
      ...(isSwipingRight && !noButtonClicked
        ? [
            verificationHunts[originalSwipeCount],
            ...verificationHunts.slice(originalSwipeCount),
          ]
        : verificationHunts.slice(originalSwipeCount)),
    ];
  }, [
    isSwipingRight,
    verificationHunts,
    yesSelectedHuntIds,
    noSelectedHuntIds,
    noButtonClicked,
  ]);
  // console.log('==isQuestionMode==', isQuestionMode, '====');
  // swiperData().map((x: any) =>
  //   console.log('===', x?.huntId, ' === ', s3BaseUrl + x?.imageKey),
  // );
  // console.log('==currentCardIndex==', currentCardIndex, '====');
  useEffect(() => {
    timingAnimation(footerContainerOpacity, 1, 500, 0, () => {});
  }, []);

  useEffect(() => {
    if (isRewardAnimationFinished) {
      if (isApprove) {
        setAutoSwipingRight(true);
        swiperRef.current.swipeRight();
      }
      timingAnimation(huntSizeSelectionWrapperOpacity, 0, 500, 0, () => {
        timingAnimation(footerContainerOpacity, 1, 1000);
        setSelectedAnswer(null);
        dispatch(setIsTabBarVisible(true));
        dispatch(setIsQuestionMode(false));
        dispatch(setIsApprove(false));
        dispatch(setIsRewardAnimationFinished(false));
      });
    }
  }, [isRewardAnimationFinished]);

  const startXpBarAnim = async (answer: 'YES' | 'NO', itemSize?: ItemSize) => {
    setIsLoading(true);
    timingAnimation(loaderOpacity, 1, 500);
    try {
      const result = await submitHuntVerification({
        answer,
        huntId: currentHunt!.huntId,
        itemSize,
      });
      dispatch(setCurrentHuntDetails(result));
      if (result.userImageKey != null) {
        FastImage.preload([
          {
            uri: result.isSocialUser
              ? result.userImageKey
              : s3BaseUrl + result.userImageKey,
          },
        ]);
      }
      const calculatedXpPercent = calculateLevelBarPercentage(
        rewardXp,
        user!.targetXp,
      );

      timingAnimation(loaderOpacity, 0, 500, 0, () => {
        setIsLoading(false);
      });
      dispatch(increaseLevelBarPercent(calculatedXpPercent));
      dispatch(setIsRewardAnimationVisible(true));

      if (answer === 'NO' && noButtonClicked) {
        setNoButtonClicked(false);
      }
    } catch (err) {
      Toast.show({
        type: 'error',
        text1: 'An unknown error occured.',
        text2: 'Our developers have been informed. Please restart the app.',
      });
    }
  };
  const handleNo = () => {
    const card = swiperData()[currentCardIndex];
    if (!card) {
      setVerificationHunts([]);
      return;
    }
    setNoSelectedHuntIds([...noSelectedHuntIds, card.huntId]);
    setCurrentCardIndex(idx => idx + 1);
    dispatch(setIsApprove(false));
    startXpBarAnim('NO');
  };
  const handleYes = () => {
    setCurrentCardIndex(idx => idx + 1);
    if (!isQuestionMode) {
      const card = swiperData()[currentCardIndex];
      if (!card) {
        setVerificationHunts([]);
        return;
      }
      setYesSelectedHuntIds([...yesSelectedHuntIds, card.huntId]);
      timingAnimation(footerContainerOpacity, 0, 500, 0, () => {
        timingAnimation(huntSizeSelectionWrapperOpacity, 1, 500);
      });
      dispatch(setIsTabBarVisible(false));
    }
    dispatch(setIsQuestionMode(!isQuestionMode));
  };
  const handleGoBack = () => {
    setIsHuntImagesLoading(true);
    timingAnimation(huntImagesLoaderOpacity, 1, 500);
    timingAnimation(huntImagesLoaderTopPosition, 140, 500);
    swiperRef.current.swipeBack();
    setYesSelectedHuntIds([
      ...yesSelectedHuntIds.filter(
        x => x !== swiperData()[currentCardIndex].huntId,
      ),
    ]);
    setCurrentCardIndex(idx => idx - 1);
    dispatch(setIsQuestionMode(false));

    timingAnimation(huntSizeSelectionWrapperOpacity, 0, 500, 0, () => {
      dispatch(setIsTabBarVisible(true));

      timingAnimation(footerContainerOpacity, 1, 500, 0, () => {
        setTimeout(() => {
          setIsHuntImagesLoading(false);
        }, 350);
      });
    });
  };
  const onAnswerClick = (answer: string) => {
    const selectedItemSize =
      answer === huntSizeAnswers[0]
        ? '1_10_ITEMS'
        : answer === huntSizeAnswers[1]
        ? 'SMALL_BAG'
        : answer === huntSizeAnswers[2]
        ? 'LARGE_BAG'
        : 'MORE_THAN_LARGE_BAG';
    dispatch(setIsApprove(true));
    setSelectedAnswer(answer);
    startXpBarAnim('YES', selectedItemSize);
  };
  const isButtonDisabled = isLoading || isRewardAnimationVisible;

  useEffect(() => {
    const prepareData = async () => {
      setIsHuntImagesLoading(true);
      timingAnimation(huntImagesLoaderOpacity, 1, 500);
      timingAnimation(huntImagesLoaderTopPosition, 140, 500);
      const huntImages = await getHuntsForVerification({
        quantity: 3,
      });
      setVerificationHunts(huntImages);
      if (huntImages.length > 0) {
        dispatch(setCurrentHunt(huntImages[0]));
      }
      const arr: Source[] = huntImages
        .filter(x => x?.imageKey)
        .map(x => ({uri: s3BaseUrl + x.imageKey}));
      FastImage.preload(arr);
      timingAnimation(huntImagesLoaderOpacity, 0, 500, arr.length > 0 ? 1500 : 0, () => {
        setIsHuntImagesLoading(false);
      });
    };
    prepareData();
  }, []);

  useEffect(() => {
    const prepareData = async () => {
      if (isRewardAnimationFinished) {
        let tempHuntList: VerificationHunt[] = [...verificationHunts];
        if (verificationHunts.length - currentCardIndex < 2) {
          const huntIds = verificationHunts.map(x => x.huntId);
          const huntImages = await getHuntsForVerification({
            quantity: 6,
            huntIds,
          });
          const arr: Source[] = huntImages.map(x => {
            return {
              uri: `${s3BaseUrl + x?.imageKey}`,
            };
          });
          FastImage.preload(arr);
          if (huntImages?.length > 0) {
            tempHuntList = tempHuntList.concat(huntImages);
          }
          setVerificationHunts(tempHuntList);
        }
        const indexOfCurrentHunt = tempHuntList.findIndex(
          x => x.huntId === currentHunt?.huntId,
        );

        if (tempHuntList.length > indexOfCurrentHunt + 1) {
          dispatch(setCurrentHunt(tempHuntList[indexOfCurrentHunt + 1]));
        }
      }
    };
    prepareData();
  }, [isRewardAnimationFinished]);

  const onLoadedImage = () => {
    timingAnimation(huntImagesLoaderOpacity, 0, 500, 0, () => {
      setIsHuntImagesLoading(false);
      dispatch(
        setCurrentHunt(
          swiperData()[noSelectedHuntIds.length + yesSelectedHuntIds.length],
        ),
      );
    });
  };

  const noHuntExists = verificationHunts.length === 0;
  useEffect(() => {
    if (!isHuntImagesLoading && noHuntExists) {
      timingAnimation(noHuntWrapperOpacity, 1, 500);
    }
  }, [isHuntImagesLoading, noHuntExists]);

  const onLoadStart = () => {
    if (noHuntExists) {
      timingAnimation(noHuntWrapperOpacity, 1, 500);
    }
  };

  return (
    <Wrapper>
      {/* <Header /> */}
      <View style={[styles.wrapper, {marginBottom: -insets.bottom}]}>
        {isHuntImagesLoading && (
          <Animated.View
            style={[
              styles.huntImagesLoaderWrapper,
              {
                opacity: huntImagesLoaderOpacity,
                top: huntImagesLoaderTopPosition,
              },
            ]}>
            <Loader />
          </Animated.View>
        )}

        {!noHuntExists && <Swiper
  	  ref={swiperRef}
          ref={swiperRef}
          cards={swiperData()}
          cardIndex={currentCardIndex}
          renderCard={card => {
            if (card?.imageKey) {
              return (
                <View style={styles.card}>
                   <FastImage
                    onLoadStart={onLoadStart}
                    onLoadEnd={onLoadedImage}
                    onError={onLoadedImage}
                    source={{uri: s3BaseUrl + card.imageKey}}
                    resizeMode="cover"
                    style={styles.huntImage}
                  />
                </View>
              );
            }
            return null;
          }}
          onSwipedLeft={cardIndex => {
            handleNo();
          }}
          onSwipedRight={cardIndex => {
            handleYes();
          }}
          disableTopSwipe
          disableBottomSwipe
          disableLeftSwipe={isQuestionMode}
          disableRightSwipe={isQuestionMode}
          containerStyle={{backgroundColor: 'white'}}
          cardHorizontalMargin={0}
          cardVerticalMargin={0}
          showSecondCard
          onSwiping={(x, y) => {
            if (x > 0 && !isSwipingRight) {
              setIsSwipingRight(true);
            }
            if (x < 0 && isSwipingRight) {
              setIsSwipingRight(false);
            }
          }}
          stackSize={3}
          stackScale={-3}
          stackAnimationFriction={120}
          stackAnimationTension={0}
        />}

        {!isTutorial && noHuntExists && (
          <Animated.View
            style={[styles.noHuntWrapper, {opacity: noHuntWrapperOpacity}]}>
            <Icon icon={FacePalmIcon} height={218} width={218} />
            <Text fontSize={20} fontWeight="600" style={styles.noHuntTitle}>
              {'No new photos to verify '}
            </Text>
            <Text style={styles.noHuntDescription}>
              {'Come back later to see new pictures that have been submitted! '}
            </Text>
          </Animated.View>
        )}
      </View>
      <>
        {isLoading && (
          <Animated.View
            style={[styles.loaderWrapper, {opacity: loaderOpacity}]}>
            <Loader />
          </Animated.View>
        )}
        <Animated.View
          style={[
            styles.huntSizeSelectionWrapper,
            {
              opacity: huntSizeSelectionWrapperOpacity,
              bottom: 48 - insets.bottom,
            },
            !isQuestionMode && {display: 'none'},
          ]}>
          <TouchableOpacity
            style={[
              styles.backButtonContainer,
              isButtonDisabled && {opacity: 0.5},
            ]}
            onPress={handleGoBack}
            disabled={isButtonDisabled}>
            <Text color={Colors.white} fontSize={9}>
              {'go back'}
            </Text>
            <Image
              source={ArrowIcon}
              style={styles.backArrow}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <Text color={Colors.white} fontSize={16} fontWeight="600">
            {'How much litter?'}
          </Text>
          <View style={styles.answerListContainer}>
            <View style={{flex: 1.7}}>
              <AnswerBox
                disabled={isLoading || isRewardAnimationVisible}
                onAnswerClick={() => onAnswerClick(huntSizeAnswers[0])}
                title={huntSizeAnswers[0]}
                isSelected={selectedAnswer === huntSizeAnswers[0]}
              />
              <AnswerBox
                onAnswerClick={() => onAnswerClick(huntSizeAnswers[2])}
                title={huntSizeAnswers[2]}
                isSelected={selectedAnswer === huntSizeAnswers[2]}
                disabled={isButtonDisabled}
              />
            </View>
            <View style={{flex: 2}}>
              <AnswerBox
                onAnswerClick={() => onAnswerClick(huntSizeAnswers[1])}
                title={huntSizeAnswers[1]}
                isSelected={selectedAnswer === huntSizeAnswers[1]}
                disabled={isButtonDisabled}
              />
              <AnswerBox
                onAnswerClick={() => onAnswerClick(huntSizeAnswers[3])}
                title={huntSizeAnswers[3]}
                isSelected={selectedAnswer === huntSizeAnswers[3]}
                disabled={isButtonDisabled}
              />
            </View>
          </View>
        </Animated.View>

        <Animated.View
          pointerEvents={'box-none'}
          style={[
            styles.footerContainer,
            {
              opacity: footerContainerOpacity,
              bottom: 96,
            },
            isQuestionMode && {display: 'none'},
          ]}>
          <VerificationActions
            isLoading={isLoading}
            handleNo={() => {
              setNoButtonClicked(true);
              swiperRef.current.swipeLeft();
            }}
            handleYes={() => {
              swiperRef.current.swipeRight();
            }}
          />
        </Animated.View>
      </>
      <GradientOverlay />
      <GradientOverlay />
      <GradientOverlay />
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  loaderWrapper: {
    position: 'absolute',
    top: 140,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
  },
  huntSizeSelectionWrapper: {
    position: 'absolute',
    alignItems: 'center',
    right: 0,
    left: 0,
    zIndex: 1,
  },
  backButtonContainer: {
    zIndex: 2,
    top: 0,
    alignSelf: 'baseline',
    marginLeft: 16,
    alignItems: 'center',
  },
  backArrow: {
    height: 30,
    width: 30,
    marginTop: -4,
  },
  answerListContainer: {
    flexDirection: 'row',
    marginHorizontal: 16,
  },
  footerContainer: {
    width: screenWidth - 32,
    alignSelf: 'center',
    position: 'absolute',
    zIndex: 1,
  },
  tabBarContainer: {
    height: 65,
    marginVertical: 16,
    backgroundColor: Colors.white,
    borderRadius: 99,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  card: {
    flex: 1,
    borderColor: '#E8E8E8',
    justifyContent: 'center',
    width: screenWidth,
    height: screenHeight,
  },
  wrapper: {
    flex: 1,
    overflow: 'hidden',
  },
  huntImagesLoaderWrapper: {
    height: screenHeight,
    width: screenWidth,
    alignItems: 'center',
    zIndex: 199,
    position: 'absolute',
  },
  loader: {
    height: 100,
    width: 100,
  },
  noHuntWrapper: {
    width: screenWidth,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 99,
    paddingBottom: 50,
  },
  noHuntTitle: {
    paddingHorizontal: 52,
    marginTop: 36,
  },
  noHuntDescription: {
    paddingHorizontal: 70,
    textAlign: 'center',
    marginTop: 24,
  },
  huntImage: {
    height: screenHeight,
    width: screenWidth,
    position: 'absolute',
  },
});
export default HuntVerification;
