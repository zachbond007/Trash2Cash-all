import React, {useEffect} from 'react';
import {AppStackParams, MainStackParams} from '../types';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import TabBar from '../components/Navigation/TabBar';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';
import Home from '../screens/Home';
import HuntVerification from '../screens/HuntVerification';
import Marketplace from '../screens/Marketplace';
import Profile from '../screens/Profile';
import Header from '../components/Header';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import Settings from '../screens/Settings';
import AboutUs from '../screens/AboutUs';
import TermsOfUse from '../screens/TermsOfUse';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import EditProfile from '../screens/EditProfile';
import {useAppSelector} from '../redux/store';
import {checkDayStreak} from '../utils/DayStreakHelper';

const AppStack = createBottomTabNavigator<AppStackParams>();
const MainStack = createNativeStackNavigator<MainStackParams>();

const AppNavigator = () => {
  const insets = useSafeAreaInsets();
  useEffect(() => {
    const prepareData = async () => {
      await checkDayStreak();
    };
    prepareData();
  }, []);
  return (
    <MainStack.Navigator>
      <MainStack.Screen
        name="TabsRoot"
        component={TabNavigator}
        options={{
          header: () => <Header containerStyle={{marginTop: insets.top}} />,
        }}
      />
      <MainStack.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="Settings"
        component={Settings}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="AboutUs"
        component={AboutUs}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="TermsOfUse"
        component={TermsOfUse}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicy}
        options={{headerShown: false}}
      />
      <MainStack.Screen
        name="EditProfile"
        component={EditProfile}
        options={{headerShown: false}}
      />
    </MainStack.Navigator>
  );
};

const TabNavigator = () => {
  const {loggedIn} = useAppSelector(state => state.app);
  return (
    <AppStack.Navigator
      initialRouteName={'Home'}
      tabBar={props => <TabBar {...props} />}
      screenOptions={{headerShown: false}}>
      <AppStack.Screen name="HuntVerification" component={HuntVerification} />
      <AppStack.Screen name="Home" component={Home} />
      <AppStack.Screen name="Marketplace" component={Marketplace} />
    </AppStack.Navigator>
  );
};

const styles = StyleSheet.create({});

export default AppNavigator;
