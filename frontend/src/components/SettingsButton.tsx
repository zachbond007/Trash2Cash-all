import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from './Text';
import ChevronIcon from '../assets/icons/chevron.png';
import Icon from './Icon';
import Colors from '../assets/Colors';

interface SettingsButtonProps {
  title?: string;
  onPressButton: () => void;
}

const SettingsButton = ({onPressButton, title}: SettingsButtonProps) => {
  return (
    <View style={styles.wrapper}>
      <TouchableOpacity onPress={onPressButton} style={styles.container}>
        <Text fontSize={16} style={{flex: 1}}>
          {title}
        </Text>
        <Icon icon={ChevronIcon} />
      </TouchableOpacity>
      <View style={styles.underline} />
    </View>
  );
};

export default SettingsButton;

const styles = StyleSheet.create({
  wrapper: {
    overflow: 'hidden',
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'center',
    marginVertical: 16,
  },
  underline: {
    height: 1,
    backgroundColor: Colors.lightGray,
    width: '100%',
  },
});
