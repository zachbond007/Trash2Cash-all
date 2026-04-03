import {Linking, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import ScrollableWrapper from '../components/ScrollableWrapper';
import Text from '../components/Text';
import Colors from '../assets/Colors';

const PrivacyPolicy = () => {
  const handleLinkPress = () => {
    Linking.openURL(`mailto:info@trash2cash.com`);
  };
  return (
    <ScrollableWrapper
      headerTitle="Privacy Policies"
      contentContainerStyle={styles.container}>
      <Text>{`We may collect information such as your name, email address, and phone number when you create an account with us.

  •  User Content: We may collect photos that you upload to our app.
  •  Location Information: We may collect your device's location information when you use our app.

We may use the information we collect about you for the following purposes:

  •  To provide and improve our app.
  •  To personalize your experience on our app.
  •  To communicate with you about your account or our app.
  •  To respond to your inquiries or requests.
  •  To provide rewards to you at partnered businesses.
  •  To comply with legal obligations or as otherwise permitted by law.

We may share your information with the following third parties:

  •  Partnered businesses who provide rewards to you.
  •  Service providers who perform services on our behalf.
  •  Other users of our app as necessary for the functioning of the app.
  •  As required by law or to protect our rights or the rights of others.

Your Choices
You may choose to limit the information you provide to us or disable location tracking on your device, but this may limit your ability to use certain features of our app.

Security
We take reasonable measures to protect your personal information from unauthorized access, disclosure, or destruction.

Changes to this Policy
We may revise this Privacy Policy at any time without notice. By using our app, you are agreeing to be bound by the current version of this Privacy Policy.

Contact Us
If you have any questions or concerns about this Privacy Policy, please contact us at`}</Text>
      <TouchableOpacity onPress={handleLinkPress}>
        <Text color={Colors.blue}>{'[info@trash2cash.com]'}</Text>
      </TouchableOpacity>
    </ScrollableWrapper>
  );
};

export default PrivacyPolicy;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
