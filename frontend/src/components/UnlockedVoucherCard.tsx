import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from './Text';
import Colors from '../assets/Colors';
import ArrowIcon from '../assets/icons/arrow_right.png';
import {UnlockedVoucher} from '../types/types';
import {s3BaseUrl} from '../api/common/Config';
import FastImage from 'react-native-fast-image';

interface UnlockedVoucherCardProps {
  unlockedVoucher: UnlockedVoucher;
  onCardClick: () => void;
  dontShowClaim?: boolean;
}
const UnlockedVoucherCard = ({
  onCardClick,
  unlockedVoucher,
  dontShowClaim = false,
}: UnlockedVoucherCardProps) => {
  const {merchant, voucher} = unlockedVoucher;
  return (
    <View
      style={[
        styles.discountVoucherWrapper,
        {backgroundColor: merchant.color},
      ]}>
      <View style={styles.voucherSemicircleLeft} />
      <View style={styles.voucherSemicircleRight} />
      <FastImage
        style={styles.voucherLogo}
        resizeMode="contain"
        source={{uri: s3BaseUrl + merchant.imageKey}}
      />
      <View style={styles.voucherSeparator} />
      <View style={styles.voucherFooterWrapper}>
        <View style={styles.voucherCutLineWrapper}>
          <View style={styles.voucherCutLine} />
          <View style={styles.voucherCutLineMask} />
        </View>

        <Text
          style={[styles.voucherTitle, {marginBottom: dontShowClaim ? 12 : 0}]}
          fontSize={15}
          fontWeight="500">
          {voucher.title}
        </Text>
        {!dontShowClaim && (
          <TouchableOpacity
            style={[
              styles.claimButtonWrapper,
              {backgroundColor: merchant.color},
            ]}
            onPress={onCardClick}>
            <Text
              fontSize={12}
              color={Colors.white}
              style={styles.claimButtonTitle}>
              Claim
            </Text>
            <Image
              source={ArrowIcon}
              resizeMode="contain"
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default UnlockedVoucherCard;

const styles = StyleSheet.create({
  discountVoucherWrapper: {
    alignItems: 'center',
    borderRadius: 10,
    marginHorizontal: 4,
    width: 170,
    flexWrap: 'nowrap',
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
    top: 38,
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
    top: 38,
  },
  voucherLogo: {
    height: 60,
    width: '70%',
    marginVertical: 8,
  },
  voucherSeparator: {
    height: 8,
    width: '100%',
    backgroundColor: Colors.orange,
  },
  voucherCutLineWrapper: {
    width: '100%',
    position: 'absolute',
    top: -1,
  },
  voucherCutLine: {
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.black,
    borderStyle: 'dashed',
  },
  voucherCutLineMask: {
    position: 'absolute',
    bottom: -0.5,
    height: 1.5,
    width: '100%',
    backgroundColor: Colors.lightGray,
  },
  voucherFooterWrapper: {
    borderWidth: 1,
    width: '100%',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    borderColor: Colors.mediumLightGray,
    backgroundColor: Colors.lightGray,
    alignItems: 'center',
    flexGrow: 1,
  },
  voucherTitle: {
    marginTop: 18,
    flexGrow: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginHorizontal: 16,
  },
  claimButtonWrapper: {
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 24,
    paddingRight: 14,
    borderRadius: 99,
    marginVertical: 16,
  },
  claimButtonTitle: {
    marginRight: 4,
  },
  arrowIcon: {
    height: 16,
    width: 16,
  },
});
