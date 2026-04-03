import {
  ActivityIndicator,
  ImageSourcePropType,
  StyleSheet,
  View,
} from 'react-native';
import React from 'react';
import Text from './Text';
import Colors from '../assets/Colors';
import FlameIcon from '../assets/icons/flame.png';
import ImageIcon from '../assets/icons/image.png';
import VerifyIcon from '../assets/icons/verify.png';
import DiscountIcon from '../assets/icons/discount.png';
import Icon from './Icon';

interface InfoCardProps {
  type:
    | 'DAY_STREAK'
    | 'PHOTOS_SUBMITTED'
    | 'PHOTOS_VERIFIED'
    | 'OFFERS_REDEEMED';
  value: number;
  isLoading: boolean;
}

const InfoCard = ({value, type, isLoading}: InfoCardProps) => {
  let icon: ImageSourcePropType;
  let title: string;

  switch (type) {
    case 'DAY_STREAK':
      icon = FlameIcon;
      title = 'Day Streak';
      break;
    case 'PHOTOS_SUBMITTED':
      icon = ImageIcon;
      title = 'Photos Submitted';
      break;
    case 'PHOTOS_VERIFIED':
      icon = VerifyIcon;
      title = 'Photos Verified';
      break;
    case 'OFFERS_REDEEMED':
      icon = DiscountIcon;
      title = 'Offers Redeemed';
      break;
  }

  return (
    <View style={styles.wrapper}>
      <View style={styles.headerContainer}>
        <Text style={styles.title} fontSize={12}>
          {title}
        </Text>
        <Icon icon={icon} />
      </View>
      {isLoading ? (
        <ActivityIndicator size={24} />
      ) : (
        <Text fontSize={20} fontWeight="600">
          {value?.toString()}
        </Text>
      )}
    </View>
  );
};

export default InfoCard;

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    margin: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    flex: 1,
  },
});
