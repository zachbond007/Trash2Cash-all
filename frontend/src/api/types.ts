export type ActionType =
  | 'VERIFICATION'
  | '5_PLUS_VERIFIED_ITEMS'
  | '5_PLUS_VERIFIED_SMALL_BAG'
  | '5_PLUS_VERIFIED_LARGE_BAG'
  | '5_PLUS_VERIFIED_MORE_THAN_LARGE_BAG'
  | 'SHARE';

export type ItemSize =
  | '1_10_ITEMS'
  | 'SMALL_BAG'
  | 'LARGE_BAG'
  | 'MORE_THAN_LARGE_BAG';

export type SubmitHuntVerificationRequest = {
  huntId: number;
  answer: 'YES' | 'NO';
  itemSize?: ItemSize;
};

export type Voucher = {
  id: number;
  merchatId: number;
  title: string;
  description?: string;
  code?: string;
  type?: VoucherTypes;
  level: number;
  smartLink?: string;
  categories?: string;
};
export type Merchant = {
  id: number;
  name: string;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  imageKey?: string;
  color?: string;
};

export type GetVouchersByLevelResponse = {
  nextLevelRequiredXp?: number;
  vouchers: VoucherData[];
};

export type VoucherData = {
  voucher: Voucher;
  merchant: Merchant;
};

export type RegisterUserRequest = {
  name: string;
  username: string;
  email: string;
  password: string;
  avatar?: string;
  fcmToken?: string;
  verificationToken: string;
};
export type RegisterEmailVerificationRequest = {
  email: string;
};

export type VerifyEmailRequest = {
  email: string;
  token: string;
};

export type GetVouchersForMarketPlaceResponse = {
  voucher: Voucher;
  merchant: Merchant;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type ForgotPasswordRequest = {
  email: string;
};

export type ResetPasswordRequest = {
  token: string;
  newPassword: string;
};

export type UpdateUserRequest = {
  name: string;
  username: string;
};

export type CreateHuntRequest = {
  imageKey: string;
};

export type AddClaimRequest = {
  voucherId: number;
  userId: number;
};

export type GetHuntsForVerificationRequest = {
  quantity: number;
  huntIds?: number[];
};

export type VerificationHunt = {
  createdAt: Date;
  imageKey: string;
  huntId: number;
};

export type SubmitHuntVerificationResponse = {
  yesCount: number;
  noCount: number;
  userName: string;
  userImageKey: string;
  userLevel: number;
  huntOwnerEarnedXP: number;
  isSocialUser: boolean;
};

export type SigninWithSocialRequest = {
  name: string;
  email: string;
  avatar: string;
  uid: string;
  fcmToken?: string;
};

export type GetNearestLocationsRequest = {
  voucherId: number;
};
export type GetLocalVouchersForMarketPlaceRequest = {
  lat: number;
  lng: number;
};
export type GetOnlineVouchersRequest = {
  category: string;
};

export type VoucherTypes = 'CODE' | 'BARCODE' | 'TITLE';
