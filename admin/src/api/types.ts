export type LoginRequest = {
  email: string;
  password: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
};

export type User = {
  id: number;
  name: string;
  email: string;
  jwtToken: string;
};

export type CreateMerchantRequest = {
  name: string;
  imageKey: any;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  color?: string;
};
export type EditMerchantRequest = {
  id: number;
  name: string;
  imageKey?: any;
  contactName?: string;
  contactEmail?: string;
  contactPhone?: string;
  color?: string;
};

export type AdminVerifyHuntRequest = {
  id: number;
  adminVerifiedAs: string;
};

export type Offer = {
  lmd_id: string;
  offer_text: string;
  offer_value: string;
  code: string;
  title: string;
  description: string;
  store: string;
  url: string;
  smartLink: string;
  categories: string;
  level?: number;
  start_date: Date;
  end_date: Date;
  selected: boolean;
  selected_categories: string[];
};
