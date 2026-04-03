import {ImageSourcePropType} from 'react-native';
import {Merchant, Voucher} from '../api/types';
import {Source} from 'react-native-fast-image';

export interface User {
  name: string;
  email: string;
  username: string;
  birthday: Date;
  level: number;
  currentXp: number;
  targetXp: number;
  avatar: Source | number;
  createdAt: Date;
  isSocialUser: boolean | null;
  id: number;
}
export interface UnlockedVoucher {
  voucher: Voucher;
  merchant: Merchant;
}

export type FlashAction = {
  mode: FlashModes;
  activeIcon: ImageSourcePropType;
  inactiveIcon: ImageSourcePropType;
};

export interface OnboardPage {
  id: number;
  title: string;
  description: string;
  image: ImageSourcePropType;
}
export interface MarketplaceVoucher {
  voucher: Voucher;
  merchant: Merchant;
}

export interface MarketplaceCategory {
  category: string;
  title: string;
  icon: ImageSourcePropType;
  color: string;
}
export type MarketplaceTabBehaviour = 'LOCAL' | 'ONLINE' | 'CATEGORY' | null;
export interface Hunt {
  imageUri: number | Source;
  id: number;
  approveCount: number;
  disapproveCount: number;
  avatar: number | Source;
  level: number;
  username: string;
}
export interface NearestLocation {
  address: string;
  distance: number;
  lat: number;
  lng: number;
}

export type SocialButton = 'GOOGLE' | 'FACEBOOK' | 'APPLE';
export type HuntVerificationType = 'APPROVE' | 'DISAPPROVE';
export type FlashModes = 'torch' | 'off' | 'auto';

export interface PointHistory {
  actionType: string;
  earnedXP: string;
  createdAt: Date;
}
