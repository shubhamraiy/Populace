import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import MyTextInput from '@components/MyTextInput';
import CustomButton from '@components/CustomButton';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';

export interface Props extends NavigationComponentProps {}

const EditProfile: React.FC<Props> = props => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');


  const isValidate = () => {
    if (Utils.isEmpty(firstName)) {
      Navigator.showAlert('Please enter first name');
      return false;
    } else if (Utils.isEmpty(lastName)) {
      Navigator.showAlert('Please enter last name');
      return false;
    } else if (Utils.isEmpty(email)) {
      Navigator.showAlert('Please enter email address');
      return false;
    } else if (!Utils.isEmailValid(email)) {
      Navigator.showAlert('Please enter valid email address');
      return false;
    } else if (Utils.isEmpty(phone)) {
      Navigator.showAlert('Please enter phone number');
      return false;
    } else if (phone.trim().length !== 10) {
      Navigator.showAlert('Please enter valid phone number');
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = () => {
    if (isValidate()) {
      Navigator.setPop(props.componentId);
    }
  };

  return (
    <MySafeArea componentId={props.componentId}>
      <View style={styles.container}>
        <Text style={styles.tvProfile}>Profile</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginTop: 36,
          }}>
          <MyTextInput
            width={'48%'}
            value={firstName}
            placeholder="First Name"
            onChangeText={setFirstName}
          />
          <MyTextInput
            width={'48%'}
            value={lastName}
            placeholder="Last Name"
            onChangeText={setLastName}
          />
        </View>
        <MyTextInput
          value={email}
          placeholder="Email Address"
          marginTop={10}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <MyTextInput
          value={phone}
          placeholder="Phone Number"
          marginTop={10}
          onChangeText={setPhone}
          maxLength={10}
          keyboardType="phone-pad"
        />

        <CustomButton
          title={'Submit'}
          marginTop={Utils.calculateHeight(60)}
          onPress={() => onSubmit()}
        />
      </View>
    </MySafeArea>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginTop: 36
  },

  tvProfile: {
    marginTop:30,
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
  },
});
