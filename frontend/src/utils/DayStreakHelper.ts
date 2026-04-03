import AsyncStorage from '@react-native-async-storage/async-storage';

export const checkDayStreak = async () => {
  const currentDate = new Date().toISOString().split('T')[0];
  const lastLoginDate = await AsyncStorage.getItem('lastLoginDate');
  const dayStreak = await AsyncStorage.getItem('dayStreak');

  if (lastLoginDate === null || dayStreak === null) {
    await AsyncStorage.setItem('lastLoginDate', currentDate);
    await AsyncStorage.setItem('dayStreak', '1');
  } else {
    const dayDifference = Math.floor(
      (new Date(currentDate).getTime() - new Date(lastLoginDate).getTime()) /
        (1000 * 60 * 60 * 24),
    );
    if (dayDifference === 1) {
      const newDayStreak: number = parseInt(dayStreak) + 1;
      await AsyncStorage.setItem('lastLoginDate', currentDate);
      await AsyncStorage.setItem('dayStreak', newDayStreak.toString());
    } else if (dayDifference > 1) {
      await AsyncStorage.setItem('lastLoginDate', currentDate);
      await AsyncStorage.setItem('dayStreak', '1');
    }
  }
};
