import {StyleSheet} from 'react-native';
import React from 'react';
import ScrollableWrapper from '../components/ScrollableWrapper';
import Text from '../components/Text';

const TermsOfUse = () => {
  return (
    <ScrollableWrapper
      headerTitle="Terms of Use"
      contentContainerStyle={styles.container}>
      <Text>{`Trash2Cash (T2C) is a mobile application that incentivizes users to remove litter from the environment. Users take pictures of trash being properly disposed of and receive rewards at businesses partnered with the app.

Users of T2C must be at least 18 years old or have the permission of a parent or legal guardian to use the app. Users must also comply with all applicable laws and regulations in their use of the app.

Users of T2C are solely responsible for their own safety while using the app. Users are responsible for their own actions while collecting trash and must take appropriate precautions to ensure their own safety.

T2C partners with businesses to provide rewards to users who properly dispose of litter. T2C is not responsible for the quality or availability of rewards provided by partner businesses.

T2C makes no representation or warranty of any kind, express or implied, regarding the app or the rewards provided by partner businesses. T2C is not responsible for any injury, loss, or damage caused by or resulting from the use of the app or the collection of litter. Users of T2C agree to indemnify and hold harmless T2C and its affiliates, officers, agents, and employees from any claim or demand, including reasonable attorneys' fees, made by any third party due to or arising out of the user's use of the app.

T2C may revise these Terms of Use at any time without notice. By using the app, you are agreeing to be bound by the current version of these Terms of Use.

These Terms of Use shall be governed by and construed in accordance with the laws of the United States of America, without giving effect to any principles of conflicts of law.

By using T2C, you agree to be bound by these Terms of Use. If you do not agree to these Terms of Use, do not use the app.`}</Text>
    </ScrollableWrapper>
  );
};

export default TermsOfUse;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
