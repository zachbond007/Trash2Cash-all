import {Linking, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import ScrollableWrapper from '../components/ScrollableWrapper';
import Text from '../components/Text';
import Colors from '../assets/Colors';

const AboutUs = () => {
  const handleLinkPress = () => {
    Linking.openURL(`mailto:partners@trash2cash.us`);
  };
  return (
    <ScrollableWrapper
      headerTitle="About Us"
      contentContainerStyle={styles.container}>
      <Text>{`Trash2Cash’s mission is to turn litter in the environment into a valuable currency. Doing this by giving consumers discounts for removing litter, thus creating revenue for businesses all by removing trash from our beautiful environments!

What you’re using is our first product!! We’re excited for you to be on this mission with us, together we can change the world. 

Want to sign your own business up? Have any feedback for us? Please reach out!
`}</Text>
      <TouchableOpacity onPress={handleLinkPress}>
        <Text color={Colors.blue}>{'partners@trash2cash.us'}</Text>
      </TouchableOpacity>
    </ScrollableWrapper>
  );
};

export default AboutUs;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
});
