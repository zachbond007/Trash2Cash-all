import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Wrapper from '../components/Wrapper';
import {RNCamera, TakePictureOptions} from 'react-native-camera';
import {screenHeight, screenWidth} from '../utils/UIHelper';
import Colors from '../assets/Colors';
import FocusFrameIcon from '../assets/icons/focus_frame.png';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {timingAnimation} from '../utils/AnimationHelper';
import GradientOverlay from '../components/GradientOverlay';
import {FlashModes} from '../types';
import {flashActions} from '../assets/DATA';
import {createHunt, uploadHuntImage} from '../api/hunt';
import Loader from '../components/Loader';
import GradientWrapper from '../components/GradientWrapper';
import Text from '../components/Text';
import {compressImage} from '../utils/ImageHelper';
import {useCamera} from 'react-native-camera-hooks';
import {checkCameraPermissions} from '../utils/LocationHelper';

const Home = () => {
  const insets = useSafeAreaInsets();
  const [flashMode, setFlashMode] = useState<FlashModes>('auto');
  const [takenPicture, setTakenPicture] = useState('');
  const [tempPicture, setTempPicture] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const imageHeight = useRef(new Animated.Value(screenHeight - 160)).current;
  const imageWidth = useRef(new Animated.Value(screenWidth)).current;
  const imageScale = useRef(new Animated.Value(1)).current;
  const imageBottomPosition = useRef(new Animated.Value(0)).current;
  const imageOpacity = useRef(new Animated.Value(1)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;
  const cameraRef = useRef<RNCamera>(null);
  const [cameraPermission, setCameraPermission] = useState(true);
  useEffect(() => {
    const checkCamera = async () => {
      const isCameraGranted = await checkCameraPermissions();
      setCameraPermission(isCameraGranted);
    };
    checkCamera();
  }, []);
  const takePicture = async () => {
    if (cameraRef.current) {
      setIsAnimating(true);
      timingAnimation(loaderOpacity, 1, 500);
      const options: TakePictureOptions = {
        quality: 0.6,
        base64: true,
        pauseAfterCapture: true,
      };
      const data = await cameraRef.current.takePictureAsync(options);
      setTempPicture(data.uri);
      cameraRef.current.resumePreview();
      const result = await compressImage(data.uri);
      const imageKey = await uploadHuntImage(result);      
      //! IF USING A SIMULATOR, USE THIS TO CREATE RANDOM HUNT IMAGE
      // const imageKey = await uploadImage('https://picsum.photos/1000/2000?random=1','images/hunts/',);
      timingAnimation(loaderOpacity, 0, 500);
      createHunt({imageKey});
      setTakenPicture(result);
      timingAnimation(imageHeight, screenHeight / 2.5, 500, 200);
      timingAnimation(imageWidth, screenWidth / 2.5, 500, 200, () => {
        timingAnimation(imageScale, 0.3, 500, 0, () => {
          timingAnimation(imageBottomPosition, -120, 500);
          timingAnimation(imageOpacity, 0, 500, 100, () => {
            setTakenPicture('');
            imageHeight.setValue(screenHeight - 160);
            imageWidth.setValue(screenWidth);
            imageScale.setValue(1);
            imageBottomPosition.setValue(0);
            imageOpacity.setValue(1);
            setIsAnimating(false);
            setTempPicture('');
          });
        });
      });
    }
  };
  const renderFlashModes = () => (
    <View style={styles.flashActionsWrapper}>
      {flashActions.map((item, index) => {
        const flashIcon =
          flashMode === item.mode ? item.activeIcon : item.inactiveIcon;
        return (
          <TouchableOpacity
            disabled={isAnimating}
            key={index}
            onPressIn={() => setFlashMode(item.mode)}>
            <Image source={flashIcon} style={styles.flashIcon} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
  return (
    <Wrapper pointerEvents="box-none">
      {isAnimating && (
        <Animated.View style={[styles.loaderWrapper, {opacity: loaderOpacity}]}>
          <Loader />
        </Animated.View>
      )}
      <RNCamera
        captureAudio={false}
        flashMode={flashMode}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        ref={cameraRef}
      />
      {tempPicture !== '' && (
        <Image
          source={{uri: tempPicture}}
          resizeMode="cover"
          style={[
            styles.takenPicture,
            {height: screenHeight, width: screenWidth},
          ]}
        />
      )}
      {takenPicture && (
        <Animated.Image
          source={{uri: takenPicture}}
          resizeMode="cover"
          style={[
            styles.takenPicture,
            {
              height: imageHeight,
              width: imageWidth,
              transform: [{scale: imageScale}],
              bottom: imageBottomPosition,
              opacity: imageOpacity,
            },
          ]}
        />
      )}
      <GradientOverlay />
      <View
        style={[
          styles.cameraActionsWrapper,
          {marginBottom: 120 - insets.bottom},
          isAnimating && {opacity: 0.4},
        ]}>
        {cameraPermission && renderFlashModes()}
        <Image
          source={FocusFrameIcon}
          resizeMode="contain"
          style={styles.focusFrame}
        />
        <View style={styles.cameraActionsFooterWrapper}>
          <View style={styles.captureInfoContainer}>
            <GradientWrapper
              useGreenAndBlueColors
              style={styles.captureInfoBackground}
            />
            <Text
              color={Colors.white}
              fontSize={11}
              fontWeight="600"
              style={styles.captureInfoTitle}>
              {'Clearly show that you’re throwing away trash'}
            </Text>
          </View>
          {cameraPermission && (
            <TouchableOpacity
              disabled={isAnimating}
              onPress={takePicture}
              activeOpacity={0.5}
              style={styles.captureButtonWrapper}>
              <View style={styles.captureButtonBorder} />
            </TouchableOpacity>
          )}
        </View>
      </View>
    </Wrapper>
  );
};

export default Home;

const styles = StyleSheet.create({
  loaderWrapper: {
    position: 'absolute',
    top: 140,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    zIndex: 99,
  },
  camera: {
    height: screenHeight,
    position: 'absolute',
    width: screenWidth,
    zIndex: 0,
  },
  takenPicture: {
    position: 'absolute',
    left: 0,
    zIndex: 1,
  },
  cameraActionsWrapper: {
    flex: 1,
    marginTop: 94,
    zIndex: 3,
    justifyContent: 'space-between',
  },
  focusFrame: {
    height: 180,
    width: 180,
    alignSelf: 'center',
  },
  flashActionsWrapper: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  flashIcon: {
    height: 24,
    width: 24,
  },
  captureInfoContainer: {
    position: 'absolute',
    top: -60,
    width: screenWidth / 2.4,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
  },
  captureInfoBackground: {
    position: 'absolute',
    height: '140%',
    width: '110%',
    borderRadius: 99,
    opacity: 0.7,
  },
  captureInfoTitle: {
    textAlign: 'center',
  },
  cameraActionsFooterWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  captureButtonWrapper: {
    height: 60,
    width: 60,
    backgroundColor: Colors.white,
    borderRadius: 99,
    zIndex: 99,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
  },
  captureButtonBorder: {
    backgroundColor: Colors.white,
    height: 72,
    width: 72,
    borderRadius: 99,
    opacity: 0.3,
    zIndex: 2,
  },
});
