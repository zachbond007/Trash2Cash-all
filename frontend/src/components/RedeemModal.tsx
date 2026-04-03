import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {MarketplaceVoucher} from '../types';
import Text from './Text';
import Modal from './Modal';
import CloseIcon from '../assets/icons/close.png';
import Colors from '../assets/Colors';
import {screenHeight, screenWidth} from '../utils/UIHelper';
import MarketplaceVoucherCard, {CardTypes} from './MarketplaceVoucherCard';
import Barcode from '@kichiyaki/react-native-barcode-generator';
import {useAppSelector} from '../redux/store';

interface RedeemModalProps {
  isVisible: boolean;
  onCloseModal: () => void;
  selectedVoucher: MarketplaceVoucher;
}

const RedeemModal = ({
  isVisible = false,
  onCloseModal,
  selectedVoucher,
}: RedeemModalProps) => {
  const {tabBehaviour} = useAppSelector(state => state.marketplace);
  const isBarcode = selectedVoucher?.voucher.type === 'BARCODE';
  const isCode = selectedVoucher?.voucher.type === 'CODE';

  return (
    <Modal
      backdropOpacity={0}
      containerStyle={[
        styles.container,
        tabBehaviour && {maxHeight: screenHeight - 180},
      ]}
      onBackdropPress={onCloseModal}
      onBackButtonPress={onCloseModal}
      animationIn={'slideInUp'}
      animationInTiming={400}
      animationOutTiming={400}
      animationOut={'slideOutDown'}
      isVisible={isVisible}
      scrollable>
      <View style={styles.headerWrapper}>
        <TouchableOpacity onPress={onCloseModal}>
          <Image
            source={CloseIcon}
            resizeMode="contain"
            style={styles.closeIcon}
          />
        </TouchableOpacity>
        <Text fontWeight="500" fontSize={16}>
          {'Redeem!'}
        </Text>
      </View>
      <MarketplaceVoucherCard
        cardType={CardTypes.BIG}
        voucher={selectedVoucher}
      />
      {isCode ? (
        <View style={styles.redeemCodeWrapper}>
          <Text
            fontSize={80}
            color={Colors.white}
            fontWeight="600"
            style={{top: 2}}>
            {selectedVoucher?.voucher.code}
          </Text>
        </View>
      ) : isBarcode ? (
        <Barcode
          format="CODE39"
          value={selectedVoucher.voucher.code ?? ''}
          style={styles.barcode}
          height={126}
          maxWidth={screenWidth - 60}
        />
      ) : null}
      <Text fontSize={17} fontWeight="600" style={styles.footerTitle}>
        {'Disclaimers'}
      </Text>
      <Text
        fontSize={12}
        style={
          styles.footerDescription
        }>{`The online discounts offered on Trash2Cash are not exclusive to our app users. We're working actively with online retailers to secure exclusive deals and will update these offerings as we grow.
        
Trash2Cash offers cannot be combined with any other discounts, offers, or promotions. Discounts are intended to be used on their own and cannot be applied to previously discounted products or services.

Offers provided to staff members at various businesses are offered solely at the discretion of the participating businesses. We do not guarantee the availability or accuracy of these discounts and are not responsible for any errors, omissions, or changes to the discounts.`}</Text>
    </Modal>
  );
};

export default RedeemModal;

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 0,
    position: 'absolute',
    bottom: 0,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    paddingTop: 22,
    width: screenWidth,
    paddingHorizontal: 30,
    maxHeight: screenHeight - 104,
  },
  headerWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  closeIcon: {
    height: 22,
    width: 22,
    marginRight: 10,
  },
  redeemCodeWrapper: {
    paddingHorizontal: 55,
    paddingVertical: 4,
    alignSelf: 'center',
    borderRadius: 99,
    backgroundColor: Colors.mediumLightBlue,
    marginTop: 30,
  },
  barcode: {
    borderRadius: 9,
    overflow: 'hidden',
    marginTop: 30,
    alignSelf: 'center',
  },
  footerTitle: {
    opacity: 0.75,
    marginTop: 32,
    paddingHorizontal: 10,
  },
  footerDescription: {
    opacity: 0.75,
    marginTop: 24,
    paddingHorizontal: 10,
  },
});
