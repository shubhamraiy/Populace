import {ImageBackground, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {Utils} from '@Utils';
import CustomButton from '@components/CustomButton';
import {color, fontSize, fontFamily} from '@styles';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from 'services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';
import {MyAsyncStorage} from '@MyAsyncStorage';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const Verification: React.FC<Props> = props => {
  const {propsData} = props;

  return (
    <MySafeArea componentId={props.componentId} isBottomBgShow>
      <View style={styles.container}>
        <ImageBackground
          style={styles.imgContainer}
          resizeMode="stretch"
          source={require('@images/register_bg_popup.png')}>
          <Text style={styles.tvRegister}>
            {propsData?.isEmailChanged ? 'Email Verification' : 'Registration'}
          </Text>
          <Text style={styles.tvTitle}>
            {propsData?.isEmailChanged
              ? 'Email verification reset link sent to your email address'
              : 'A verification email has been sent to your email address. Please verify your account in order to complete the registration process.'}
          </Text>

          <CustomButton
            backgroundColor={color.white}
            titleColor={color.egyptianBlue}
            title={'OK'}
            onPress={async () => {
              if (propsData?.isEmailChanged) {
                Navigator.showAlert(
                  'Changing email address, need to login again.',
                );
                const result: any = await ApiServices.post(
                  ApiEndPoint.playerLogout,
                  JSON.stringify({email: await Utils.getEmail()}),
                );
                if (result?.status) {
                  await MyAsyncStorage.logOut();
                }
              } else {
                // if (await Utils.isSubscribe()) {
                //   Navigator.setHome();
                // } else {
                //   Navigator.setRoot(screenName.Subscription, { isShow: true });
                // }
                Navigator.setRoot(screenName.Auth, {isShow: true});
              }
            }}
          />
        </ImageBackground>
      </View>
    </MySafeArea>
  );
};

export default Verification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  imgContainer: {
    height: Utils.calculateHeight(335),
    // width: Utils.calculateWidth(354),
    justifyContent: 'space-around',
    paddingHorizontal: Utils.calculateWidth(47),
  },
  tvRegister: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
  },
  tvTitle: {
    color: color.white,
    fontSize: fontSize.size_16,
    fontFamily: fontFamily.Medium,
    // textAlign: 'center',
  },
});
