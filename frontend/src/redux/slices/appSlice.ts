import {createSlice} from '@reduxjs/toolkit';
import {calculateLevelBarPercentage} from '../../utils/ProgressBarHelper';
import {User} from '../../types';
import {NearestLocation, UnlockedVoucher} from '../../types/types';
import {
  SubmitHuntVerificationResponse,
  VerificationHunt,
} from '../../api/types';
import {getDistance} from '../../utils/DirectionHelper';
interface AppState {
  user: User | null;
  loggedIn: 'FROM_REGISTER' | 'FROM_LOGIN' | null;
  isTutorial: boolean;
  isRewardAnimationFinished: boolean;
  levelBarPercent: number;
  isApprove: boolean;
  isRewardAnimationVisible: boolean;
  isHuntImageAnimatiomFinished: boolean;
  unlockedVouchers: UnlockedVoucher[];
  isTabBarVisible: boolean;
  rewardXp: number;
  currentHunt: VerificationHunt | null;
  currentHuntDetails: SubmitHuntVerificationResponse | null;
  nearestLocations: NearestLocation[];
  triggerHandleNo: boolean;
  triggerHandleYes: boolean;
  isQuestionMode: boolean;
  triggerSwipeRight: boolean;
  triggerSwipeLeft: boolean;
  triggerSwipeBack: boolean;
}
const initialState: AppState = {
  user: null,
  loggedIn: null,
  isTutorial: false,
  isRewardAnimationFinished: false,
  levelBarPercent: 0,
  isApprove: true,
  isRewardAnimationVisible: false,
  isHuntImageAnimatiomFinished: true,
  unlockedVouchers: [],
  isTabBarVisible: true,
  rewardXp: 0,
  currentHunt: null,
  currentHuntDetails: null,
  nearestLocations: [],
  triggerHandleNo: false,
  triggerHandleYes: false,
  isQuestionMode: false,
  triggerSwipeRight: false,
  triggerSwipeLeft: false,
  triggerSwipeBack: false,
};

const appSlice = createSlice({
  name: 'app',
  initialState,
  extraReducers: () => {},
  reducers: {
    setLoggedIn: (state, action) => {
      state.loggedIn = action.payload;
      state.currentHunt = null;
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.levelBarPercent = calculateLevelBarPercentage(
        action.payload.currentXp,
        action.payload.targetXp,
      );
    },
    setIstTutorial: (state, action) => {
      state.isTutorial = action.payload;
    },
    updateUser: (state, action) => {
      const user = state.user;
      user!.name = action.payload.name;
      user!.username = action.payload.username;
      user!.birthday = action.payload.birthday;
      if (action.payload.avatar !== undefined) {
        user!.avatar = action.payload.avatar;
      }
    },
    increaseLevelBarPercent: (state, action) => {
      state.levelBarPercent = state.levelBarPercent + action.payload;
      state.user!.currentXp = state.user!.currentXp + state.rewardXp;
    },
    setIsRewardAnimationFinished: (state, action) => {
      state.isRewardAnimationFinished = action.payload;
    },
    setIsApprove: (state, action) => {
      state.isApprove = action.payload;
    },
    setIsRewardAnimationVisible: (state, action) => {
      state.isRewardAnimationVisible = action.payload;
    },
    setIsHuntImageAnimatiomFinished: (state, action) => {
      state.isHuntImageAnimatiomFinished = action.payload;
    },
    setUnlockedVouchers: (state, action) => {
      state.unlockedVouchers = action.payload ?? [];
    },
    setIsTabBarVisible: (state, action) => {
      state.isTabBarVisible = action.payload;
    },
    setRewardXp: (state, action) => {
      state.rewardXp = action.payload;
    },
    setCurrentHunt: (state, action) => {
      state.currentHunt = action.payload;
    },
    setCurrentHuntDetails: (state, action) => {
      state.currentHuntDetails = action.payload;
    },
    setNearestLocations: (state, action) => {
      state.nearestLocations = action.payload;
    },
    setTriggerHandleYes: (state, action) => {
      state.triggerHandleYes = action.payload;
    },
    setTriggerHandleNo: (state, action) => {
      state.triggerHandleNo = action.payload;
    },
    setTriggerSwipeLeft: (state, action) => {
      state.triggerSwipeLeft = action.payload;
    },
    setTriggerSwipeRight: (state, action) => {
      state.triggerSwipeRight = action.payload;
    },
    setTriggerSwipeBack: (state, action) => {
      state.triggerSwipeBack = action.payload;
    },

    setIsQuestionMode: (state, action) => {
      state.isQuestionMode = action.payload;
    },
    increaseHuntVote: state => {
      const huntDetails = state.currentHuntDetails;
      if (state.isApprove) {
        huntDetails!.yesCount = huntDetails!.yesCount + 1;
      } else {
        huntDetails!.noCount = huntDetails!.noCount + 1;
      }
    },
    updateLevel: (state, action) => {
      const user = state.user;
      const calculatedXp = user!.currentXp - user!.targetXp;
      const nextLevelTargetXp = action.payload;
      state.levelBarPercent = calculateLevelBarPercentage(
        calculatedXp,
        action.payload,
      );
      user!.level++;
      user!.currentXp = calculatedXp;
      user!.targetXp = nextLevelTargetXp;
    },
    updateNearestLocations: (state, action) => {
      let tempNearestLocations = state.nearestLocations;
      const {lat, lng} = action.payload;
      tempNearestLocations.map(
        item => (item.distance = getDistance(lat, lng, item.lat, item.lng)),
      );
      tempNearestLocations.sort(
        (a, b) =>
          getDistance(lat, lng, a.lat, a.lng) -
          getDistance(lat, lng, b.lat, b.lng),
      );

      state.nearestLocations =
        tempNearestLocations.length > 3
          ? tempNearestLocations.slice(0, 3)
          : tempNearestLocations;
    },
  },
});

export default appSlice.reducer;
export const {
  setLoggedIn,
  setUser,
  setIstTutorial,
  updateUser,
  increaseLevelBarPercent,
  setIsRewardAnimationFinished,
  setIsApprove,
  setIsRewardAnimationVisible,
  setIsHuntImageAnimatiomFinished,
  setUnlockedVouchers,
  setIsTabBarVisible,
  setRewardXp,
  setCurrentHunt,
  setNearestLocations,
  increaseHuntVote,
  setCurrentHuntDetails,
  updateLevel,
  updateNearestLocations,
  setTriggerHandleYes,
  setTriggerHandleNo,
  setIsQuestionMode,
  setTriggerSwipeLeft,
  setTriggerSwipeRight,
  setTriggerSwipeBack,
} = appSlice.actions;
