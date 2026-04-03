import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import ScrollableWrapper from '../components/ScrollableWrapper';
import TextInput from '../components/TextInput';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {formatDate} from '../utils/DateHelper';
import {useAppDispatch, useAppSelector} from '../redux/store';
import Text from '../components/Text';
import Colors from '../assets/Colors';
import Button from '../components/Button';
import {updateUser} from '../redux/slices/appSlice';
import Toast from 'react-native-toast-message';
import {updateUserData} from '../api/user';

const EditProfile = () => {
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.app);
  const [name, setName] = useState(user!.name);
  const [username, setUsername] = useState(user!.username);
  const [birthday, setBirthday] = useState<Date>(user!.birthday);
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  // const calculatedBirthday = formatDate(birthday);

  const onSubmitChanges = async () => {
    await updateUserData({
      name,
      username,
    });
    dispatch(
      updateUser({
        name,
        username,
        // birthday,
      }),
    );
    Toast.show({
      type: 'success',
      text1: 'Profile Updated',
      text2: 'Your profile has been successfully updated',
    });
  };
  const isSubmitDisabled =
    !name ||
    !username ||
    (username === user?.username &&
      // birthday === user?.birthday &&
      name === user?.name);
  return (
    <ScrollableWrapper
      headerTitle="Edit Profile"
      contentContainerStyle={styles.container}>
      <TextInput
        title="Name"
        containerStyle={styles.formInput}
        placeholder="Your name"
        value={name}
        onChangeText={text => setName(text)}
      />
      <TextInput
        title="Email Address"
        containerStyle={styles.formInput}
        value={user?.email}
        editable={false}
      />
      <TextInput
        title="Username"
        containerStyle={styles.formInput}
        placeholder="Username"
        value={username}
        onChangeText={text => setUsername(text)}
      />
      {/* <View style={styles.formInput}>
        <Text color={Colors.mediumGray} style={styles.birthdayTitle}>
          {'Birthday'}
        </Text>
        <TouchableOpacity
          style={styles.birthdayContainer}
          onPress={() => setIsDatePickerVisible(true)}>
          <Text>{calculatedBirthday}</Text>
        </TouchableOpacity>
      </View> */}
      <Button
        disabled={isSubmitDisabled}
        onPressButton={onSubmitChanges}
        title="Update Profile"
        containerStyle={styles.submitButtonContainer}
      />
      {isDatePickerVisible && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={date => {
            setBirthday(date);
            setIsDatePickerVisible(false);
          }}
          onCancel={() => setIsDatePickerVisible(false)}
          date={birthday}
          maximumDate={new Date()}
        />
      )}
    </ScrollableWrapper>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  formInput: {
    marginTop: 16,
  },
  birthdayTitle: {
    marginLeft: 24,
    marginBottom: 8,
  },
  birthdayContainer: {
    backgroundColor: Colors.textInputBackground,
    borderRadius: 99,
    height: 56,
    justifyContent: 'center',
    paddingLeft: 24,
  },
  submitButtonContainer: {
    marginTop: 60,
    marginHorizontal: 20,
  },
});
