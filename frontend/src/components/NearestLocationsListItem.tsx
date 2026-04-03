import {Animated, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import Text from './Text';
import Colors from '../assets/Colors';
import Button from './Button';
import {getDirections} from '../utils/DirectionHelper';
import {timingAnimation} from '../utils/AnimationHelper';

interface NearestLocationsListItemProps {
  address: string;
  distance: number;
}

const NearestLocationsListItem = ({
  address,
  distance,
}: NearestLocationsListItemProps) => {
  const wrapperScale = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    timingAnimation(wrapperScale, 1, 500);
  }, []);

  const onGetDirections = () => {
    getDirections(address);
  };
  return (
    <Animated.View
      style={[styles.container, {transform: [{scale: wrapperScale}]}]}>
      <Text fontSize={17} style={styles.addressText}>
        {address}
      </Text>
      <View style={styles.footerContainer}>
        <Text fontWeight="500" fontSize={17.5} style={styles.distanceText}>
          {`(${distance.toFixed(1)} mi away)`}
        </Text>
        <Button
          onPressButton={onGetDirections}
          title="Get Directions"
          containerStyle={styles.getDirectionButton}
          titleFontSize={14}
        />
      </View>
    </Animated.View>
  );
};

export default NearestLocationsListItem;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: Colors.ultraLightBlue,
    marginHorizontal: 20,
    marginTop: 30,
    paddingHorizontal: 20,
    borderRadius: 41,
    paddingTop: 18,
    paddingBottom: 10,
  },
  addressText: {
    width: '100%',
  },
  footerContainer: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  distanceText: {
    flex: 1,
  },
  getDirectionButton: {
    maxHeight: 30,
    paddingHorizontal: 16,
    flex: 1,
  },
});
