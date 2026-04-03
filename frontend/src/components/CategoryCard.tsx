import {
  Animated,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {memo, useCallback, useEffect, useRef} from 'react';
import Text from './Text';
import Colors from '../assets/Colors';
import {timingAnimation} from '../utils/AnimationHelper';
import {MarketplaceCategory} from '../types/types';
import {screenWidth} from '../utils/UIHelper';

interface CategoryCardProps {
  onCardClick?: () => void;
  onlineCategory: MarketplaceCategory;
}
const CategoryCard = ({onCardClick, onlineCategory}: CategoryCardProps) => {
  const wrapperScale = useRef(new Animated.Value(0)).current;
  const {icon, title, color} = onlineCategory;

  const startingAnim = useCallback(() => {
    timingAnimation(wrapperScale, 1, 500);
  }, []);

  useEffect(() => {
    startingAnim();
  }, []);

  return (
    <TouchableOpacity onPress={onCardClick}>
      <Animated.View
        style={[
          styles.wrapper,
          {transform: [{scale: wrapperScale}]},
          {backgroundColor: color},
        ]}>
        <Text fontSize={22} fontWeight="600" style={styles.title}>
          {title}
        </Text>
        <Image source={icon} resizeMode="contain" style={styles.icon} />
        <View style={styles.container}>
          <View style={styles.voucherSemicircleLeft} />
          <View style={styles.voucherSemicircleRight} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default memo(CategoryCard);

const styles = StyleSheet.create({
  wrapper: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginHorizontal: 8,
    paddingTop: 18,
    paddingBottom: 16,
    width: screenWidth / 2 - 24,
    height: (screenWidth / 2 - 24) * 1.18,
    borderRadius: 10,
  },
  title: {
    textAlign: 'center',
  },
  icon: {
    flex: 1,
    marginTop: 16,
    width: '90%',
  },
  container: {
    position: 'absolute',
    width: '101%',
    height: '100%',
  },
  voucherSemicircleLeft: {
    height: 16,
    width: 8,
    position: 'absolute',
    left: 0,
    top: 38,
    zIndex: 2,
    borderTopRightRadius: 99,
    borderBottomRightRadius: 99,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
  voucherSemicircleRight: {
    height: 16,
    width: 8,
    position: 'absolute',
    right: 0,
    top: 38,
    zIndex: 2,
    borderTopLeftRadius: 99,
    borderBottomLeftRadius: 99,
    overflow: 'hidden',
    backgroundColor: Colors.white,
  },
});
