import React, {useCallback, useEffect, useRef, useState} from 'react';
import GradientOverlay from '../components/GradientOverlay';
import Wrapper from '../components/Wrapper';
import Header from '../components/Header';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {HuntVerificationType} from '../types';
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
import {getVouchersByLevel} from '../api/voucher';
import {
  tutorialHuntDetails,
  huntSizeAnswers,
  tutorialHunts,
} from '../assets/DATA';
import AnswerBox from '../components/AnswerBox';
import Loader from '../components/Loader';
import TabBarButton from '../components/Navigation/TabBarButton';
import VerificationActions from '../components/VerificationActions';
import {
  setIsTabBarVisible,
  setIsQuestionMode,
  setIsApprove,
  setIsRewardAnimationFinished,
  setCurrentHuntDetails,
  setUnlockedVouchers,
  increaseLevelBarPercent,
  setIsRewardAnimationVisible,
  setCurrentHunt,
  updateLevel,
} from '../redux/slices/appSlice';
import {timingAnimation} from '../utils/AnimationHelper';
import {calculateLevelBarPercentage} from '../utils/ProgressBarHelper';
import {screenWidth, screenHeight} from '../utils/UIHelper';
import Colors from '../assets/Colors';
import Text from '../components/Text';
import ArrowIcon from '../assets/icons/arrow_left.png';
import SwipeIcon from '../assets/icons/swipe.png';
import SwipeLeftIcon from '../assets/icons/swipe_left.png';
import Swiper from 'react-native-deck-swiper';
import FastImage from 'react-native-fast-image';
import {s3BaseUrl} from '../api/common/Config';
import {getHuntsForVerification} from '../api/hunt';
import Icon from '../components/Icon';
import FacePalmIcon from '../assets/icons/face_palm.png';

const HuntVerificationTutorial = () => {
  const [tutorialMode, setTutorialMode] =
    useState<HuntVerificationType>('APPROVE');

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

  const [verificationHunts, setVerificationHunts] = useState<
    VerificationHunt[]
  >([]);
  const [isHuntImagesLoading, setIsHuntImagesLoading] = useState(false);
  const [isSwipingRight, setIsSwipingRight] = useState(true);
  const [noButtonClicked, setNoButtonClicked] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);

  const frontHuntImageOpacity = useRef(new Animated.Value(0)).current;
  const noHuntWrapperOpacity = useRef(new Animated.Value(0)).current;
  const huntImagesLoaderOpacity = useRef(new Animated.Value(0)).current;
  const huntImagesLoaderTopPosition = useRef(
    new Animated.Value(-screenHeight / 2),
  ).current;

  const swiperRef = useRef<any>(null);

  const huntSizeSelectionWrapperOpacity = useRef(new Animated.Value(0)).current;
  const footerContainerOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const swipingTutorialOverlayOpacity = useRef(new Animated.Value(1)).current;
  const swipingTutorialContainerOpacity = useRef(new Animated.Value(0)).current;
  const swipeDescriptionTextOpacity = useRef(new Animated.Value(1)).current;
  const swipeRightTextOpacity = useRef(new Animated.Value(0.2)).current;
  const swipeIconRotation = useRef(new Animated.Value(0)).current;
  const [removeOverlayYes, setRemoveOverlayYes] = useState(false);
  const [removeOverlayNo, setRemoveOverlayNo] = useState(true);
  const swiperData = useCallback(() => {
    const originalSwipeCount =
      currentCardIndex -
      (isQuestionMode
        ? Math.round(currentCardIndex / 2) - 1
        : Math.round(currentCardIndex / 2));
    const previouslySwipedDuplicateCards = tutorialHunts
      .slice(0, originalSwipeCount)
      .reduce((a: any, i) => a.concat(i, i), []);
    return [
      ...previouslySwipedDuplicateCards,
      ...(isSwipingRight && !noButtonClicked
        ? [
            tutorialHunts[originalSwipeCount],
            ...tutorialHunts.slice(originalSwipeCount),
          ]
        : tutorialHunts.slice(originalSwipeCount)),
    ];
  }, [
    isSwipingRight,
    currentCardIndex,
    tutorialHunts,
    isQuestionMode,
    noButtonClicked,
  ]);

  useEffect(() => {
    if (isRewardAnimationFinished) {
      setTutorialMode('DISAPPROVE');
    }
  }, [isRewardAnimationFinished]);

  useEffect(() => {
    timingAnimation(footerContainerOpacity, 1, 500, 0, () => {
      timingAnimation(swipingTutorialOverlayOpacity, 0.6, 500);
      timingAnimation(swipingTutorialContainerOpacity, 1, 600, 0, () => {
        timingAnimation(swipeDescriptionTextOpacity, 0.2, 1350, 350, () => {});
        timingAnimation(swipeRightTextOpacity, 1, 1350, 350, () => {});
        timingAnimation(swipeIconRotation, 1, 1350, 350, () => {
          timingAnimation(swipingTutorialOverlayOpacity, 0, 600);
          timingAnimation(swipingTutorialContainerOpacity, 0, 600, 0, () => {
            setRemoveOverlayYes(true);
            setTimeout(() => {
              swipingTutorialOverlayOpacity.resetAnimation();
              swipingTutorialContainerOpacity.resetAnimation();
              swipeDescriptionTextOpacity.resetAnimation();
              swipeRightTextOpacity.resetAnimation();
              swipeIconRotation.resetAnimation();
            }, 500);
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    if (isRewardAnimationFinished) {
      if (isTutorial && tutorialMode === 'APPROVE') {
        swiperRef.current.swipeRight();
      }
      timingAnimation(huntSizeSelectionWrapperOpacity, 0, 500, 0, () => {
        timingAnimation(footerContainerOpacity, 1, 1000);
        setSelectedAnswer(null);
        dispatch(setIsTabBarVisible(true));
        dispatch(setIsQuestionMode(false));
        dispatch(setIsApprove(false));
        dispatch(setIsRewardAnimationFinished(false));

        if (isTutorial && tutorialMode === 'APPROVE') {
          setRemoveOverlayNo(false);
          timingAnimation(footerContainerOpacity, 1, 500, 0, () => {
            timingAnimation(swipingTutorialOverlayOpacity, 0.6, 500);
            timingAnimation(swipingTutorialContainerOpacity, 1, 500, 0, () => {
              timingAnimation(
                swipeDescriptionTextOpacity,
                0.2,
                1350,
                350,
                () => {},
              );
              timingAnimation(swipeRightTextOpacity, 1, 1350, 350, () => {});
              timingAnimation(swipeIconRotation, 1, 1350, 350, () => {
                timingAnimation(swipingTutorialOverlayOpacity, 0, 500);
                timingAnimation(
                  swipingTutorialContainerOpacity,
                  0,
                  500,
                  0,
                  () => {
                    setRemoveOverlayNo(true);
                  },
                );
              });
            });
          });
        }
      });
    }
  }, [isRewardAnimationFinished]);

  const startXpBarAnim = async (answer: 'YES' | 'NO', itemSize?: ItemSize) => {
    const calculatedXpPercent = calculateLevelBarPercentage(
      rewardXp,
      user!.targetXp,
    );
    dispatch(increaseLevelBarPercent(calculatedXpPercent));
    dispatch(setIsRewardAnimationVisible(true));
    if (!tutorialMode) {
      setIsLoading(true);
      timingAnimation(loaderOpacity, 1, 500);
      const result = await submitHuntVerification({
        answer,
        huntId: currentHunt!.huntId,
        itemSize,
      });
      dispatch(setCurrentHuntDetails(result));
    } else if (tutorialMode === 'DISAPPROVE') {
      dispatch(setCurrentHuntDetails(tutorialHuntDetails[1]));
      const result = await getVouchersByLevel(2, 0, 0);
      dispatch(setUnlockedVouchers(result?.vouchers));
    } else {
      dispatch(setCurrentHuntDetails(tutorialHuntDetails[0]));
    }

    timingAnimation(loaderOpacity, 0, 500, 0, () => {
      setIsLoading(false);
    });
    if (answer === 'NO' && noButtonClicked) {
      setNoButtonClicked(false);
    }
  };
  const handleNo = () => {
    setCurrentCardIndex(idx => idx + 1);
    dispatch(setIsApprove(false));
    startXpBarAnim('NO');
    appsFlyer.logEvent(
      'verification_no_clicked',
      {user},
      res => {
        console.log(res);
      },
      err => {
        console.error(err);
      },
    );
  };
  const handleYes = () => {
    setCurrentCardIndex(idx => idx + 1);
    dispatch(setIsTabBarVisible(false));
    dispatch(setIsQuestionMode(true));
    timingAnimation(footerContainerOpacity, 0, 500, 0, () => {
      timingAnimation(huntSizeSelectionWrapperOpacity, 1, 500);
    });
  };
  const handleGoBack = () => {
    setIsHuntImagesLoading(true);
    timingAnimation(huntImagesLoaderOpacity, 1, 500);
    timingAnimation(huntImagesLoaderTopPosition, 140, 500);
    swiperRef.current.swipeBack();
    setCurrentCardIndex(idx => idx - 1);
    dispatch(setIsQuestionMode(false));

    timingAnimation(huntSizeSelectionWrapperOpacity, 0, 500, 0, () => {
      dispatch(setIsTabBarVisible(true));

      timingAnimation(footerContainerOpacity, 1, 500, 0, () => {
        setIsHuntImagesLoading(false);
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
      if (isTutorial) {
        setVerificationHunts(tutorialHunts);
      } else {
        setIsHuntImagesLoading(true);
        timingAnimation(huntImagesLoaderOpacity, 1, 500);
        timingAnimation(huntImagesLoaderTopPosition, 140, 500);
        const huntImages = await getHuntsForVerification({
          quantity: 5,
        });
        setVerificationHunts(huntImages);
      }
    };
    prepareData();
  }, []);

  useEffect(() => {
    if (!isTutorial && verificationHunts.length > 0) {
      FastImage.preload([
        {
          uri: `${s3BaseUrl + verificationHunts[0]?.imageKey}`,
          priority: FastImage.priority.high,
        },
        {uri: `${s3BaseUrl + verificationHunts[1]?.imageKey}`},
        {uri: `${s3BaseUrl + verificationHunts[2]?.imageKey}`},
      ]);
    }
  }, [verificationHunts]);

  useEffect(() => {
    const prepareData = async () => {
      if (isRewardAnimationFinished) {
        const imagePosition = 1.2 * (isApprove ? screenWidth : -screenWidth);
        let tempHuntList: VerificationHunt[] = verificationHunts.slice(1);
        if (tempHuntList.length <= 2 && !isTutorial) {
          const huntIds = [tempHuntList[0]?.huntId, tempHuntList[1]?.huntId];
          const huntImages = await getHuntsForVerification({
            quantity: 3,
            huntIds,
          });
          if (huntImages?.length > 0) {
            tempHuntList = tempHuntList.concat(huntImages);
          }
        }
        setVerificationHunts(tempHuntList);
        dispatch(setCurrentHunt(tempHuntList[0]));
      }
    };
    prepareData();
  }, [isRewardAnimationFinished]);

  const onLoadedImage = () => {
    if (isTutorial) {
      timingAnimation(frontHuntImageOpacity, 1, 500, 0, () => {
        dispatch(setCurrentHunt(verificationHunts[0]));
      });
    } else {
      timingAnimation(huntImagesLoaderOpacity, 0, 500, 0, () => {
        setIsHuntImagesLoading(false);
        timingAnimation(frontHuntImageOpacity, 1, 500, 0, () => {
          dispatch(setCurrentHunt(verificationHunts[0]));
        });
      });
    }
  };

  const noHuntExists = verificationHunts.length === 0;
  const onLoadStart = () => {
    if (noHuntExists) {
      timingAnimation(noHuntWrapperOpacity, 1, 500);
    }
  };

  return (
    <Wrapper>
      <Header />
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

        <Swiper
          ref={swiperRef}
          cards={swiperData()}
          cardIndex={currentCardIndex}
          renderCard={card => {
            if (card?.imageKey) {
              return (
                <View style={styles.card}>
                  {!isTutorial ? (
                    <FastImage
                      onLoadStart={onLoadStart}
                      onLoadEnd={onLoadedImage}
                      source={{uri: card.imageKey}}
                      resizeMode="cover"
                      style={styles.huntImage}
                    />
                  ) : (
                    <FastImage
                      onLoadStart={onLoadStart}
                      onLoadEnd={onLoadedImage}
                      source={card.imageKey as unknown as number}
                      resizeMode="cover"
                      style={styles.huntImage}
                    />
                  )}
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
          disableLeftSwipe={
            isQuestionMode || (isTutorial && tutorialMode === 'APPROVE')
          }
          disableRightSwipe={
            isQuestionMode || (isTutorial && tutorialMode === 'DISAPPROVE')
          }
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
        />

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
                disabled={!!tutorialMode || isButtonDisabled}
              />
            </View>
            <View style={{flex: 2}}>
              <AnswerBox
                onAnswerClick={() => onAnswerClick(huntSizeAnswers[1])}
                title={huntSizeAnswers[1]}
                isSelected={selectedAnswer === huntSizeAnswers[1]}
                disabled={!!tutorialMode || isButtonDisabled}
              />
              <AnswerBox
                onAnswerClick={() => onAnswerClick(huntSizeAnswers[3])}
                title={huntSizeAnswers[3]}
                isSelected={selectedAnswer === huntSizeAnswers[3]}
                disabled={!!tutorialMode || isButtonDisabled}
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
              bottom: tutorialMode ? 0 : 96,
            },
            isQuestionMode && {display: 'none'},
          ]}>
          <VerificationActions
            isLoading={isLoading}
            tutorialMode={tutorialMode}
            handleNo={() => {
              setNoButtonClicked(true);
              swiperRef.current.swipeLeft();
            }}
            handleYes={() => {
              swiperRef.current.swipeRight();
            }}
          />
          {tutorialMode && (
            <View style={[styles.tabBarContainer, {bottom: -insets.bottom}]}>
              <TabBarButton isFocused title="XP" />
              <TabBarButton title="Home" />
              <TabBarButton title="Marketplace" />
            </View>
          )}
        </Animated.View>
        {!removeOverlayYes && (
          <>
            <Animated.View
              style={{
                position: 'absolute',
                bottom: 230,
                right: 60,
                alignItems: 'center',
                zIndex: 3,
                opacity: swipingTutorialContainerOpacity,
              }}>
              <Animated.Text
                style={{
                  color: Colors.white,
                  maxWidth: 160,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '600',
                  fontFamily: 'Poppins',
                  lineHeight: 32,
                  opacity: swipeDescriptionTextOpacity,
                }}>
                LITTER IS BEING THROWN AWAY...
              </Animated.Text>
              <Animated.Text
                style={{
                  color: Colors.white,
                  maxWidth: 160,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '600',
                  fontFamily: 'Poppins',
                  lineHeight: 32,
                  opacity: swipeRightTextOpacity,
                }}>
                SWIPE RIGHT!
              </Animated.Text>
              <Animated.Image
                source={SwipeIcon}
                resizeMode={'contain'}
                style={{
                  height: 140,
                  width: 75,
                  transform: [
                    {
                      rotate: swipeIconRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '30deg'],
                      }),
                    },
                  ],
                }}></Animated.Image>
            </Animated.View>
            <Animated.View
              style={{
                flex: 1,
                width: screenWidth,
                height: screenHeight,
                backgroundColor: Colors.black,
                opacity: 0.6,
                position: 'absolute',
                zIndex: 2,
              }}></Animated.View>
          </>
        )}
        {!removeOverlayNo && (
          <>
            <Animated.View
              style={{
                position: 'absolute',
                bottom: 230,
                left: 40,
                alignItems: 'center',
                zIndex: 3,
                opacity: swipingTutorialContainerOpacity,
              }}>
              <Animated.Text
                style={{
                  color: Colors.white,
                  maxWidth: 220,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '600',
                  fontFamily: 'Poppins',
                  lineHeight: 32,
                  opacity: swipeDescriptionTextOpacity,
                }}>
                LITTER IS{' '}
                <Animated.Text style={{textDecorationLine: 'underline'}}>
                  NOT
                </Animated.Text>{' '}
                BEING THROWN AWAY...
              </Animated.Text>
              <Animated.Text
                style={{
                  color: Colors.white,
                  maxWidth: 160,
                  textAlign: 'center',
                  fontSize: 20,
                  fontWeight: '600',
                  fontFamily: 'Poppins',
                  lineHeight: 32,
                  opacity: swipeRightTextOpacity,
                }}>
                SWIPE LEFT!
              </Animated.Text>
              <Animated.Image
                source={SwipeLeftIcon}
                resizeMode={'contain'}
                style={{
                  height: 140,
                  width: 75,
                  transform: [
                    {
                      rotate: swipeIconRotation.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['0deg', '-30deg'],
                      }),
                    },
                  ],
                }}></Animated.Image>
            </Animated.View>
            <Animated.View
              style={{
                flex: 1,
                width: screenWidth,
                height: screenHeight,
                backgroundColor: Colors.black,
                opacity: 0.6,
                position: 'absolute',
                zIndex: 2,
              }}></Animated.View>
          </>
        )}
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
export default HuntVerificationTutorial;
