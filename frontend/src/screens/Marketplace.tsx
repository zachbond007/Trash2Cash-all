import {Animated, FlatList, StyleSheet, View} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import Wrapper from '../components/Wrapper';
import BigList from 'react-native-big-list';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Button from '../components/Button';
import {useAppDispatch, useAppSelector} from '../redux/store';
import MarketplaceVoucherCard from '../components/MarketplaceVoucherCard';
import {MarketplaceVoucher} from '../types';
import {getLocalVouchersForMarketPlace, getAllLocalVouchers} from '../api/voucher';
import {
  setLocalVouchers,
  setOnlineVouchers,
} from '../redux/slices/marketplaceSlice';
import {screenHeight, screenWidth} from '../utils/UIHelper';
import Colors from '../assets/Colors';
import OfferModal from '../components/OfferModal';
import RedeemModal from '../components/RedeemModal';
import {timingAnimation} from '../utils/AnimationHelper';
import Loader from '../components/Loader';
import NearestLocationsModal from '../components/NearestLocationsModal';
import {
  setSelectedCategory,
  setTabBehaviour,
} from '../redux/slices/marketplaceSlice';
import {MarketplaceCategory} from '../types/types';
import CategoryCard from '../components/CategoryCard';
import {onlineCategories} from '../assets/DATA';
import Toast from 'react-native-toast-message';
import {getOnlineVouchersForMarketPlace} from '../api/onlineVoucher';
import {checkLocationPermissions} from '../utils/LocationHelper';
import Geolocation from '@react-native-community/geolocation';
import Text from '../components/Text';
import {RouteProp, useRoute} from '@react-navigation/native';
import {AppStackParams} from '../types';

interface RenderVoucherProps {
  item: MarketplaceVoucher;
  index: number;
}
interface RenderCategoryProps {
  item: MarketplaceCategory;
  index: number;
}
const Marketplace = () => {
  const route = useRoute<RouteProp<AppStackParams, 'Marketplace'>>();
  const insets = useSafeAreaInsets();
  const dispatch = useAppDispatch();
  const {
    isMarketplaceScreen,
    tabBehaviour,
    selectedCategory,
    localVouchers,
    onlineVouchers,
  } = useAppSelector(state => state.marketplace);

  const [isOfferDetailsModalVisible, setIsOfferDetailsModalVisible] =
    useState(false);
  const [isRedeemModalVisible, setIsRedeemModalVisible] = useState(false);
  const [isNearestLocationsModalVisible, setIsNearestLocationsModalVisible] =
    useState(false);
  const [locationPermissionGranted, setLocationPermissionGranted] =
    useState(false);

  const [isLoading, setIsLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState<MarketplaceVoucher>();

  const backgroundOverlayOpacity = useRef(new Animated.Value(0)).current;
  const loaderOpacity = useRef(new Animated.Value(0)).current;

  const isLocalTab = tabBehaviour === 'LOCAL';
  const isOnlineTab = tabBehaviour === 'ONLINE';

  useEffect(() => {
    const unlockedVoucher = route.params?.selectedVoucher;
    if (unlockedVoucher) {
      dispatch(setTabBehaviour('LOCAL'));
      dispatch(setSelectedCategory(null));
      setSelectedVoucher(unlockedVoucher);
      setIsOfferDetailsModalVisible(true);
      timingAnimation(backgroundOverlayOpacity, 1, 500);
    }
  }, [route.params?.selectedVoucher]);

  useEffect(() => {
    const prepareData = async () => {
      setIsLoading(true);
      timingAnimation(loaderOpacity, 1, 500);
      const _locationPermissionGranted = await checkLocationPermissions();
      if (_locationPermissionGranted) {
        setLocationPermissionGranted(true);
        Geolocation.getCurrentPosition(
  	  async res => {
    	    const result = await getLocalVouchersForMarketPlace({
              lat: res.coords.latitude,
              lng: res.coords.longitude,
            });
            if (result?.length > 0) {
              dispatch(setLocalVouchers(result));
            }
            timingAnimation(loaderOpacity, 0, 500, 0, () => {
             setIsLoading(false);
            });
          },
          error => {
            console.log('Location error:', error);
            getAllLocalVouchers().then(result => {
              if (result?.length > 0) {
                dispatch(setLocalVouchers(result));
              }
            });
            timingAnimation(loaderOpacity, 0, 500, 0, () => {
              setIsLoading(false);
            });
           },
          {timeout: 5000},
        );

      } else {
        timingAnimation(loaderOpacity, 0, 500, 0, () => {
          setIsLoading(false);
          Toast.show({
            type: 'error',
            text1: 'Enable location!🙏',
            text2: 'Location must be on to redeem in-person discounts',
            topOffset: 100,
          });
        });
      }
    };
    prepareData();
  }, []);

  const onCategoryCardClick = async (item: MarketplaceCategory) => {
    setIsLoading(true);
    timingAnimation(loaderOpacity, 1, 500);
    dispatch(setTabBehaviour('ONLINE'));
    dispatch(setSelectedCategory(item));
    const result = await getOnlineVouchersForMarketPlace({
      category: item.category,
    });
    dispatch(setOnlineVouchers(result ?? []));
    timingAnimation(loaderOpacity, 0, 500, 0, () => {
      setIsLoading(false);
    });
  };

  const renderVoucher = ({item, index}: RenderVoucherProps) => {
    return (
      <MarketplaceVoucherCard
        key={index}
        onCardClick={() => {
          setSelectedVoucher(item);
          setIsOfferDetailsModalVisible(true);
          timingAnimation(backgroundOverlayOpacity, 1, 500);
        }}
        voucher={item}
      />
    );
  };
  const renderCategory = ({item, index}: RenderCategoryProps) => {
    return (
      <CategoryCard
        key={index}
        onCardClick={() => onCategoryCardClick(item)}
        onlineCategory={item}
      />
    );
  };

  const onClaimOfferClick = async () => {
    timingAnimation(backgroundOverlayOpacity, 1, 500);
    setIsRedeemModalVisible(true);
  };

  const onViewLocationsClick = async () => {
    timingAnimation(backgroundOverlayOpacity, 1, 500);
    setIsNearestLocationsModalVisible(true);
  };

  return (
    <Wrapper style={styles.wrapper}>
      {isLoading ? (
        <Animated.View style={[styles.loaderWrapper, {opacity: loaderOpacity}]}>
          <Loader />
        </Animated.View>
      ) : !isLocalTab && selectedCategory && onlineVouchers.length == 0 ? (
        <View style={styles.locationPermissionInfoContainer}>
          <Text
            fontSize={16}
            fontWeight="600"
            style={styles.locationPermissionInfo}>
            No coupons found at this time. Come back later.
          </Text>
        </View>
      ) : isLocalTab || (isOnlineTab && selectedCategory) ? (
        <BigList
          showsVerticalScrollIndicator={false}
          data={isLocalTab ? localVouchers : onlineVouchers}
          renderItem={renderVoucher}
          itemHeight={146}
          contentContainerStyle={[
            styles.voucherListContainer,
            false && tabBehaviour && isMarketplaceScreen && {paddingTop: 46},
          ]}
          style={{marginBottom: -insets.bottom}}
          renderFooter={() => {
            return (
              isLocalTab && (
                <Button
                  onPressButton={() => {}}
                  title="More businesses coming soon!"
                  containerStyle={styles.moreBusinessesButton}
                  passive
                />
              )
            );
          }}
          footerHeight={50}
          renderHeader={() => null}
        />
            ) : (
              <View />
            )}

      {selectedVoucher && (
        <OfferModal
          isVisible={isOfferDetailsModalVisible}
          onCloseModal={() => {
            setIsOfferDetailsModalVisible(false);
            timingAnimation(backgroundOverlayOpacity, 0, 500);
          }}
          selectedVoucher={selectedVoucher}
          onClaimOfferClick={onClaimOfferClick}
          onViewLocationsClick={onViewLocationsClick}
        />
      )}
      <RedeemModal
        isVisible={isRedeemModalVisible}
        onCloseModal={() => {
          setIsRedeemModalVisible(false);
          timingAnimation(backgroundOverlayOpacity, 0, 500);
        }}
        selectedVoucher={selectedVoucher!}
      />
      <NearestLocationsModal
        isVisible={isNearestLocationsModalVisible}
        onCloseModal={() => {
          setIsNearestLocationsModalVisible(false);
          timingAnimation(backgroundOverlayOpacity, 0, 500);
        }}
        selectedVoucher={selectedVoucher!}
      />
      <Animated.View
        pointerEvents={'none'}
        style={[styles.backgroundOverlay, {opacity: backgroundOverlayOpacity}]}
      />
    </Wrapper>
  );
};

export default Marketplace;

const styles = StyleSheet.create({
  wrapper: {
    paddingTop: 74,
    flex: 1,
  },
  loaderWrapper: {
    position: 'absolute',
    top: 140,
    alignItems: 'center',
    justifyContent: 'center',
    width: screenWidth,
    zIndex: 99,
  },
  locationPermissionInfoContainer: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 32,
  },
  locationPermissionInfo: {
    textAlign: 'center',
    marginBottom: 32,
  },
  voucherListContainer: {
    paddingBottom: 136,
    paddingHorizontal: 16,
  },
  moreBusinessesButton: {
    marginTop: 40,
  },
  onlineCategoriesContainer: {
    paddingBottom: 136,
    paddingTop: 18,
  },
  backgroundOverlay: {
    backgroundColor: Colors.backgroundOverlay,
    position: 'absolute',
    height: screenHeight,
    width: screenWidth,
    zIndex: 1,
  },
});
