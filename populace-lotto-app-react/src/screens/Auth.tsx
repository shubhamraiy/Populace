import {Platform, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import MySafeArea from '@components/MySafeArea';
import {NavigationComponentProps} from 'react-native-navigation';
import CustomButton from '@components/CustomButton';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';

export interface Props extends NavigationComponentProps {}

const Auth: React.FC<Props> = props => {
  return (
    <MySafeArea
      componentId={props.componentId}
      isHideBack={true}
      isScroll={false}>
      <Text style={styles.tvSignUpTitle}>
        {'"Sign up below or click below\nto see how it works"'}
      </Text>
      <CustomButton
        title={'Sign Up'}
        marginTop={Utils.calculateHeight(Platform.OS === 'ios' ? 145 : 100)}
        onPress={() => Navigator.setPush(props.componentId, screenName.SignUp)}
      />
      <CustomButton
        title={'Sign In'}
        marginTop={Utils.calculateHeight(30)}
        backgroundColor={color.egyptianBlue}
        onPress={() => Navigator.setPush(props.componentId, screenName.SignIn)}
      />
      <View style={styles.howItWorksBtnContainer}>
        <CustomButton
          // marginTop={Utils.calculateHeight(134)}
          title={'How it works'}
          iconLeft={require('@images/ic_setting.png')}
          onPress={() =>
            Navigator.setPush(props.componentId, screenName.HowItWork, {
              isBottomShow: true,
            })
          }
        />
      </View>
    </MySafeArea>
  );
};

export default Auth;

const styles = StyleSheet.create({
  tvSignUpTitle: {
    marginTop: Utils.calculateHeight(100),
    // backgroundColor:'red',
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.Medium,
    color: color.celticBlue,
    textAlign: 'center',
  },

  howItWorksBtnContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    // marginBottom: 10
  },
});
