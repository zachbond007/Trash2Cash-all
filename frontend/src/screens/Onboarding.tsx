import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, View, Image, Animated} from 'react-native';
import Colors from '../assets/Colors';
import Text from '../components/Text';
import Button from '../components/Button';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {AuthStackParams} from '../types';
import {timingAnimation} from '../utils/AnimationHelper';
import Wrapper from '../components/Wrapper';
import {onboardPages} from '../assets/DATA';

const Onboarding = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<AuthStackParams>>();
  const [currentPage, setCurrentPage] = useState(onboardPages[0]);
  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    timingAnimation(containerOpacity, 1, 500);
  }, []);

  const onNextClick = () => {
    timingAnimation(containerOpacity, 0, 500, 0, () => {
      setCurrentPage(onboardPages[1]);
      timingAnimation(containerOpacity, 1, 500);
    });
  };

  const onFinishClick = () => {
    navigation.navigate('HuntVerificationTutorial');
  };

  return (
    <Wrapper>
      <Animated.View style={[styles.container, {opacity: containerOpacity}]}>
        <Image
          style={styles.image}
          source={currentPage.image}
          resizeMode="contain"
        />
        <View style={styles.infoWrapper}>
          <Text fontWeight="700" fontSize={20} style={styles.title}>
            {currentPage.title}
          </Text>
          <Text style={styles.subtitle}>{currentPage.description}</Text>
        </View>
        <Button
          title={currentPage.id === 1 ? 'Next' : 'Get Started!'}
          onPressButton={currentPage.id === 1 ? onNextClick : onFinishClick}
          containerStyle={styles.button}
        />
      </Animated.View>
    </Wrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: 32,
    paddingVertical: 60,
  },
  image: {
    flex: 1,
    width: '100%',
  },
  infoWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 24,
    paddingHorizontal: 52,
  },
  button: {
    marginTop: 16,
  },
});

export default Onboarding;
