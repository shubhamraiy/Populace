import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Navigation, NavigationComponentProps } from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import { color, fontFamily, fontSize } from '@styles';
import { Utils } from '@Utils';
import MyTextInput from '@components/MyTextInput';
import CustomButton from '@components/CustomButton';
import { Navigator } from '@Navigator';
import { screenName } from '@screenName';
import { ApiServices } from 'services/ApiServices';
import { ApiEndPoint } from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps { }

const EditAddress: React.FC<Props> = props => {
  const [user, setUser] = useState({});
  const [street, setStreet] = useState('');
  const [streetName, setStreetName] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: async () => {
          Utils._getUserData().then(user => {
            setUser(user)
            setStreet(user?.street)
            setStreetName(user?.streetname)
            setCity(user?.city)
            setState(user?.state)
            setZip(user?.zip?.toString())
          })
        }
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);

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

  const onSubmit = async (street: string, streetName: string, city: string, state: string, zip: string) => {
    if (isValidate()) {
      const raw = JSON.stringify({
        id: await Utils._getUserId(),
        street: street,
        streetName: streetName,
        city: city,
        state: state,
        zip: zip,
      });
      const result: any = await ApiServices.post(ApiEndPoint.updateAddress, raw);
      if (result.status) {
        let userData: any = { ...user };
        userData.street = result?.data?.street;
        userData.streetname = result?.data?.streetname;
        userData.city = result?.data?.city;
        userData.state = result?.data?.state;
        userData.zip = result?.data?.zip;
        await Utils._setUserData(userData);
        Navigator.setPop(props.componentId);
      }
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
        onPress={() => onSubmit(street, streetName, city, state, zip)}
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
