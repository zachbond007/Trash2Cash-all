import {StyleSheet} from 'react-native';
import React from 'react';
import LottieView from 'lottie-react-native';
import LoaderAnimation from '../assets/animations/loader.json';

const Loader = () => {
  return (
    <LottieView source={LoaderAnimation} autoPlay loop style={styles.loader} />
  );
};

export default Loader;

const styles = StyleSheet.create({
  loader: {
    height: 100,
    width: 100,
  },
});
