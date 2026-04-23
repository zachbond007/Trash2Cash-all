import {
  Animated,
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import {MarketplaceVoucher} from '../types';
import Text from './Text';
import MarketplaceVoucherCard, {CardTypes} from './MarketplaceVoucherCard';
import Modal from './Modal';
import CloseIcon from '../assets/icons/close.png';
import ArrowIcon from '../assets/icons/arrow-white.png';
import Button from './Button';
import Colors from '../assets/Colors';
import {screenHeight, screenWidth} from '../utils/UIHelper';
import IconButton from './IconButton';
import Geolocation from '@react-native-community/geolocation';
import {getNearestLocations} from '../api/voucherLocations';
import {useAppDispatch, useAppSelector} from '../redux/store';
import {
  setNearestLocations,
  updateNearestLocations,
} from '../redux/slices/appSlice';
import {getDirections, isInRadius} from '../utils/DirectionHelper';
import Loader from './Loader';
import {timingAnimation} from '../utils/AnimationHelper';
import {addClaim} from '../api/claim';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import {toastConfig} from '../utils/toastConfig';
import Clipboard from '@react-native-clipboard/clipboard';

type StorageClaim = {
  voucherId: number;
  createdAt: Date;
};
interface OfferModalProps {
  isVisible: boolean;
  onCloseModal: () => void;
  onClaimOfferClick: () => void;
  onViewLocationsClick: () => void;
  selectedVoucher: MarketplaceVoucher;
}

const OfferModal = ({
  isVisible = false,
  onCloseModal,
  onClaimOfferClick,
  selectedVoucher,
  onViewLocationsClick,
}: OfferModalProps) => {
  const dispatch = useAppDispatch();
  const {nearestLocations, user} = useAppSelector(state => state.app);
  const {tabBehaviour} = useAppSelector(state => state.marketplace);
  const [triggeredByClaimButton, setTriggeredByClaimButton] = useState(false);
  const [triggeredByViewLocationsButton, setTriggeredByViewLocationsButton] =
    useState(false);
  const [isReminderModalVisible, setIsReminderModalVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const loaderOpacity = useRef(new Animated.Value(0)).current;

  const isLocalTab = tabBehaviour === 'LOCAL';
  const isOnlineTab = tabBehaviour === 'ONLINE';

  useEffect(() => {
    if (isVisible) {
      const prepareData = async () => {
        if (isLocalTab) {
          setIsLoading(true);
          timingAnimation(loaderOpacity, 1, 500);
          const _nearestLocations = await getNearestLocations({
            voucherId: selectedVoucher?.voucher?.id,
          });
          console.log('[Debug] voucherId sent:', selectedVoucher?.voucher?.id);
          console.log('[Debug] nearestLocations response:', JSON.stringify(_nearestLocations));
          dispatch(setNearestLocations(_nearestLocations));
          timingAnimation(loaderOpacity, 0, 500, 0, () => {
            setIsLoading(false);
          });
        }
      };
      prepareData();
    }
  }, [isVisible]);

  const prepareClaims = async () => {
    const userClaims = await AsyncStorage.getItem(`claims-${user!.id}`);
    if (userClaims) {
      const existingClaims: StorageClaim[] = JSON.parse(userClaims!);
      const currentClaim = existingClaims.find(
        val => val.voucherId === selectedVoucher.voucher.id,
      );
      if (currentClaim) {
        const currentTime = new Date();
        const timeDifference =
          currentTime.getTime() - new Date(currentClaim.createdAt).getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);
        if (hoursDifference < 1) {
          return false;
        }
      } else {
        existingClaims.push({
          createdAt: new Date(),
          voucherId: selectedVoucher.voucher.id,
        });
        await AsyncStorage.setItem(
          `claims-${user!.id}`,
          JSON.stringify(existingClaims),
        );
      }
    } else {
      const firstClaim = {
        createdAt: new Date(),
        voucherId: selectedVoucher.voucher.id,
      };
      await AsyncStorage.setItem(
        `claims-${user!.id}`,
        JSON.stringify([firstClaim]),
      );
    }
    return true;
  };
  const _onClaimOfferClick = async () => {
    if (isLocalTab) {
      setIsLoading(true);
      timingAnimation(loaderOpacity, 1, 500);
      Geolocation.getCurrentPosition(
        async res => {
          const isInRadiusPromises = nearestLocations.map(async location => {
            const {lat, lng} = location;
            return isInRadius(lat, lng);
          });
          const isInRadiusResults = await Promise.all(isInRadiusPromises);
          const _isInRadius = isInRadiusResults.includes(true);
          timingAnimation(loaderOpacity, 0, 500, 0, async () => {
            setIsLoading(false);
            if (_isInRadius) {
              const isExpiredOrNewClaim = await prepareClaims();
              if (isExpiredOrNewClaim) {
                await addClaim({
                  userId: user!.id,
                  voucherId: selectedVoucher.voucher.id,
                });
              }
              onCloseModal();
              setTriggeredByClaimButton(true);
            } else {
              dispatch(
                updateNearestLocations({
                  lat: res.coords.latitude,
                  lng: res.coords.longitude,
                }),
              );
              setIsReminderModalVisible(true);
            }
          });
        },
        _error => {
          timingAnimation(loaderOpacity, 0, 500, 0, () => {
            setIsLoading(false);
            setIsReminderModalVisible(true);
          });
        },
        {timeout: 5000},
      );


    } else {
      if (selectedVoucher.voucher.code) {
        Toast.show({
          type: 'copyMessage',
          position: 'bottom',
          bottomOffset: screenHeight / 3,
          visibilityTime: 1200,
        });
        Clipboard.setString(selectedVoucher.voucher.code);
        setTimeout(() => {
          Linking.openURL(selectedVoucher.voucher.smartLink!);
        }, 1500);
      } else {
        Linking.openURL(selectedVoucher.voucher.smartLink!);
      }
    }
  };

  const _onViewLocationsClick = async () => {
    onCloseModal();
    setTriggeredByViewLocationsButton(true);
  };
  const onClosestDirectionsClick = () => {
    if (nearestLocations?.length > 0) {
      getDirections(nearestLocations[0].address);
    }
  };

  const onModalHide = () => {
    if (triggeredByClaimButton) {
      onClaimOfferClick();
      setTriggeredByClaimButton(false);
    } else if (triggeredByViewLocationsButton) {
      onViewLocationsClick();
      setTriggeredByViewLocationsButton(false);
    }
  };

  const redeemStep1 = tabBehaviour
    ? 'Hit “Claim Offer” (below)'
    : 'Go to a participating location (locations above)';
  const redeemStep2 = tabBehaviour ? 'Shop with the store' : 'Claim this offer';
  const redeemStep3 = tabBehaviour
    ? 'Paste the copied code upon checkout!'
    : 'Show your offer screen upon checkout';

  return (
    <Modal
      backdropOpacity={0}
      containerStyle={[
        styles.offerDetailsModalContainer,
        tabBehaviour && {maxHeight: screenHeight - 180},
      ]}
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}
      onModalHide={onModalHide}
      animationInTiming={400}
      animationOutTiming={400}
      animationIn={'slideInUp'}
      animationOut={'slideOutDown'}
      isVisible={isVisible}
      scrollable>
      {isLoading && (
        <Animated.View style={[styles.loaderWrapper, {opacity: loaderOpacity}]}>
          <Loader />
        </Animated.View>
      )}
      <View style={styles.offerDetailsHeaderWrapper}>
        <TouchableOpacity onPress={onCloseModal}>
          <Image
            source={CloseIcon}
            resizeMode="contain"
            style={styles.closeIcon}
          />
        </TouchableOpacity>
        <Text fontWeight="500" fontSize={16}>
          {'Offer details'}
        </Text>
      </View>
      <MarketplaceVoucherCard
        cardType={CardTypes.BIG}
        voucher={selectedVoucher}
      />
      {isLocalTab && (
        <Button
          onPressButton={_onViewLocationsClick}
          title="View participating locations"
          useGreenAndBlueColors
          containerStyle={styles.locationButton}
          titleFontSize={12}
          passive={isLoading}
        />
      )}
      <View style={styles.redeemInstructionsContainer}>
        <Text
          fontSize={16}
          fontWeight="700"
          style={styles.redeemInstructionsTitle}>
          {'How to redeem this'}
        </Text>
        <View style={styles.redeemContainer}>
          <View>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle} />
            </View>
            <View style={styles.cutLineWrapper}>
              <View style={styles.cutLine} />
              <View style={styles.cutLineMask} />
            </View>
          </View>
          <Text fontSize={15} style={styles.redeemInstruction}>
            {redeemStep1}
          </Text>
        </View>
        <View style={styles.redeemContainer}>
          <View>
            <View style={styles.outerCircle}>
              <View style={styles.innerCircle} />
            </View>
            <View style={styles.cutLineWrapper}>
              <View style={styles.cutLine} />
              <View style={styles.cutLineMask} />
            </View>
          </View>
          <Text fontSize={15} style={styles.redeemInstruction}>
            {redeemStep2}
          </Text>
        </View>
        <View style={styles.redeemContainer}>
          <View style={styles.outerCircle}>
            <View style={styles.innerCircle} />
          </View>
          <Text fontSize={15} style={styles.redeemInstruction}>
            {redeemStep3}
          </Text>
        </View>
      </View>
      {isLocalTab && (
        <View style={styles.redeemCodeWrapper}>
          <Text fontSize={36} color={Colors.white} style={styles.redeemCode}>
            {'????'}
          </Text>
        </View>
      )}
      <Button
        onPressButton={_onClaimOfferClick}
        title="Claim Offer"
        containerStyle={styles.claimButton}
        passive={isLoading}
        rightIcon={ArrowIcon}
        leftIcon={ArrowIcon}
        rightIconStyle={{
          minWidth: 38,
          minHeight: 23,
        }}
        leftIconStyle={{
          minWidth: 38,
          minHeight: 23,
        }}
        titleFontSize={27}
      />
      <Text fontWeight="600" fontSize={17} style={styles.footerTitle}>
        {'Disclaimers'}
      </Text>
      <Text fontSize={12} style={styles.footerDescription}>
        {`The online discounts offered on Trash2Cash are not exclusive to our app users. We're working actively with online retailers to secure exclusive deals and will update these offerings as we grow.
        
Trash2Cash offers cannot be combined with any other discounts, offers, or promotions. Discounts are intended to be used on their own and cannot be applied to previously discounted products or services.

Offers provided to staff members at various businesses are offered solely at the discretion of the participating businesses. We do not guarantee the availability or accuracy of these discounts and are not responsible for any errors, omissions, or changes to the discounts.`}
      </Text>

      <Modal
        isVisible={isReminderModalVisible}
        onBackButtonPress={() => setIsReminderModalVisible(false)}
        onBackdropPress={() => setIsReminderModalVisible(false)}
        containerStyle={styles.reminderModalContainer}>
        <IconButton
          icon={CloseIcon}
          onPressButton={() => setIsReminderModalVisible(false)}
          containerStyle={styles.reminderModalCloseButton}
        />
        <Text fontSize={18} fontWeight="700" style={styles.reminderModalTitle}>
          {'Reminder!'}
        </Text>
        <Text fontSize={15} style={{textAlign: 'center'}}>
          {
            'You have to be at or near a participating location to Claim this discount!'
          }
        </Text>
        <Button
          title="Directions to closest one"
          onPressButton={onClosestDirectionsClick}
          containerStyle={styles.reminderModalDirectionsButton}
          titleFontSize={12}
        />
      </Modal>
      <Toast config={toastConfig} />
    </Modal>
  );
};

export default OfferModal;

const styles = StyleSheet.create({
  offerDetailsModalContainer: {
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
  loaderWrapper: {
    position: 'absolute',
    top: 70,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    zIndex: 99,
  },
  offerDetailsHeaderWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeIcon: {
    height: 22,
    width: 22,
    marginRight: 10,
  },
  locationButton: {
    height: 34,
    width: 'auto',
    paddingHorizontal: 24,
    marginTop: 26,
  },
  redeemInstructionsContainer: {
    marginTop: 26,
  },
  redeemInstructionsTitle: {
    marginBottom: 12,
  },
  redeemContainer: {
    flexDirection: 'row',
    flex: 1,
  },
  outerCircle: {
    height: 16,
    width: 16,
    borderRadius: 99,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  innerCircle: {
    height: 9,
    width: 9,
    backgroundColor: Colors.black,
    borderRadius: 99,
  },
  cutLineWrapper: {
    position: 'absolute',
    left: 7.5,
    top: 18,
    bottom: -2,
  },
  cutLine: {
    borderWidth: 1,
    borderColor: Colors.black,
    borderStyle: 'dashed',
    height: '100%',
  },
  cutLineMask: {
    position: 'absolute',
    right: -0.5,
    width: 1.5,
    backgroundColor: Colors.white,
    zIndex: 99,
    height: '100%',
  },
  redeemInstruction: {
    marginLeft: 12,
    paddingBottom: 24,
  },
  redeemCodeWrapper: {
    paddingHorizontal: 40,
    paddingVertical: 4,
    alignSelf: 'center',
    borderRadius: 99,
    backgroundColor: Colors.mediumLightBlue,
  },
  redeemCode: {
    top: 2,
    textAlign: 'center',
  },
  claimButton: {
    marginTop: 20,
    justifyContent: 'space-evenly',
    height: 58,
  },
  footerTitle: {
    marginTop: 24,
  },
  footerDescription: {
    marginTop: 20,
    marginBottom: 24,
    opacity: 0.75,
  },
  reminderModalContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 32,
  },
  reminderModalCloseButton: {
    position: 'absolute',
    left: 18,
    top: 12,
  },
  reminderModalTitle: {
    marginBottom: 30,
  },
  reminderModalDirectionsButton: {
    height: 40,
    width: 'auto',
    paddingHorizontal: 16,
    marginTop: 28,
  },
});
