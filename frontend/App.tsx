import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import RootNav from './src/navigation';
import store from './src/redux/store';
import {Provider} from 'react-redux';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import {Settings} from 'react-native-fbsdk-next';
import Toast from 'react-native-toast-message';
import {toastConfig} from './src/utils/toastConfig';
import {GOOGLE_API_KEY, IOS_APP_ID, APPFLYER_DEV_KEY} from '@env';
import messaging from '@react-native-firebase/messaging';
import notifee, {EventType} from '@notifee/react-native';
import SplashScreen from 'react-native-splash-screen';
import {Platform} from 'react-native';
import appsFlyer from 'react-native-appsflyer';

appsFlyer.initSdk(
  {
    devKey: APPFLYER_DEV_KEY,
    isDebug: false,
    appId: IOS_APP_ID,
    onInstallConversionDataListener: false, //Optional
    onDeepLinkListener: true, //Optional
    timeToWaitForATTUserAuthorization: 10, //for iOS 14.5
  },
  result => {
    console.log(result);
  },
  error => {
    console.error(error);
  },
);
const App = () => {
  // AsyncStorage.clear();
  useEffect(() => {
    if (Platform.OS === 'android') {
      SplashScreen.hide();
    }
    return notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          break;
      }
    });
  }, []);
  useEffect(() => {
    GoogleSignin.configure({webClientId: GOOGLE_API_KEY});
    Settings.initializeSDK();
    const onMessageReceived = async (message: any) => {
      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Default Channel',
      });
      await notifee.displayNotification({
        title: message.notification?.title,
        body: message.notification?.body,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
      });
    };

    messaging().onMessage(onMessageReceived);
    messaging().setBackgroundMessageHandler(onMessageReceived);
  }, []);

  return (
    <SafeAreaProvider style={{flex: 1}}>
      <Provider store={store}>
        <RootNav />
      </Provider>
      <Toast topOffset={0} config={toastConfig} />
    </SafeAreaProvider>
  );
};

export default App;
