import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import notifee, {EventType, AndroidImportance} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Amplify} from 'aws-amplify';
import {AWS_IDENTITY_POOL_ID, AWS_REGION, AWS_S3_BUCKET} from '@env';

Amplify.configure({
  Auth: {
    identityPoolId: AWS_IDENTITY_POOL_ID,
    region: AWS_REGION,
  },
  Storage: {
    AWSS3: {
      bucket: AWS_S3_BUCKET,
      region: AWS_REGION,
    },
  },
});

notifee.createChannel({
  id: 'high-priority',
  name: 'Default Notifications',
  importance: AndroidImportance.HIGH,
});

messaging().setBackgroundMessageHandler(async remoteMessage => {
  await notifee.displayNotification({
    title: remoteMessage.notification?.title,
    body: remoteMessage.notification?.body,
    android: {channelId: 'high-priority'},
  });
});


notifee.onBackgroundEvent(async ({type, detail}) => {
  const {notification, pressAction} = detail;

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && pressAction.id === 'mark-as-read') {
    // Remove the notification
    await notifee.cancelNotification(notification.id);
  }
});

AppRegistry.registerComponent(appName, () => App);
