import {Alert, StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import CustomButton from '@components/CustomButton';
import MyTextInput from '@components/MyTextInput';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps {}
const ChangePassword: React.FC<Props> = props => {
  const [oldPassword, setOldPassword] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setLoading] = useState(false);

  const _onSubmit = async () => {
    if (Utils.isEmpty(oldPassword)) {
      // Navigator.showAlert('Please enter old password');
      Alert.alert('Please enter old password');
    } else if (Utils.isEmpty(password)) {
      Alert.alert('Please enter new password');
    } else if (password !== confirmPassword) {
      // Navigator.showAlert('Password and confirm password does not match!');
      Alert.alert('Password and confirm password does not match!');
    } else {
      setLoading(true);
      const email = await Utils.getEmail();
      const json = JSON.stringify({
        email: email,
        password: oldPassword,
        newPassword: password,
      });
      await ApiServices.post(ApiEndPoint.changePassword, json)
        .then((result: any) => {
          if (result?.status) {
            Navigator.showAlert(result?.message, 'success');
            setTimeout(() => {
              setLoading(false);
              Navigator.setRoot(screenName.SignIn);
            }, 300);
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <MySafeArea componentId={props.componentId} isScroll>
      <Text style={styles.tvTitle}>Change Password</Text>

      <MyTextInput
        value={oldPassword}
        placeholder="Password"
        marginTop={Utils.calculateHeight(70)}
        onChangeText={setOldPassword}
        secureTextEntry
      />
      <MyTextInput
        value={password}
        placeholder="New Password"
        marginTop={Utils.calculateHeight(8)}
        onChangeText={setPassword}
        secureTextEntry
      />
      <MyTextInput
        value={confirmPassword}
        placeholder="Confirm New Password"
        marginTop={Utils.calculateHeight(8)}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <CustomButton
        isLoading={isLoading}
        title={'Submit'}
        marginTop={Utils.calculateHeight(60)}
        onPress={() => _onSubmit()}
      />
    </MySafeArea>
  );
};

export default ChangePassword;

const styles = StyleSheet.create({
  tvTitle: {
    marginTop: Utils.calculateHeight(92),
    color: color.white,
    fontFamily: fontFamily.SemiBold,
    fontSize: fontSize.size_18,
    textAlign: 'center',
  },
});
