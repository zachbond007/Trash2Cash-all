import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
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
import {updateUserData, uploadProfileImage} from '../api/user';
import {Asset, launchImageLibrary} from 'react-native-image-picker';
import {s3BaseUrl} from '../api/common/Config';
import {compressImage} from '../utils/ImageHelper';
import {useNavigation} from '@react-navigation/native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {MainStackParams} from '../types';

const EditProfile = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParams>>();
  const dispatch = useAppDispatch();
  const {user} = useAppSelector(state => state.app);
  const [name, setName] = useState(user!.name);
  const [username, setUsername] = useState(user!.username);
  const [birthday, setBirthday] = useState<Date>(user!.birthday);
  const [avatar, setAvatar] = useState<Asset>();
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  // const calculatedBirthday = formatDate(birthday);

  const openGallery = async () => {
    const image = await launchImageLibrary({
      mediaType: 'photo',
    });
    if (image.assets) {
      setAvatar(image.assets[0]);
    }
  };

  const onSubmitChanges = async () => {
    let imageKey = '';
    if (avatar) {
      const compressedAvatarUri = await compressImage(avatar.uri!);
      imageKey = await uploadProfileImage(compressedAvatarUri);
      if (!imageKey) {
        Toast.show({
          type: 'error',
          text1: 'Image upload failed',
          text2: 'Please try a different photo.',
        });
        return;
      }
    }
    await updateUserData({
      name,
      username,
      ...(imageKey && {avatar: imageKey}),
    });
    dispatch(
      updateUser({
        name,
        username,
        ...(imageKey && {avatar: imageKey}),
        // birthday,
      }),
    );
    Toast.show({
      type: 'success',
      text1: 'Profile Updated',
      text2: 'Your profile has been successfully updated',
    });
    navigation.goBack();
  };
  const isSubmitDisabled =
    !name ||
    !username ||
    (username === user?.username &&
      // birthday === user?.birthday &&
      name === user?.name &&
      !avatar);
  const avatarUri = avatar?.uri
    ? avatar.uri
    : user?.isSocialUser
    ? (user.avatar as string)
    : user?.avatar
    ? s3BaseUrl + user.avatar
    : '';
  return (
    <ScrollableWrapper
      headerTitle="Edit Profile"
      contentContainerStyle={styles.container}>
      <View style={styles.profilePictureContainer}>
        <TouchableOpacity
          onPress={openGallery}
          style={styles.profilePictureWrapper}>
          {!!avatarUri && (
            <Image
              source={{uri: avatarUri}}
              resizeMode="cover"
              style={styles.profilePicture}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={openGallery} style={styles.profilePictureTextButton}>
          <Text
            color={Colors.mediumGray}
            fontSize={12}
            fontWeight="500"
            style={styles.profilePictureTitle}>
            {avatarUri ? 'change profile pic' : '+ add profile pic'}
          </Text>
        </TouchableOpacity>
      </View>
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
  profilePictureContainer: {
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 8,
  },
  profilePictureWrapper: {
    borderWidth: 4,
    borderColor: Colors.grayBorder,
    borderRadius: 99,
    height: 112,
    width: 112,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profilePicture: {
    borderRadius: 99,
    position: 'absolute',
    width: '100%',
    height: '100%',
  },
  profilePictureTextButton: {
    marginTop: 8,
  },
  profilePictureTitle: {
    textAlign: 'center',
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
