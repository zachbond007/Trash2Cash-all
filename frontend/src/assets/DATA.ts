import {SubmitHuntVerificationResponse, VerificationHunt} from '../api/types';
import {FlashAction, MarketplaceVoucher, OnboardPage} from '../types';
import {MarketplaceCategory} from '../types/types';

//TUTORIAL DATA

export const tutorialHuntDetails: SubmitHuntVerificationResponse[] = [
  {
    yesCount: 3,
    noCount: 1,
    userName: 'johndoe12',
    userImageKey: require('../assets/images/person_example_2.png'),
    userLevel: 1,
    huntOwnerEarnedXP: 25,
    isSocialUser: false,
  },
  {
    yesCount: 1,
    noCount: 0,
    userName: 'johndoe12',
    userImageKey: require('../assets/images/person_example_2.png'),
    userLevel: 1,
    huntOwnerEarnedXP: 25,
    isSocialUser: false,
  },
];

export const tutorialHunts: VerificationHunt[] = [
  {
    createdAt: new Date(),
    huntId: 1,
    imageKey: require('../assets/images/hunt_example_1.png'),
  },
  {
    createdAt: new Date(),
    huntId: 2,
    imageKey: require('../assets/images/hunt_example_2.png'),
  },
  {
    createdAt: new Date(),
    huntId: 3,
    imageKey: require('../assets/images/hunt_example_3.jpeg'),
  },
];
export const tutorialUser = {
  name: '',
  email: '',
  username: '',
  avatar: require('../assets/images/person_example_1.png'),
  birthday: new Date(),
  level: 1,
  currentXp: 50,
  targetXp: 100,
};

//APP DATA
export const huntSizeAnswers: string[] = [
  '1-10 items',
  'small bag of trash',
  'large bag of trash',
  'more than a large bag',
];

export const flashActions: FlashAction[] = [
  {
    mode: 'off',
    activeIcon: require('../assets/icons/flash_close.png'),
    inactiveIcon: require('../assets/icons/flash_close_gray.png'),
  },
  {
    mode: 'auto',
    activeIcon: require('../assets/icons/flash_auto.png'),
    inactiveIcon: require('../assets/icons/flash_auto_gray.png'),
  },
  {
    mode: 'torch',
    activeIcon: require('../assets/icons/flash_open.png'),
    inactiveIcon: require('../assets/icons/flash_open_gray.png'),
  },
];

export const onboardPages: OnboardPage[] = [
  {
    id: 1,
    title: 'Earn XP to complete levels',
    description:
      'Taking pictures of litter and verifying pictures earns you XP!',
    image: require('../assets/images/trash_cash.png'),
  },
  {
    id: 2,
    title: 'Complete more levels; unlock bigger prizes',
    description: 'The more you use Trash2Cash, the more you’ll save!',
    image: require('../assets/images/coupon_discount.png'),
  },
];

export const monthNames = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const onlineCategories: MarketplaceCategory[] = [
  {
    category: 'apparel',
    title: 'Apparel',
    icon: require('../assets/icons/categories/apparel.png'),
    color: '#FFFBBF',
  },
  {
    category: 'travel',
    title: 'Travel',
    icon: require('../assets/icons/categories/travel.png'),
    color: '#C4FFBF',
  },
  {
    category: 'electronics',
    title: 'Electronics',
    icon: require('../assets/icons/categories/electronics.png'),
    color: '#EFCCFF',
  },
  {
    category: 'groceries',
    title: 'Groceries',
    icon: require('../assets/icons/categories/groceries.png'),
    color: '#CEDAFA',
  },
  {
    category: 'health',
    title: 'Health & Wellness',
    icon: require('../assets/icons/categories/health-wellness.png'),
    color: '#FFBFBF',
  },
  {
    category: 'fun',
    title: 'Fun',
    icon: require('../assets/icons/categories/fun.png'),
    color: '#FFE5BF',
  },
  {
    category: 'other',
    title: 'Other',
    icon: require('../assets/icons/categories/other.png'),
    color: '#D9D9D9',
  },
];
