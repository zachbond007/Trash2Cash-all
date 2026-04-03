import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import MoneyIcon from '../../assets/icons/money.png';
import HomeIcon from '../../assets/icons/home.png';
import MarketplaceIcon from '../../assets/icons/marketplace.png';
import MoneyGrayIcon from '../../assets/icons/money_gray.png';
import HomeGrayIcon from '../../assets/icons/home_gray.png';
import MarketplaceGrayIcon from '../../assets/icons/marketplace_gray.png';
import Text from '../Text';
import Colors from '../../assets/Colors';
import GradientWrapper from '../GradientWrapper';

interface TabBarButtonProps {
  title: 'XP' | 'Home' | 'Marketplace';
  onPress?: () => void;
  isFocused?: boolean;
  isDisabled?: boolean;
}

const TabBarButton = ({
  title = 'XP',
  onPress,
  isFocused,
  isDisabled = false,
}: TabBarButtonProps) => {
  let icon;
  switch (title) {
    case 'Home':
      icon = isFocused ? HomeIcon : HomeGrayIcon;
      break;
    case 'Marketplace':
      icon = isFocused ? MarketplaceIcon : MarketplaceGrayIcon;
      break;
    case 'XP':
      icon = isFocused ? MoneyIcon : MoneyGrayIcon;
      break;
    default:
      icon = null;
  }
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.container}
      disabled={isDisabled}>
      <Image source={icon} style={styles.icon} resizeMode="contain" />
      <Text color={!isFocused ? Colors.mediumGray : Colors.black} fontSize={12}>
        {title}
      </Text>
      {isFocused && (
        <GradientWrapper useGreenAndBlueColors style={styles.bottomLine} />
      )}
      {title !== 'Marketplace' && <View style={styles.separator} />}
    </TouchableOpacity>
  );
};

export default TabBarButton;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    height: '100%',
    paddingVertical: 10,
  },
  icon: {
    height: 24,
    width: 24,
    opacity: 1,
  },
  bottomLine: {
    height: 4,
    width: 56,
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
  },
  separator: {
    width: 1,
    height: 28,
    backgroundColor: Colors.lightGray,
    position: 'absolute',
    right: 0,
  },
});
