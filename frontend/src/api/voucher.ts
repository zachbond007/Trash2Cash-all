import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from './common/Config';
import {get, post} from './common/RequestHelper';
import {
  GetVouchersByLevelResponse,
  GetLocalVouchersForMarketPlaceRequest,
  VoucherData,
} from './types';

const baseUrl = apiUrl + 'vouchers/';

export const getVouchersByLevel = async (
  level: number,
  lat: number,
  lng: number,
): Promise<GetVouchersByLevelResponse> => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  const url = baseUrl + 'getVouchersByLevel';
  const result = await post(
    url,
    {
      level,
      lat,
      lng,
    },
    jwtToken,
  );
  return result.data as GetVouchersByLevelResponse;
};

export const getLocalVouchersForMarketPlace = async (
  req: GetLocalVouchersForMarketPlaceRequest,
): Promise<VoucherData[]> => {
  const jwtToken = await AsyncStorage.getItem('jwtToken');
  const url = baseUrl + 'getVouchersForMarketPlace';
  const result = await post(url, req, jwtToken);
  return result.data as VoucherData[];
};
