import {StyleSheet, View} from 'react-native';
import React from 'react';
import Text from './Text';
import Colors from '../assets/Colors';
import BellIcon from '../assets/icons/bell.png';
import Icon from './Icon';
import {screenWidth} from '../utils/UIHelper';
import {PointHistory} from '../types/types';
import {calculateTimeDifference} from '../utils/DateHelper';

const PointHistoryListItem = (pointHistory: PointHistory) => {
  const {actionType, createdAt, earnedXP} = pointHistory;

  const calculatedDate = calculateTimeDifference(createdAt);
  const performedByText =
    actionType === 'VERIFICATION'
      ? 'You verified a photo '
      : `5 people verified your photo `;
  const xpText = `${earnedXP}XP`;
  const dateText = ` • ${calculatedDate} ago`;
  return (
    <>
      <View style={styles.container}>
        <Icon icon={BellIcon} height={32} width={32} iconStyle={styles.icon} />
        <Text style={styles.textWrapper}>
          <Text fontWeight="500">{performedByText}</Text>
          <Text fontWeight="500" color={Colors.lightGreen}>
            {xpText}
          </Text>
          <Text fontWeight="500" color={Colors.mediumGray}>
            {dateText}
          </Text>
        </Text>
      </View>
      <View style={styles.underline} />
    </>
  );
};

export default PointHistoryListItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    width: screenWidth - 32,
  },
  icon: {
    marginRight: 8,
  },
  textWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  underline: {
    height: 1,
    width: screenWidth - 32,
    backgroundColor: Colors.lightGray,
    marginVertical: 12,
  },
});
