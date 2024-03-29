import {
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import CheckBox from '@react-native-community/checkbox';
import React, {useEffect, useState} from 'react';
import MySafeArea from '@components/MySafeArea';
import {NavigationComponentProps} from 'react-native-navigation';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import CustomButton from '@components/CustomButton';
import MyTextInput from '@components/MyTextInput';
import TermsCondition from '@components/TermsCondition';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from '../services/ApiEndPoint';
import {GoogleSignin} from '@react-native-google-signin/google-signin';
import appleAuth from '@invertase/react-native-apple-authentication';
export interface Props extends NavigationComponentProps {}

const SignIn: React.FC<Props> = props => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // const [email, setEmail] = useState('shubham@yopmail.com');
  // const [password, setPassword] = useState('123456');
  const [isSelected, setSelection] = useState(true);
  const [isLoading, setLoading] = useState(false);
  const [showEye, setShowEye] = useState(false);
  const [isLoadingApple, setLoadingApple] = useState(false);
  const [isLoadingGoogle, setLoadingGoogle] = useState(false);
  const eye = require('@images/eye.png');
  const blind = require('@images/blind.png');

  useEffect(() => {
    GoogleSignin.configure({
      // scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '906490794599-pmjoevuqtuidpqlmgb6874mc0466p098.apps.googleusercontent.com',
      offlineAccess: true,
      iosClientId:
        '906490794599-fqhvr8uoc9lobcs04huqpbt0hehmc2n1.apps.googleusercontent.com',
    });
  }, []);

  const isValidate = () => {
    if (Utils.isEmpty(email)) {
      Navigator.showAlert('Please enter email address');
      return false;
    } else if (!Utils.isEmailValid(email)) {
      Navigator.showAlert('Please enter valid email address');
      return false;
    } else if (Utils.isEmpty(password)) {
      Navigator.showAlert('Please enter password');
      return false;
    } else {
      return true;
    }
  };

  const _socialLogin = async (
    email: string | undefined,
    token: string | null,
    identityToken: string | null,
    isGoogle: boolean,
    isApple: boolean,
    name?: string | null | undefined,
  ) => {
    const raw = JSON.stringify({
      email: email,
      token: token,
      identityToken: identityToken,
      isGoogleRegister: isGoogle,
      isAppleRegister: isApple,
    });

    await ApiServices.post(ApiEndPoint.socialLogin, raw)
      .then(async (result: any) => {
        if (result.status && result?.data?.isRegistered) {
          await Utils._setUserData(result?.data);
          if (
            Object.keys(result?.data?.subscription).length > 0 &&
            (result?.data?.subscription?.status === 'active' ||
              result?.data?.subscription?.status === 'canceled')
          ) {
            Navigator.setHome();
            Navigator.setMergeOption(screenName.Home, 2);
          } else {
            Navigator.setRoot(screenName.Subscription, {isShow: true});
          }
        } else if (result.status && result?.data?.isRegistered === false) {
          const toRegisterEmail = isApple ? result.data.email : email;
          Navigator.setPush(props.componentId, screenName.Register, {
            toRegisterEmail,
            name,
            identityToken,
            token,
            isGoogle,
            isApple,
          });
        }
        setLoadingApple(false);
        setLoadingGoogle(false);
      })
      .catch(() => {
        setLoadingApple(false);
        setLoadingGoogle(false);
      });
  };

  const signInApple = async () => {
    setLoadingApple(true);
    try {
      // performs login request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      console.log(appleAuthRequestResponse);
      // get current authentication state for user
      // /!\ This method must be tested on a real device. On the iOS simulator it always throws an error.
      const credentialState = await appleAuth.getCredentialStateForUser(
        appleAuthRequestResponse.user,
      );

      // use credentialState response to ensure the user is authenticated
      if (credentialState === appleAuth.State.AUTHORIZED) {
        // user is authenticated
        // console.log('credentialState:', credentialState);
        _socialLogin(
          appleAuthRequestResponse?.email ?? '',
          appleAuthRequestResponse?.user,
          appleAuthRequestResponse?.identityToken,
          false,
          true,
          `${appleAuthRequestResponse?.fullName?.givenName} ${appleAuthRequestResponse?.fullName?.familyName}`,
        );
      }
    } catch (error) {
      setLoadingApple(false);
    }
  };

  const _signInGoogle = async () => {
    setLoadingGoogle(true);
    try {
      await GoogleSignin.signOut();
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      await _socialLogin(
        result?.user?.email,
        result.user?.id,
        '',
        true,
        false,
        result?.user?.name,
      );
      // console.log(result);
    } catch (error: any) {
      setLoadingGoogle(false);
      // console.log(JSON.stringify(error));
    }
  };

  const _onSubmit = async () => {
    if (isValidate()) {
      setLoading(true);
      const raw = JSON.stringify({
        email: email?.toLowerCase(),
        password: password,
      });

      await ApiServices.post(ApiEndPoint.playerLogin, raw)
        .then(async (result: any) => {
          if (result?.status) {
            await Utils._setUserData(result?.data);
            if (
              Object.keys(result?.data?.subscription).length > 0 &&
              (result?.data?.subscription?.status === 'active' ||
                result?.data?.subscription?.status === 'canceled')
            ) {
              Navigator.setHome();
              Navigator.setMergeOption(screenName.Home, 2);
            } else {
              Navigator.setRoot(screenName.Subscription, {isShow: true});
            }
          }
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <MySafeArea componentId={props.componentId} isScroll>
      <Text style={styles.tvTitle}>Sign In</Text>

      <MyTextInput
        value={email}
        placeholder="Email"
        marginTop={Utils.calculateHeight(18)}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <View>
        <MyTextInput
          value={password}
          placeholder="Password"
          marginTop={Utils.calculateHeight(8)}
          onChangeText={setPassword}
          secureTextEntry={!showEye}
          style={styles.password}
          rightIcon={!showEye ? eye : blind}
          IconStyle={!showEye ? styles.eye : styles.blind}
          onPressIcon={() => setShowEye(!showEye)}
        />
      </View>

      <View>
        <View style={styles.checkboxContainer}>
          <CheckBox
            value={isSelected}
            onValueChange={setSelection}
            style={styles.checkbox}
            tintColors={{true: color.pictonBlue, false: color.pictonBlue}}
          />
          <Text style={styles.tvLabel}>Remember Me</Text>
          <Text
            onPress={() =>
              Navigator.setPush(props.componentId, screenName.ForgotPassword)
            }
            style={styles.tvForgot}>
            Forgot Password
          </Text>
        </View>
      </View>
      <CustomButton
        isLoading={isLoading}
        title={'Sign In'}
        marginTop={Utils.calculateHeight(39)}
        onPress={() => _onSubmit()}
      />

      <Text style={styles.tvAnyAccount}>
        Do you have an account?{' '}
        <Text
          onPress={() =>
            Navigator.setPush(props.componentId, screenName.Register)
          }
          style={{color: color.pictonBlue}}>
          Click here
        </Text>
      </Text>

      {Platform.OS === 'ios' && (
        <CustomButton
          isLoading={isLoadingApple}
          title={'Sign in with Apple'}
          marginTop={Utils.calculateHeight(30)}
          titleColor={color.black}
          iconLeft={require('@images/ic_apple.png')}
          marginIconEnd={Utils.calculateWidth(24)}
          backgroundColor={color.white}
          onPress={() => signInApple()}
        />
      )}

      <CustomButton
        isLoading={isLoadingGoogle}
        title={'Sign in with Google'}
        marginTop={Utils.calculateHeight(30)}
        iconLeft={require('@images/ic_google.png')}
        marginIconEnd={Utils.calculateWidth(19)}
        backgroundColor={color.venetianRed}
        onPress={() => {
          _signInGoogle();
        }}
      />

      <TermsCondition componentId={props.componentId} />
    </MySafeArea>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  tvTitle: {
    marginTop: Utils.calculateHeight(117),
    color: color.white,
    fontFamily: fontFamily.SemiBold,
    fontSize: fontSize.size_18,
    textAlign: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop:
      Platform.OS == 'ios' ? Utils.calculateWidth(8) : Utils.calculateHeight(6),
    marginLeft: Platform.OS == 'ios' ? Utils.calculateWidth(4) : undefined,
  },
  checkbox: {
    alignSelf: 'center',
    marginRight: Platform.OS == 'ios' ? Utils.calculateWidth(10) : undefined,
  },
  tvLabel: {
    color: color.white,
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.size_14,
  },
  tvForgot: {
    color: color.pictonBlue,
    fontFamily: fontFamily.Medium,
    fontSize: fontSize.size_14,
    textAlign: 'right',
    flex: 1,
  },
  tvAnyAccount: {
    marginTop: Utils.calculateHeight(7),
    color: color.white,
    fontFamily: fontFamily.Regular,
    fontSize: fontSize.size_12,
    alignSelf: 'center',
  },
  password: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#0C2271',
    borderRadius: Utils.calculateHeight(5),
    paddingRight: Utils.calculateHeight(15),
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
});
