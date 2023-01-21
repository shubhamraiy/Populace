import {
  Alert,
  Image,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import {screenName} from '@screenName';
import {Navigator} from '@Navigator';
import {MyAsyncStorage} from '@MyAsyncStorage';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from '../services/ApiEndPoint';

export interface Props extends NavigationComponentProps {}

const MyAccount: React.FC<Props> = props => {
  const _renderItems = (img: ImageSourcePropType, title: any, id?: number) => {
    return (
      <Pressable
        onPress={async () => {
          if (id === 6) {
            const result: any = await ApiServices.post(
              ApiEndPoint.playerLogout,
              JSON.stringify({email: await Utils.getEmail()}),
            );
            if (result?.status) {
              await MyAsyncStorage.logOut();
            }
          }
          const name =
            id === 0
              ? screenName.AccountDetails
              : id === 1
              ? screenName.RequestWithdraw
              : id === 2
              ? screenName.ModePickingNumber
              : id === 3 || id === 4
              ? screenName.TermsPrivacyTab
              : screenName.ChangePassword;

          Navigator.setPush(props.componentId, name);
        }}
        style={[
          styles.renderContainer,
          {marginTop: id === 0 ? Utils.calculateHeight(22) : 0},
        ]}>
        <View style={styles.container}>
          <Image source={img} resizeMode={'contain'} style={styles.ivImage} />
          <Text style={styles.tvText}>{title}</Text>
        </View>
        {/*<View*/}
        {/*  style={{*/}
        {/*    marginVertical:18,*/}
        {/*    borderBottomColor: 'white',*/}
        {/*    borderBottomWidth: StyleSheet.hairlineWidth,*/}
        {/*  }}*/}
        {/*/>*/}
      </Pressable>
    );
  };

  return (
    <MySafeArea componentId={props.componentId} isHideBack isScroll={true}>
      <Text style={styles.tvTitle}>Account Details</Text>

      {_renderItems(
        require('@images/bottomTab/ic_subscription.png'),
        'Subscription Plan',
        0,
      )}
      {_renderItems(require('@images/ic_withdraw.png'), 'Withdraw My Funds', 1)}
      {_renderItems(
        require('@images/ic_calculator.png'),
        'Mode Of Picking Numbers',
        2,
      )}
      {_renderItems(
        require('@images/ic_terms_conditions.png'),
        'Terms And Conditions',
        3,
      )}
      {_renderItems(require('@images/ic_insurance.png'), 'Privacy Policy', 4)}
      {_renderItems(
        require('@images/ic_password_account.png'),
        'Change Password',
        5,
      )}
      {_renderItems(require('@images/ic_sign_out.png'), 'Sign Out', 6)}
    </MySafeArea>
  );
};

export default MyAccount;

const styles = StyleSheet.create({
  renderContainer: {
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    paddingVertical: Utils.calculateHeight(15),
    marginBottom: 1,
  },

  tvTitle: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(80),
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ivImage: {
    height: 24,
    width: 24,
  },
  tvText: {
    color: color.white,
    fontSize: fontSize.size_16,
    fontFamily: fontFamily.Medium,
    marginStart: Utils.calculateWidth(20),
  },
});
