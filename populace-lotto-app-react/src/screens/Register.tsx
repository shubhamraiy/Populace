import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import MyTextInput from '@components/MyTextInput';
import {Utils} from '@Utils';
import {color, fontFamily, fontSize} from '@styles';
import CustomButton from '@components/CustomButton';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const Register: React.FC<Props> = props => {
  const {propsData} = props;
  const names = propsData?.name?.split(' ');
  const [firstName, setFirstName] = useState(names?.length > 0 ? names[0] : '');
  const [lastName, setLastName] = useState(names?.length > 0 ? names[1] : '');
  const [street, setStreet] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const isValidate = () => {
    if (Utils.isEmpty(firstName)) {
      Navigator.showAlert('Please enter first name');
      return false;
    } else if (Utils.isEmpty(lastName)) {
      Navigator.showAlert('Please enter last name');
      return false;
    } else if (Utils.isEmpty(street)) {
      Navigator.showAlert('Please enter street');
      return false;
    } else if (Utils.isEmpty(streetName)) {
      Navigator.showAlert('Please enter street name');
      return false;
    } else if (Utils.isEmpty(city)) {
      Navigator.showAlert('Please enter city name');
      return false;
    } else if (Utils.isEmpty(state)) {
      Navigator.showAlert('Please enter state name');
      return false;
    } else if (Utils.isEmpty(zip)) {
      Navigator.showAlert('Please enter zip name');
      return false;
    } else {
      return true;
    }
  };

  const onNext = () => {
    if (isValidate()) {
      const sendData = {
        firstName,
        lastName,
        street,
        streetName,
        city,
        state,
        zip,
        email: propsData?.email,
        token: propsData?.token,
        isGoogle: propsData?.isGoogle,
        isApple: propsData?.isApple,
      };
      Navigator.setPush(props.componentId, screenName.RegisterSubmit, sendData);
    }
  };

  return (
    <MySafeArea componentId={props.componentId} isScroll={true}>
      <View>
        <Text style={styles.tvRegister}>Registration</Text>

        <MyTextInput
          value={firstName}
          placeholder="First Name"
          marginTop={Utils.calculateHeight(18)}
          onChangeText={setFirstName}
        />
        <MyTextInput
          value={lastName}
          placeholder="Last Name"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setLastName}
        />
        <MyTextInput
          value={street}
          placeholder="Street"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setStreet}
        />
        <MyTextInput
          value={streetName}
          placeholder="Street Name"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setStreetName}
        />
        <MyTextInput
          value={city}
          placeholder="City"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setCity}
        />
        <MyTextInput
          value={state}
          placeholder="State"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setState}
        />
        <MyTextInput
          value={zip}
          placeholder="Zip"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setZip}
          keyboardType={'number-pad'}
        />

        <CustomButton
          title={'Next'}
          marginTop={Utils.calculateHeight(46)}
          onPress={() => onNext()}
        />
      </View>
    </MySafeArea>
  );
};

export default Register;

const styles = StyleSheet.create({
  tvRegister: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(80),
  },
});
