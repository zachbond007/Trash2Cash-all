import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect} from 'react';
import {MarketplaceVoucher} from '../types';
import Text from './Text';
import Modal from './Modal';
import CloseIcon from '../assets/icons/close.png';
import TwoFingersIcon from '../assets/icons/two_fingers.png';
import {screenHeight, screenWidth} from '../utils/UIHelper';
import Icon from './Icon';
import FastImage from 'react-native-fast-image';
import {s3BaseUrl} from '../api/common/Config';
import NearestLocationsListItem from './NearestLocationsListItem';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useAppDispatch, useAppSelector} from '../redux/store';
import Geolocation from '@react-native-community/geolocation';
import {updateNearestLocations} from '../redux/slices/appSlice';

interface NearestLocationsModalProps {
  isVisible: boolean;
  onCloseModal: () => void;
  selectedVoucher: MarketplaceVoucher;
}

const NearestLocationsModal = ({
  isVisible = false,
  onCloseModal,
  selectedVoucher,
}: NearestLocationsModalProps) => {
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const {nearestLocations} = useAppSelector(state => state.app);

  useEffect(() => {
    if (isVisible) {
      Geolocation.getCurrentPosition(res => {
        dispatch(
          updateNearestLocations({
            lat: res.coords.latitude,
            lng: res.coords.longitude,
          }),
        );
      });
    }
  }, [isVisible]);

  return (
    <Modal
      backdropOpacity={0}
      containerStyle={[
        styles.container,
        {maxHeight: screenHeight - insets.top - 104},
      ]}
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}
      animationIn={'slideInUp'}
      animationInTiming={400}
      animationOutTiming={400}
      animationOut={'slideOutDown'}
      isVisible={isVisible}
      scrollable>
      <View style={styles.redeemHeaderWrapper}>
        <TouchableOpacity onPress={onCloseModal}>
          <Image
            source={CloseIcon}
            resizeMode="contain"
            style={styles.closeIcon}
          />
        </TouchableOpacity>
        <Text fontWeight="500" fontSize={16}>
          {'Participating locations'}
        </Text>
      </View>
      <View
        style={[
          styles.logoWrapper,
          {backgroundColor: selectedVoucher?.merchant?.color},
        ]}>
        <FastImage
          source={{uri: s3BaseUrl + selectedVoucher?.merchant?.imageKey}}
          resizeMode="contain"
          style={styles.logo}
        />
        <Icon
          icon={TwoFingersIcon}
          iconStyle={styles.twoFingersIcon}
          height={146}
          width={87}
        />
      </View>
      {nearestLocations.map((item, index) => (
        <NearestLocationsListItem
          key={index}
          address={item.address}
          distance={item.distance}
        />
      ))}
    </Modal>
  );
};

export default NearestLocationsModal;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 22,
    width: screenWidth,
    paddingHorizontal: 16,
    maxHeight: screenHeight - 104,
  },
  redeemHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeIcon: {
    height: 22,
    width: 22,
    marginRight: 10,
  },
  logoWrapper: {
    paddingVertical: 22,
    alignItems: 'center',
    justifyContent: 'center',
    height: 146,
    borderRadius: 10,
    marginHorizontal: 34,
  },
  logo: {
    height: '100%',
    width: '100%',
    zIndex: 2,
  },
  twoFingersIcon: {
    position: 'absolute',
    opacity: 0.1,
    left: 0,
    height: 130,
    width: 87,
  },
});
