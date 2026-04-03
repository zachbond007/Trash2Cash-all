import {screenWidth} from './UIHelper';

export const getLevelBarWidth = (value: number) => {
  const val = ((screenWidth - 158) * value) / 100;
  if (val < 20) {
    return 20;
  } else if (val > screenWidth - 158) {
    return screenWidth - 158;
  } else {
    return val;
  }
};

export const calculateLevelBarPercentage = (
  currentXp: number,
  targetXp: number,
) => {
  const val = (currentXp * 100) / targetXp;
  if (val > 100) {
    return 100;
  }
  return val;
};
