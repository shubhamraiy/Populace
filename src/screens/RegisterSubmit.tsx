import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import MyTextInput from '@components/MyTextInput';
import {Utils} from '@Utils';
import {color, fontFamily, fontSize} from '@styles';
import CustomButton from '@components/CustomButton';
import TermsCondition from '@components/TermsCondition';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from '../services/ApiEndPoint';
import {KeyboardAwareView} from 'react-native-keyboard-aware-view';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const RegisterSubmit: React.FC<Props> = props => {
  const {propsData} = props;

  const [email, setEmail] = useState(propsData?.email ?? '');
  const [phone, setPhone] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showEye, setShowEye] = useState(false);
  const eye = require('@images/eye.png');
  const blind = require('@images/blind.png');

  const isValidate = () => {
    if (Utils.isEmpty(email)) {
      Navigator.showAlert('Please enter email address');
      return false;
    } else if (!Utils.isEmailValid(email)) {
      Navigator.showAlert('Please enter valid email address');
      return false;
    } else if (Utils.isEmpty(phone)) {
      Navigator.showAlert('Please enter phone number');
      return false;
    } else if (phone.trim().length != 10) {
      Navigator.showAlert('Please enter valid phone number');
      return false;
    } else if (Utils.isEmpty(password)) {
      Navigator.showAlert('Please enter password');
      return false;
    } else if (Utils.isEmpty(confirmPassword)) {
      Navigator.showAlert('Please enter confirm password');
      return false;
    } else if (password.trim() !== confirmPassword.trim()) {
      Navigator.showAlert('Password and confirm password does not match');
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async () => {
    if (isValidate()) {
      const raw = JSON.stringify({
        firstname: propsData?.firstname,
        lastname: propsData?.lastname,
        street: propsData?.street,
        streetname: propsData.streetname,
        city: propsData?.city,
        state: propsData?.state,
        zip: propsData?.zip,
        email: email?.toLowerCase(),
        phone: phone,
        password: password,
        confirmPassword: confirmPassword,
        isGoogleRegister: propsData?.isGoogle ?? false,
        isAppleRegister: propsData?.isApple ?? false,
        token: propsData?.token ?? undefined,
      });
      setLoading(true);
      // console.log(raw);

      await ApiServices.post(ApiEndPoint.register, raw)
        .then(async (result: any) => {
          console.log('onSubmit', JSON.stringify(result));

          if (result.status) {
            setLoading(false);
            if (result?.data?.emailVerified === true) {
              await Utils._setUserData(result?.data);
              // if (
              //   Object.keys(result?.data?.subscription).length > 0 &&
              //   (result?.data?.subscription?.status === 'active' ||
              //     result?.data?.subscription?.status === 'canceled')
              // ) {
              //   Navigator.setHome();
              //   Navigator.setMergeOption(screenName.Home, 2);
              // } else {
              Navigator.setRoot(screenName.Subscription, {isShow: true});
              // }
            } else {
              Navigator.setRoot(screenName.Verification);
            }
          }
        })
        .catch(err => {
          setLoading(false);
        });
    }
  };

  return (
    <KeyboardAwareView animated={true}>
      <MySafeArea componentId={props.componentId} isScroll={true}>
        <Text style={styles.tvRegister}>Registration</Text>

        <MyTextInput
          value={email}
          textInpStyle={{
            backgroundColor:
              propsData?.email !== undefined ? 'gray' : '#0C2271',
          }}
          editable={propsData?.email === undefined}
          placeholder="Email Address"
          marginTop={Utils.calculateHeight(18)}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
        <MyTextInput
          value={phone}
          placeholder="Phone Number"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={text => {
            if (text.match(/^\d+$/)) {
              setPhone(text);
            } else {
              setPhone('');
            }
          }}
          maxLength={10}
          keyboardType="phone-pad"
        />
        <MyTextInput
          value={password}
          placeholder="Password"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setPassword}
          secureTextEntry={!showEye}
          rightIcon={!showEye ? eye : blind}
          IconStyle={!showEye ? styles.eye : styles.blind}
          onPressIcon={() => setShowEye(!showEye)}
          style={styles.password}
        />
        <MyTextInput
          value={confirmPassword}
          placeholder="Confirm Password"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setConfirmPassword}
          secureTextEntry
        />

        <CustomButton
          title={'Submit'}
          marginTop={Utils.calculateHeight(79)}
          onPress={() => onSubmit()}
          isLoading={isLoading}
        />

        <TermsCondition componentId={props.componentId} />
        <View style={{marginVertical: 10}} />
      </MySafeArea>
    </KeyboardAwareView>
  );
};

export default RegisterSubmit;

const styles = StyleSheet.create({
  tvRegister: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(80),
  },
  eye: {
    tintColor: 'white',
    height: 25,
    width: 25,
    resizeMode: 'contain',
  },
  blind: {
    tintColor: 'white',
    height: 20,
    width: 20,
    resizeMode: 'contain',
  },
  password: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#0C2271',
    borderRadius: Utils.calculateHeight(5),
    paddingRight: Utils.calculateHeight(15),
    marginTop: 5,
  },
});
