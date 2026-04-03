import AsyncStorage from '@react-native-async-storage/async-storage';
import {apiUrl} from './common/Config';
import {post} from './common/RequestHelper';
import {GetOnlineVouchersRequest, VoucherData} from './types';

const baseUrl = apiUrl + 'onlineVouchers/';

export const getOnlineVouchersForMarketPlace = async (
  req: GetOnlineVouchersRequest,
): Promise<VoucherData[]> => {
  const url = baseUrl + 'getOnlineVouchersForMarketPlace';
  const token = await AsyncStorage.getItem('jwtToken');
  const result = await post(url, req, token);
  return result.data as VoucherData[];
};
