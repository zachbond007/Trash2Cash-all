// import {
//   Animated,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   View,
// } from 'react-native';
// import React, {useEffect, useRef, useState} from 'react';
// import {screenHeight, screenWidth} from '../utils/UIHelper';
// import {timingAnimation} from '../utils/AnimationHelper';
// import {useAppDispatch, useAppSelector} from '../redux/store';
// import {
//   increaseLevelBarPercent,
//   setIsApprove,
//   setIsTabBarVisible,
//   setIsRewardAnimationFinished,
//   setIsRewardAnimationVisible,
//   setUnlockedVouchers,
//   setCurrentHuntDetails,
//   setIsQuestionMode,
//   setTriggerSwipeRight,
//   setTriggerSwipeLeft,
//   setTriggerSwipeBack,
//   setTriggerHandleYes,
//   setTriggerHandleNo,
// } from '../redux/slices/appSlice';
// import {HuntVerificationType} from '../types';
// import Text from './Text';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import AnswerBox from './AnswerBox';
// import {calculateLevelBarPercentage} from '../utils/ProgressBarHelper';
// import VerificationActions from './VerificationActions';
// import ArrowIcon from '../assets/icons/arrow_left.png';
// import SwipeIcon from '../assets/icons/swipe.png';
// import TabBarButton from './Navigation/TabBarButton';
// import Colors from '../assets/Colors';
// import {huntSizeAnswers, tutorialHuntDetails} from '../assets/DATA';
// import {getVouchersByLevel} from '../api/voucher';
// import {submitHuntVerification} from '../api/huntVerification';
// import {ItemSize} from '../api/types';
// import Loader from './Loader';
// import appsFlyer from 'react-native-appsflyer';

// interface VerificationFooterProps {
//   tutorialMode?: HuntVerificationType;
// }
// const VerificationFooter = ({tutorialMode}: VerificationFooterProps) => {
//   const dispatch = useAppDispatch();
//   const insets = useSafeAreaInsets();

//   const {
//     isRewardAnimationFinished,
//     user,
//     levelBarPercent,
//     rewardXp,
//     currentHunt,
//     isRewardAnimationVisible,
//     isHuntImageAnimatiomFinished,
//     triggerHandleYes,
//     triggerHandleNo,
//     isQuestionMode,
//     triggerSwipeBack,
//   } = useAppSelector(state => state.app);
//   const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);

//   const huntSizeSelectionWrapperOpacity = useRef(new Animated.Value(0)).current;
//   const footerContainerOpacity = useRef(new Animated.Value(0)).current;
//   const loaderOpacity = useRef(new Animated.Value(0)).current;
//   const swipingTutorialOverlayOpacity = useRef(new Animated.Value(1)).current;
//   const swipingTutorialContainerOpacity = useRef(new Animated.Value(0)).current;
//   const swipeDescriptionTextOpacity = useRef(new Animated.Value(1)).current;
//   const swipeRightTextOpacity = useRef(new Animated.Value(0.2)).current;
//   const swipeIconRotation = useRef(new Animated.Value(0)).current;
//   const [removeOverlay, setRemoveOverlay] = useState(false);
//   useEffect(() => {
//     if (triggerHandleYes) {
//       dispatch(setTriggerHandleYes(false));
//       handleYes(false);
//     } else if (triggerHandleNo) {
//       dispatch(setTriggerHandleNo(false));
//       handleNo(false);
//     }
//   }, [triggerHandleNo, triggerHandleYes]);

//   useEffect(() => {
//     timingAnimation(footerContainerOpacity, 1, 500, 0, () => {
//       timingAnimation(swipingTutorialOverlayOpacity, 0.6, 500);
//       timingAnimation(swipingTutorialContainerOpacity, 1, 500, 0, () => {
//         timingAnimation(swipeDescriptionTextOpacity, 0.2, 750, 350, () => {});
//         timingAnimation(swipeRightTextOpacity, 1, 750, 350, () => {});
//         timingAnimation(swipeIconRotation, 1, 750, 350, () => {
//           timingAnimation(swipingTutorialOverlayOpacity, 0, 500);
//           timingAnimation(swipingTutorialContainerOpacity, 0, 500, 0, () => {
//             setRemoveOverlay(true);
//           });
//         });
//       });
//     });
//   }, []);
//   useEffect(() => {
//     if (isRewardAnimationFinished) {
//       timingAnimation(huntSizeSelectionWrapperOpacity, 0, 500, 0, () => {
//         timingAnimation(footerContainerOpacity, 1, 1000);
//         setSelectedAnswer(null);
//         dispatch(setIsTabBarVisible(true));
//         dispatch(setIsQuestionMode(false));
//         dispatch(setIsApprove(false));
//         dispatch(setIsRewardAnimationFinished(false));
//       });
//     }
//   }, [isRewardAnimationFinished]);

//   const startXpBarAnim = async (answer: 'YES' | 'NO', itemSize?: ItemSize) => {
//     if (!tutorialMode) {
//       setIsLoading(true);
//       timingAnimation(loaderOpacity, 1, 500);
//       const result = await submitHuntVerification({
//         answer,
//         huntId: currentHunt!.huntId,
//         itemSize,
//       });
//       dispatch(setCurrentHuntDetails(result));
//     } else if (tutorialMode === 'DISAPPROVE') {
//       dispatch(setCurrentHuntDetails(tutorialHuntDetails[1]));
//       const result = await getVouchersByLevel(2, 0, 0);
//       dispatch(setUnlockedVouchers(result?.vouchers));
//     } else {
//       dispatch(setCurrentHuntDetails(tutorialHuntDetails[0]));
//     }
//     const calculatedXpPercent = calculateLevelBarPercentage(
//       rewardXp,
//       user!.targetXp,
//     );
//     timingAnimation(loaderOpacity, 0, 500, 0, () => {
//       setIsLoading(false);
//     });
//     dispatch(increaseLevelBarPercent(calculatedXpPercent));
//     dispatch(setIsRewardAnimationVisible(true));
//   };
//   const handleNo = (triggerSwipe = true) => {
//     if (triggerSwipe) {
//       dispatch(setTriggerSwipeLeft(true));
//     }

//     dispatch(setIsApprove(false));
//     startXpBarAnim('NO');
//     appsFlyer.logEvent(
//       'verification_no_clicked',
//       {user},
//       res => {
//         console.log(res);
//       },
//       err => {
//         console.error(err);
//       },
//     );
//   };
//   const handleYes = (triggerSwipe = true) => {
//     if (triggerSwipe) {
//       dispatch(setTriggerSwipeRight(true));
//     }
//     dispatch(setIsTabBarVisible(false));
//     dispatch(setIsQuestionMode(true));
//     timingAnimation(footerContainerOpacity, 0, 500, 0, () => {
//       timingAnimation(huntSizeSelectionWrapperOpacity, 1, 500);
//     });
//   };
//   const handleGoBack = (triggerSwipe = true) => {
//     if (triggerSwipe) {
//       dispatch(setTriggerSwipeBack(true));
//     }
//     timingAnimation(huntSizeSelectionWrapperOpacity, 0, 500, 0, () => {
//       dispatch(setIsQuestionMode(false));
//       dispatch(setIsTabBarVisible(true));
//       timingAnimation(footerContainerOpacity, 1, 500);
//     });
//   };
//   const onAnswerClick = (answer: string) => {
//     const selectedItemSize =
//       answer === huntSizeAnswers[0]
//         ? '1_10_ITEMS'
//         : answer === huntSizeAnswers[1]
//         ? 'SMALL_BAG'
//         : answer === huntSizeAnswers[2]
//         ? 'LARGE_BAG'
//         : 'MORE_THAN_LARGE_BAG';
//     dispatch(setIsApprove(true));
//     setSelectedAnswer(answer);
//     startXpBarAnim('YES', selectedItemSize);
//   };
//   const isButtonDisabled =
//     isLoading || !isHuntImageAnimatiomFinished || isRewardAnimationVisible;
//   return (

//   );
// };

// export default VerificationFooter;

// const styles = StyleSheet.create({
//   loaderWrapper: {
//     position: 'absolute',
//     top: 140,
//     alignItems: 'center',
//     justifyContent: 'center',
//     width: screenWidth,
//   },
//   huntSizeSelectionWrapper: {
//     position: 'absolute',
//     alignItems: 'center',
//     right: 0,
//     left: 0,
//     zIndex: 1,
//   },
//   backButtonContainer: {
//     zIndex: 2,
//     top: 0,
//     alignSelf: 'baseline',
//     marginLeft: 16,
//     alignItems: 'center',
//   },
//   backArrow: {
//     height: 30,
//     width: 30,
//     marginTop: -4,
//   },
//   answerListContainer: {
//     flexDirection: 'row',
//     marginHorizontal: 16,
//   },
//   footerContainer: {
//     width: screenWidth - 32,
//     alignSelf: 'center',
//     position: 'absolute',
//     zIndex: 1,
//   },
//   tabBarContainer: {
//     height: 65,
//     marginVertical: 16,
//     backgroundColor: Colors.white,
//     borderRadius: 99,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//   },

// });
