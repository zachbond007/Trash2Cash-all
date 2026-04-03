// import {Animated, StyleSheet, View} from 'react-native';
// import React, {FC, useEffect, useRef, useState} from 'react';
// import {screenHeight, screenWidth} from '../utils/UIHelper';
// import {timingAnimation} from '../utils/AnimationHelper';
// import {useAppDispatch, useAppSelector} from '../redux/store';
// import {useSafeAreaInsets} from 'react-native-safe-area-context';
// import FastImage from 'react-native-fast-image';
// import {getHuntsForVerification} from '../api/hunt';
// import {VerificationHunt} from '../api/types';
// import {
//   setCurrentHunt,
//   setIsHuntImageAnimatiomFinished,
//   setTriggerHandleNo,
//   setTriggerHandleYes,
//   setTriggerSwipeBack,
//   setTriggerSwipeLeft,
//   setTriggerSwipeRight,
// } from '../redux/slices/appSlice';
// import {s3BaseUrl} from '../api/common/Config';
// import {tutorialHunts} from '../assets/DATA';
// import Icon from './Icon';
// import Text from './Text';
// import FacePalmIcon from '../assets/icons/face_palm.png';
// import Loader from './Loader';
// import Swiper from 'react-native-deck-swiper';
// import {HuntVerificationType} from '../types';
// interface HuntImagesProps {
//   tutorialMode?: HuntVerificationType;
// }
// const HuntImages: FC<HuntImagesProps> = ({tutorialMode}) => {
//   const insets = useSafeAreaInsets();
//   const dispatch = useAppDispatch();
//   const {
//     isApprove,
//     isRewardAnimationFinished,
//     isTutorial,
//     isQuestionMode,
//     triggerSwipeRight,
//     triggerSwipeLeft,
//     triggerSwipeBack,
//   } = useAppSelector(state => state.app);
//   const [verificationHunts, setVerificationHunts] = useState<
//     VerificationHunt[]
//   >([]);
//   const [backImage, setBackImage] = useState<any>();
//   const [frontImage, setFrontImage] = useState<any>();
//   const [isLoading, setIsLoading] = useState(false);
//   const [showSwiper, setShowSwiper] = useState(true);
//   const [isSwipingRight, setIsSwipingRight] = useState(true);
//   const [currentCardIndex, setCurrentCardIndex] = useState(0);

//   const frontHuntImagePosition = useRef(new Animated.Value(0)).current;
//   const frontHuntImageRotation = useRef(new Animated.Value(0)).current;
//   const frontHuntImageOpacity = useRef(new Animated.Value(0)).current;
//   const noHuntWrapperOpacity = useRef(new Animated.Value(0)).current;
//   const loaderOpacity = useRef(new Animated.Value(0)).current;
//   const loaderTopPosition = useRef(
//     new Animated.Value(-screenHeight / 2),
//   ).current;

//   const swiperRef = useRef<any>(null);

//   useEffect(() => {
//     const prepareData = async () => {
//       if (isTutorial) {
//         setVerificationHunts(tutorialHunts);
//         setFrontImage(tutorialHunts[0]?.imageKey);
//       } else {
//         setIsLoading(true);
//         timingAnimation(loaderOpacity, 1, 500);
//         timingAnimation(loaderTopPosition, 140, 500);
//         const huntImages = await getHuntsForVerification({
//           quantity: 5,
//         });
//         setVerificationHunts(huntImages);
//         setFrontImage({uri: s3BaseUrl + huntImages[0]?.imageKey});
//       }
//     };
//     prepareData();
//   }, []);

//   useEffect(() => {
//     if (!isTutorial && verificationHunts.length > 0) {
//       FastImage.preload([
//         {
//           uri: `${s3BaseUrl + verificationHunts[0]?.imageKey}`,
//           priority: FastImage.priority.high,
//         },
//         {uri: `${s3BaseUrl + verificationHunts[1]?.imageKey}`},
//         {uri: `${s3BaseUrl + verificationHunts[2]?.imageKey}`},
//       ]);
//     }
//   }, [verificationHunts]);

//   useEffect(() => {
//     if (triggerSwipeRight) {
//       dispatch(setTriggerSwipeRight(false));
//       swiperRef.current!.swipeRight();
//     } else if (triggerSwipeLeft) {
//       dispatch(setTriggerSwipeLeft(false));
//       swiperRef.current!.swipeLeft();
//     } else if (triggerSwipeBack) {
//       dispatch(setTriggerSwipeBack(false));
//       swiperRef.current!.swipeBack();
//     }
//   }, [triggerSwipeRight, triggerSwipeLeft, triggerSwipeBack]);

//   useEffect(() => {
//     const prepareData = async () => {
//       if (isRewardAnimationFinished) {
//         const imagePosition = 1.2 * (isApprove ? screenWidth : -screenWidth);
//         let tempHuntList: VerificationHunt[] = verificationHunts.slice(1);
//         if (tempHuntList.length <= 2 && !isTutorial) {
//           const huntIds = [tempHuntList[0]?.huntId, tempHuntList[1]?.huntId];
//           const huntImages = await getHuntsForVerification({
//             quantity: 3,
//             huntIds,
//           });
//           if (huntImages?.length > 0) {
//             tempHuntList = tempHuntList.concat(huntImages);
//           }
//         }
//         setVerificationHunts(tempHuntList);
//         dispatch(setCurrentHunt(tempHuntList[0]));
//         timingAnimation(frontHuntImageRotation, 1, 1000);
//         timingAnimation(frontHuntImageOpacity, 0, 500, 0, () => {
//           dispatch(setIsHuntImageAnimatiomFinished(true));
//         });
//         timingAnimation(frontHuntImagePosition, imagePosition, 1000, 0, () => {
//           frontHuntImagePosition.setValue(0);
//           frontHuntImageRotation.setValue(0);
//           frontHuntImageOpacity.setValue(1);
//           if (isTutorial) {
//             setFrontImage(tempHuntList[0]?.imageKey);
//             setBackImage(tempHuntList[1]?.imageKey);
//           } else {
//             setFrontImage({uri: s3BaseUrl + tempHuntList[0]?.imageKey});
//             setBackImage({uri: s3BaseUrl + tempHuntList[1]?.imageKey});
//           }
//         });
//       }
//     };
//     prepareData();
//   }, [isRewardAnimationFinished]);

//   const onLoadedImage = () => {
//     if (isTutorial) {
//       timingAnimation(frontHuntImageOpacity, 1, 500, 0, () => {
//         setBackImage(tutorialHunts[1]?.imageKey);
//         dispatch(setCurrentHunt(verificationHunts[0]));
//       });
//     } else {
//       timingAnimation(loaderOpacity, 0, 500, 0, () => {
//         setIsLoading(false);
//         timingAnimation(frontHuntImageOpacity, 1, 500, 0, () => {
//           dispatch(setCurrentHunt(verificationHunts[0]));
//           setBackImage({uri: s3BaseUrl + verificationHunts[1]?.imageKey});
//         });
//       });
//     }
//   };

//   const noHuntExists = verificationHunts.length === 0;
//   const onLoadStart = () => {
//     if (noHuntExists) {
//       timingAnimation(noHuntWrapperOpacity, 1, 500);
//     }
//   };

//   const swiperData = isQuestionMode
//     ? [
//         ...verificationHunts.slice(0, currentCardIndex),
//         ...verificationHunts.slice(currentCardIndex - 1),
//       ]
//     : isSwipingRight
//     ? [
//         ...verificationHunts.slice(0, currentCardIndex + 1),
//         ...verificationHunts.slice(currentCardIndex),
//       ]
//     : verificationHunts;

//   console.log('==isSwipingRight==', isSwipingRight, '====');
//   console.log('==swiperData==', swiperData, '====');

//   return (
//     <View style={[styles.wrapper, {marginBottom: -insets.bottom}]}>
//       {isLoading && (
//         <Animated.View
//           style={[
//             styles.loaderWrapper,
//             {opacity: loaderOpacity, top: loaderTopPosition},
//           ]}>
//           <Loader />
//         </Animated.View>
//       )}

//       <Swiper
//         ref={swiperRef}
//         cards={swiperData}
//         renderCard={card => {
//           if (card?.imageKey) {
//             return (
//               <View style={styles.card}>
//                 {!isTutorial ? (
//                   <FastImage
//                     onLoadStart={onLoadStart}
//                     onLoadEnd={onLoadedImage}
//                     source={{uri: card.imageKey}}
//                     resizeMode="cover"
//                     style={styles.huntImage}
//                   />
//                 ) : (
//                   <FastImage
//                     onLoadStart={onLoadStart}
//                     onLoadEnd={onLoadedImage}
//                     source={card.imageKey as unknown as number}
//                     resizeMode="cover"
//                     style={styles.huntImage}
//                   />
//                 )}
//               </View>
//             );
//           }
//           return null;
//         }}
//         onSwiped={cardIndex => setCurrentCardIndex(cardIndex + 1)}
//         onSwipedLeft={cardIndex => dispatch(setTriggerHandleNo(true))}
//         onSwipedRight={cardIndex => {
//           dispatch(setTriggerHandleYes(true));
//         }}
//         disableTopSwipe
//         disableBottomSwipe
//         disableLeftSwipe={
//           isQuestionMode || (isTutorial && tutorialMode === 'APPROVE')
//         }
//         disableRightSwipe={
//           isQuestionMode || (isTutorial && tutorialMode === 'DISAPPROVE')
//         }
//         // containerStyle={{backgroundColor: 'white'}}
//         cardHorizontalMargin={0}
//         cardVerticalMargin={0}
//         showSecondCard
//         onSwiping={(x, y) => {
//           if (x > 0 && !isSwipingRight) {
//             setIsSwipingRight(true);
//           }
//           if (x < 0 && isSwipingRight) {
//             setIsSwipingRight(false);
//           }
//         }}
//         stackSize={3}
//         stackScale={0}
//       />

//       {!isTutorial && noHuntExists && (
//         <Animated.View
//           style={[styles.noHuntWrapper, {opacity: noHuntWrapperOpacity}]}>
//           <Icon icon={FacePalmIcon} height={218} width={218} />
//           <Text fontSize={20} fontWeight="600" style={styles.noHuntTitle}>
//             {'No new photos to verify '}
//           </Text>
//           <Text style={styles.noHuntDescription}>
//             {'Come back later to see new pictures that have been submitted! '}
//           </Text>
//         </Animated.View>
//       )}
//       {/* {backImage && !isLoading && (
//         <FastImage
//           source={backImage}
//           resizeMode="cover"
//           style={styles.huntImage}
//         />
//       )}
//       */}
//       {/* {isQuestionMode && frontImage && (
//         <Animated.View
//           style={[
//             styles.huntImage,
//             {
//               left: frontHuntImagePosition,
//               transform: [{rotate: spin}],
//               opacity: frontHuntImageOpacity,
//             },
//           ]}>
//           <FastImage
//             onLoadStart={onLoadStart}
//             onLoadEnd={onLoadedImage}
//             source={frontImage}
//             resizeMode="cover"
//             style={styles.huntImage}
//           />
//         </Animated.View>
//       )} */}
//     </View>
//   );
// };

// export default HuntImages;

// const styles = StyleSheet.create({
//   card: {
//     flex: 1,
//     borderColor: '#E8E8E8',
//     justifyContent: 'center',
//     width: screenWidth,
//     height: screenHeight,
//   },
//   wrapper: {
//     flex: 1,
//     overflow: 'hidden',
//   },
//   loaderWrapper: {
//     height: screenHeight,
//     width: screenWidth,
//     alignItems: 'center',
//     zIndex: 199,
//     position: 'absolute',
//   },
//   loader: {
//     height: 100,
//     width: 100,
//   },
//   noHuntWrapper: {
//     width: screenWidth,
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center',
//     zIndex: 99,
//     paddingBottom: 50,
//   },
//   noHuntTitle: {
//     paddingHorizontal: 52,
//     marginTop: 36,
//   },
//   noHuntDescription: {
//     paddingHorizontal: 70,
//     textAlign: 'center',
//     marginTop: 24,
//   },
//   huntImage: {
//     height: screenHeight,
//     width: screenWidth,
//     position: 'absolute',
//   },
// });
