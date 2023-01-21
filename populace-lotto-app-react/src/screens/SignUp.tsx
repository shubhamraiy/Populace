import { Platform, StyleSheet, View } from 'react-native';
import React, { useEffect } from 'react';
import MySafeArea from '@components/MySafeArea';
import { NavigationComponentProps } from 'react-native-navigation';
import CustomButton from '@components/CustomButton';
import { Utils } from '@Utils';
import { color } from '@styles';
import { Navigator } from '@Navigator';
import { screenName } from '@screenName';
import TermsCondition from '@components/TermsCondition';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { ApiServices } from '../services/ApiServices';
import { ApiEndPoint } from '../services/ApiEndPoint';
import appleAuth from '@invertase/react-native-apple-authentication';

export interface Props extends NavigationComponentProps { }

const SignUp: React.FC<Props> = props => {
  useEffect(() => {
    GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '906490794599-pmjoevuqtuidpqlmgb6874mc0466p098.apps.googleusercontent.com',
      offlineAccess: true,
      iosClientId: '906490794599-fqhvr8uoc9lobcs04huqpbt0hehmc2n1.apps.googleusercontent.com'
    });
  }, []);

  const _socialLogin = async (
    email: string | undefined,
    token: string | null,
    isGoogle: boolean,
    isApple: boolean,
    name?: string | null | undefined,
  ) => {
    const raw = JSON.stringify({
      email: email,
      token: token,
      isGoogleRegister: isGoogle,
      isAppleRegister: isApple,
    });
    const result: any = await ApiServices.post(ApiEndPoint.socialLogin, raw);
    if (result.status && result?.data?.isRegistered) {
      await Utils._setUserData(result?.data);
      if (result?.data?.isSubscribe) {
        Navigator.setHome();
      } else {
        Navigator.setRoot(screenName.Subscription, { isShow: true });
      }
    } else if (result.status && result?.data?.isRegistered === false) {
      Navigator.setPush(props.componentId, screenName.Register, {
        email,
        name,
        token,
        isGoogle,
        isApple,
      });
    }
  };
  const signInApple = async () => {
    // performs login request
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
    });

    // console.log(appleAuthRequestResponse);
    // get current authentication state for user
    // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
    const credentialState = await appleAuth.getCredentialStateForUser(
      appleAuthRequestResponse.user,
    );

    // use credentialState response to ensure the user is authenticated
    if (credentialState === appleAuth.State.AUTHORIZED) {
      // user is authenticated
      _socialLogin(
        appleAuthRequestResponse?.email ?? '',
        appleAuthRequestResponse?.user,
        false,
        true,
        `${appleAuthRequestResponse?.fullName?.givenName} ${appleAuthRequestResponse?.fullName?.familyName}`,
      );
    }
  };

  const _signInGoogle = async () => {
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      await _socialLogin(
        result?.user?.email,
        result.user?.id,
        true,
        false,
        result?.user?.name,
      );
      // console.log(result);
    } catch (error: any) {
      // console.log(error);
    }
  };

  return (
    <MySafeArea componentId={props.componentId} isBottomBgShow>
      <View style={styles.container}>
        {Platform.OS === 'ios' && (
          <CustomButton
            title={'Sign up with Apple'}
            // marginTop={Utils.calculateHeight(30)}
            titleColor={color.black}
            iconLeft={require('@images/ic_apple.png')}
            marginIconEnd={Utils.calculateWidth(24)}
            backgroundColor={color.white}
            onPress={() => signInApple()}
          />
        )}

        <CustomButton
          title={'Sign up with Google'}
          marginTop={Utils.calculateHeight(30)}
          iconLeft={require('@images/ic_google.png')}
          marginIconEnd={Utils.calculateWidth(19)}
          backgroundColor={color.venetianRed}
          onPress={() => _signInGoogle()}
        />

        <CustomButton
          title={'Sign up with Email'}
          marginTop={Utils.calculateHeight(30)}
          iconLeft={require('@images/ic_mail.png')}
          marginIconEnd={Utils.calculateWidth(25)}
          backgroundColor={color.egyptianBlue}
          onPress={() =>
            Navigator.setPush(props.componentId, screenName.Register)
          }
        />

        <TermsCondition componentId={props.componentId} />
      </View>
    </MySafeArea>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    // paddingHorizontal: 30,
  },
});
