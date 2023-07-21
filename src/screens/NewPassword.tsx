import {StyleSheet, Text, View} from 'react-native';
import React, {useState} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import CustomButton from '@components/CustomButton';
import MyTextInput from '@components/MyTextInput';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';

export interface Props extends NavigationComponentProps {}
const NewPassword: React.FC<Props> = props => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const _onSubmit = () => {
    if (Utils.isEmpty(password)) {
      Navigator.showAlert('Please enter new password');
    } else if (Utils.isEmpty(confirmPassword)) {
      Navigator.showAlert('Please enter confirm new password');
    } else if (password !== confirmPassword) {
      Navigator.showAlert('Password and confirm password does not match!');
    } else {
      Navigator.setRoot(screenName.SignIn);
    }
  };

  return (
    <MySafeArea componentId={props.componentId} isScroll>
      <Text style={styles.tvTitle}>Create New Password</Text>

      <MyTextInput
        value={password}
        placeholder="New Password"
        marginTop={87}
        onChangeText={setPassword}
        secureTextEntry
      />
      <MyTextInput
        value={confirmPassword}
        placeholder="Confirm New Password"
        marginTop={8}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />

      <CustomButton
        title={'Submit'}
        marginTop={75}
        onPress={() => _onSubmit()}
      />
    </MySafeArea>
  );
};

export default NewPassword;

const styles = StyleSheet.create({
  tvTitle: {
    marginTop: Utils.calculateHeight(92),
    color: color.white,
    fontFamily: fontFamily.SemiBold,
    fontSize: fontSize.size_18,
    textAlign: 'center',
  },
});
