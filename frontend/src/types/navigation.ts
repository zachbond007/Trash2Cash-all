import type {MarketplaceVoucher} from './types';
import type {NavigatorScreenParams} from '@react-navigation/native';

export type AuthStackParams = {
  Loading: undefined;
  Login: undefined;
  Register: {
    email: string;
    data?: string;
  };
  PreRegister: {
    pageBehaviour?: PageBehaviour;
  };
  Onboarding: undefined;
  HuntVerificationTutorial: undefined;
  ForgotPassword: undefined;
  ResetPassword: {
    data?: string;
  };
};

export type MainStackParams = {
  TabsRoot: NavigatorScreenParams<AppStackParams> | undefined;
  Profile: undefined;
  Settings: undefined;
  AboutUs: undefined;
  TermsOfUse: undefined;
  PrivacyPolicy: undefined;
  EditProfile: undefined;
};

export type AppStackParams = {
  Home: undefined;
  HuntVerification: undefined;
  Marketplace:
    | {
        selectedVoucher?: MarketplaceVoucher;
      }
    | undefined;
};
export type Navigation = {
  navigate: (scene: string) => void;
};
export type PageBehaviour = 'NEW_USER' | 'RETURNING_USER';
