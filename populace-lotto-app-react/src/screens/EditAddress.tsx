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

const EditAddress: React.FC<Props> = props => {
  const [street, setStreet] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  const isValidate = () => {
    if (Utils.isEmpty(street)) {
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

  const onSubmit = () => {
    if (isValidate()) {
      Navigator.setPush(props.componentId, screenName.Verification);
    }
  };


  return (
    <MySafeArea componentId={props.componentId} isScroll={true}>
      <Text style={styles.tvAddressInfo}>Address Info</Text>

      <MyTextInput
        value={street}
        placeholder="Street"
        marginTop={Utils.calculateHeight(36)}
        onChangeText={setStreet}
      />
      <MyTextInput
        value={streetName}
        placeholder="Street Name"
        marginTop={Utils.calculateHeight(8)}
        onChangeText={setStreetName}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: Utils.calculateHeight(8),
        }}>
        <MyTextInput
          width={'48%'}
          value={city}
          placeholder="City"
          onChangeText={setCity}
        />
        <MyTextInput
          width={'48%'}
          value={state}
          placeholder="State"
          onChangeText={setState}
        />
      </View>

      <MyTextInput
        value={zip}
        placeholder="Zip"
        marginTop={Utils.calculateHeight(8)}
        onChangeText={setZip}
        keyboardType={'number-pad'}
      />

      <CustomButton
        title={'Submit'}
        marginTop={Utils.calculateHeight(60)}
        onPress={() => onSubmit()}
      />
    </MySafeArea>
  );
};

export default EditAddress;

const styles = StyleSheet.create({
  tvAddressInfo: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(70),
  },
});
