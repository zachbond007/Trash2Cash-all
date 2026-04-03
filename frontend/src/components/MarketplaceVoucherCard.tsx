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
import ArrowIcon from '../assets/icons/arrow_right.png';
import LockIcon from '../assets/icons/lock.png';
import LockBlackIcon from '../assets/icons/lock_black.png';
import {MarketplaceVoucher} from '../types';
import TwoFingersIcon from '../assets/icons/two_fingers.png';
import {s3BaseUrl} from '../api/common/Config';
import {useAppSelector} from '../redux/store';
import Icon from './Icon';
import FastImage from 'react-native-fast-image';
import {timingAnimation} from '../utils/AnimationHelper';

export enum CardTypes {
  'BIG',
  'SMALL',
}
interface MarketplaceVoucherCardProps {
  voucher: MarketplaceVoucher;
  onCardClick?: () => void;
  cardType?: CardTypes;
}
const MarketplaceVoucherCard = ({
  voucher,
  onCardClick,
  cardType = CardTypes.SMALL,
}: MarketplaceVoucherCardProps) => {
  const {user} = useAppSelector(state => state.app);

  const wrapperScale = useRef(new Animated.Value(0)).current;

  const {merchant, voucher: _voucher} = voucher;
  const {color, imageKey: logo} = merchant;
  const {title, level} = _voucher;
  const isBigCard = cardType == CardTypes.BIG;
  const locked = user!.level < level;

  const startingAnim = useCallback(() => {
    timingAnimation(wrapperScale, 1, 500);
  }, []);

  useEffect(() => {
    if (!isBigCard) {
      startingAnim();
    } else {
      wrapperScale.setValue(1);
    }
  }, []);
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      disabled={locked}
      onPress={onCardClick}>
      <Animated.View
        style={[styles.wrapper, {transform: [{scale: wrapperScale}]}]}>
        <View style={styles.container}>
          <View style={styles.voucherSemicircleLeft} />
          <View style={styles.voucherSemicircleRight} />
          <View style={styles.voucherSemicircleRightMask} />
          {locked && (
            <>
              <View style={styles.lockOverlay} />
              <View style={styles.lockContainer}>
                <Image
                  source={LockIcon}
                  resizeMode="contain"
                  style={styles.lockIcon}
                />
                <Text fontWeight="700" color={Colors.white}>
                  {`Level ${level} to claim this offer!`}
                </Text>
              </View>
            </>
          )}
          <View style={[styles.leftContainer, {backgroundColor: color}]}>
            <FastImage
              source={{uri: s3BaseUrl + logo}}
              resizeMode="contain"
              style={styles.logo}
            />
            <Image
              source={TwoFingersIcon}
              style={styles.twoFingersIcon}
              resizeMode="contain"
            />
          </View>
          <View
            style={[
              styles.rightContainer,
              locked && {justifyContent: 'space-between', paddingVertical: 16},
            ]}>
            <View style={styles.voucherCutLineWrapper}>
              <View style={styles.voucherCutLine} />
              <View style={styles.voucherCutLineMask} />
            </View>
            <Text
              style={[styles.voucherTitle, !isBigCard && {lineHeight: 18}]}
              fontSize={isBigCard ? 20 : 15}
              fontWeight={isBigCard ? '600' : '500'}>
              {title}
            </Text>
            {!isBigCard && (
              <TouchableOpacity
                style={[
                  styles.claimButtonWrapper,
                  {backgroundColor: color, height: locked ? 24 : 30},
                ]}
                onPress={onCardClick}>
                <Text fontSize={12} fontWeight="600" color={Colors.white}>
                  {locked ? `Level ${level}` : 'Claim'}
                </Text>
                {!locked && (
                  <Image
                    source={ArrowIcon}
                    resizeMode="contain"
                    style={styles.arrowIcon}
                  />
                )}
              </TouchableOpacity>
            )}
            {locked && (
              <Icon
                icon={LockBlackIcon}
                height={21}
                width={21}
                iconStyle={styles.lockBlackIcon}
              />
            )}
          </View>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
};

export default memo(MarketplaceVoucherCard);

const styles = StyleSheet.create({
  wrapper: {
    height: 146,
  },
  container: {
    flex: 1,
    marginTop: 16,
    borderRadius: 10,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  voucherSemicircleLeft: {
    height: 16,
    width: 8,
    backgroundColor: Colors.white,
    position: 'absolute',
    borderTopRightRadius: 99,
    borderBottomRightRadius: 99,
    overflow: 'hidden',
    left: 0,
    top: 57,
    zIndex: 2,
  },
  voucherSemicircleRight: {
    height: 16,
    width: 8,
    backgroundColor: Colors.white,
    position: 'absolute',
    borderTopLeftRadius: 99,
    borderBottomLeftRadius: 99,
    overflow: 'hidden',
    right: 0,
    top: 57,
    zIndex: 2,
    borderWidth: 1,
    borderColor: Colors.mediumLightGray,
  },
  voucherSemicircleRightMask: {
    position: 'absolute',
    right: 0,
    zIndex: 2,
    top: 58,
    backgroundColor: Colors.white,
    height: 13.7,
    width: 1.5,
  },
  lockOverlay: {
    position: 'absolute',
    height: '100%',
    width: '100%',
    backgroundColor: Colors.black,
    opacity: 0.3,
    zIndex: 1,
  },
  lockContainer: {
    flexDirection: 'row',
    position: 'absolute',
    zIndex: 3,
    bottom: 0,
    backgroundColor: Colors.mediumDarkGray,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lockIcon: {
    height: 26,
    width: 26,
    marginRight: 6,
    marginVertical: 6,
  },
  leftContainer: {
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    flex: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  logo: {
    height: '60%',
    width: '60%',
    zIndex: 2,
  },
  twoFingersIcon: {
    height: 130,
    width: 87,
    position: 'absolute',
    opacity: 0.1,
    left: 0,
  },
  rightContainer: {
    flex: 1,
    justifyContent: 'space-evenly',
    backgroundColor: Colors.lightGray,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
    borderWidth: 1,
    borderColor: Colors.mediumLightGray,
    alignItems: 'center',
  },
  voucherCutLineWrapper: {
    height: 130,
    position: 'absolute',
    left: -1,
    top: 0,
  },
  voucherCutLine: {
    height: 128,
    borderWidth: 1,
    borderColor: Colors.black,
    borderStyle: 'dashed',
  },
  voucherCutLineMask: {
    position: 'absolute',
    right: -0.5,
    width: 1.5,
    height: 128,
    backgroundColor: Colors.lightGray,
  },
  voucherTitle: {
    textAlign: 'center',
    textAlignVertical: 'center',
    paddingHorizontal: 4,
  },
  claimButtonWrapper: {
    // paddingVertical: 4,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 99,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 16,
  },
  arrowIcon: {
    height: 16,
    width: 16,
    marginLeft: 4,
  },
  lockBlackIcon: {
    marginBottom: 16,
  },
});
