import React, {useEffect, useRef, useState} from 'react';
import {Animated, StyleSheet} from 'react-native';
import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import Colors from '../../assets/Colors';
import TabBarButton from './TabBarButton';
import {useAppDispatch, useAppSelector} from '../../redux/store';
import {timingAnimation} from '../../utils/AnimationHelper';
import {setIsMarketplaceScreen} from '../../redux/slices/marketplaceSlice';

export const TabBar = ({state, navigation}: BottomTabBarProps) => {
  const dispatch = useAppDispatch();
  const {isTabBarVisible} = useAppSelector(state => state.app);
  const {isMarketplaceScreen} = useAppSelector(state => state.marketplace);
  const containerOpacity = useRef(new Animated.Value(1)).current;
  const [isTabBarHidden, setIsTabBarHidden] = useState(false);

  useEffect(() => {
    if (navigation.getState().index === 2) {
      dispatch(setIsMarketplaceScreen(true));
    } else if (isMarketplaceScreen) {
      dispatch(setIsMarketplaceScreen(false));
    }
  }, [navigation.getState()]);
  useEffect(() => {
    if (!isTabBarVisible) {
      timingAnimation(containerOpacity, 0, 500, 0, () => {
        setIsTabBarHidden(true);
      });
    } else {
      setIsTabBarHidden(false);
      timingAnimation(containerOpacity, 1, 500);
    }
  }, [isTabBarVisible]);

  return (
    <Animated.View
      style={[
        styles.container,
        {opacity: containerOpacity},
        isTabBarHidden && {display: 'none'},
      ]}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const buttonTitle =
          state.routeNames[index] === 'HuntVerification'
            ? 'XP'
            : state.routeNames[index] === 'Home'
            ? 'Home'
            : 'Marketplace';
        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TabBarButton
            isDisabled={!isTabBarVisible}
            isFocused={isFocused}
            key={index}
            title={buttonTitle}
            onPress={onPress}
          />
        );
      })}
    </Animated.View>
  );
};

export default TabBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    marginHorizontal: 16,
    borderRadius: 99,
    position: 'absolute',
    bottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  tabWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  tabBarIcon: {
    width: 32,
    height: 32,
  },
});
