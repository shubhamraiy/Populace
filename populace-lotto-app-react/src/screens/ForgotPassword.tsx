import {Alert, StyleSheet, Text} from 'react-native';
import React, {useState} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import MyTextInput from '@components/MyTextInput';
import CustomButton from '@components/CustomButton';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from '../services/ApiEndPoint';

export interface Props extends NavigationComponentProps {}

const ForgotPassword: React.FC<Props> = props => {
  const [email, setEmail] = useState('');

  const _onSubmit = async () => {
    if (Utils.isEmpty(email)) {
      Navigator.showAlert('Please enter email');
    } else if (!Utils.isEmailValid(email)) {
      Navigator.showAlert('Please enter valid email');
    } else {
      const result: any = await ApiServices.post(
        ApiEndPoint.forgetPassword,
        JSON.stringify({email:email}),
      );
      if (result?.status) {
        Alert.alert(
          'Alert!',
          result?.message ?? 'Password reset link sent to your email address',
          [
            {
              text: 'OK',
              onPress: () => Navigator.setPop(props.componentId),
            },
          ],
          {cancelable: false},
        );
      }
    }
  };

  return (
    <MySafeArea componentId={props.componentId} isScroll isBottomBgShow={true}>
      <Text style={styles.tvTitle}>Forgot Password</Text>
      <Text style={styles.tvSubTitle}>
        Please enter your email address below. You’ll be sent an email with a
        link to obtain the new password.
      </Text>

      <MyTextInput
        value={email}
        placeholder="Email"
        marginTop={60}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      <CustomButton
        title={'Submit'}
        marginTop={60}
        onPress={() => _onSubmit()}
      />
    </MySafeArea>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  tvTitle: {
    marginTop: 30,
    color: color.white,
    fontFamily: fontFamily.SemiBold,
    fontSize: fontSize.size_18,
    textAlign: 'center',
  },
  tvSubTitle: {
    marginTop: 67,
    color: color.white,
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.size_12,
  },
});
