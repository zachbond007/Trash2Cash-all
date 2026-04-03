import {createSlice} from '@reduxjs/toolkit';
import {
  MarketplaceCategory,
  MarketplaceVoucher,
  MarketplaceTabBehaviour,
} from '../../types/types';

interface MarketplaceState {
  tabBehaviour: MarketplaceTabBehaviour;
  isMarketplaceScreen: boolean;
  selectedCategory: MarketplaceCategory | null;
  localVouchers: MarketplaceVoucher[];
  onlineVouchers: MarketplaceVoucher[];
}
const initialState: MarketplaceState = {
  tabBehaviour: null,
  isMarketplaceScreen: false,
  selectedCategory: null,
  localVouchers: [],
  onlineVouchers: [],
};

const marketplaceSlice = createSlice({
  name: 'marketplace',
  initialState,
  reducers: {
    setTabBehaviour: (
      state,
      action: {
        payload: MarketplaceTabBehaviour;
      },
    ) => {
      state.tabBehaviour = action.payload;
    },
    setIsMarketplaceScreen: (state, action: {payload: boolean}) => {
      state.isMarketplaceScreen = action.payload;
    },
    setSelectedCategory: (
      state,
      action: {payload: MarketplaceCategory | null},
    ) => {
      state.selectedCategory = action.payload;
    },
    setLocalVouchers: (
      state,
      action: {
        payload: MarketplaceVoucher[];
      },
    ) => {
      state.localVouchers = action.payload;
      state.tabBehaviour = 'LOCAL';
    },
    setOnlineVouchers: (
      state,
      action: {
        payload: MarketplaceVoucher[];
      },
    ) => {
      state.onlineVouchers = action.payload;
    },
  },
});

export default marketplaceSlice.reducer;
export const {
  setTabBehaviour,
  setIsMarketplaceScreen,
  setSelectedCategory,
  setLocalVouchers,
  setOnlineVouchers,
} = marketplaceSlice.actions;
