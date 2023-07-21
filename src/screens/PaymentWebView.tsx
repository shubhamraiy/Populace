import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import {NavigationComponentProps, Navigation} from 'react-native-navigation';
import {Navigator} from '@Navigator';
import {WebView} from 'react-native-webview';
import {fontSize, color, fontFamily} from '@styles';
import {Utils} from '@Utils';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from '../services/ApiEndPoint';
import {screenName} from '@screenName';

export interface Props extends NavigationComponentProps {
  propsData: any;
}
const Paypal: React.FC<Props> = props => {
  const {propsData} = props;
  const [isprocessing, setProcessing] = useState(false);

  console.log(propsData);

  const _onNavigationStateChange = async (webViewState: any) => {
    console.log(webViewState);
    if (
      webViewState.url.includes(
        'http://populacelottoappnew.aistechnolabs.pro/createSubscriptionReturnUrl',
      )
    ) {
      let subscription_id_token = webViewState.url
        .split('subscription_id=')
        .pop();
      let subscription_id = subscription_id_token.split('&ba_token=').shift();
      handleSubscription(subscription_id);
      // Navigator.setHome();
      // Navigation.popToRoot(screenName.Subscription);
      // Navigation.popToRoot(screenName.HowItWork);
      // Navigation.popToRoot(screenName.Home);
      // Navigation.popToRoot(screenName.MyAccount);
      // Navigation.popToRoot(screenName.Profile);
    }
    if (
      webViewState.url.includes(
        'http://populacelottoappnew.aistechnolabs.pro/createSubscriptionCancelUrl',
      )
    ) {
      if (
        propsData.users.isCurrentSubscription ||
        propsData.users.isNextSubscription
      ) {
        Navigator.setHome();
        Navigation.popToRoot(screenName.Subscription);
        Navigation.popToRoot(screenName.HowItWork);
        Navigation.popToRoot(screenName.Home);
        Navigation.popToRoot(screenName.MyAccount);
        Navigation.popToRoot(screenName.Profile);
        Alert.alert('Payment Failed');
      } else {
        Navigator.setRoot(screenName.Subscription, {isShow: true});
      }
    }
  };

  const handleSubscription = async (subscription_id: any) => {
    setProcessing(true);
    const json = JSON.stringify({
      email: propsData.users.email,
      playerId: propsData.users.id,
    });
    await ApiServices.post(ApiEndPoint.getPlayerInfo, json)
      .then(async (response: any) => {
        if (response?.status) {
          let users: any = {...response?.data};
          // users.subscriptionId = subscription_id;
          users.subscription.subscriptionId = subscription_id;
          await Utils._setUserData(users);
          Navigator.showAlert(response?.message, 'success');
          Navigator.setHome();
          Navigation.popToRoot(screenName.Subscription);
          Navigation.popToRoot(screenName.HowItWork);
          Navigation.popToRoot(screenName.Home);
          Navigation.popToRoot(screenName.MyAccount);
          Navigation.popToRoot(screenName.Profile);
          Alert.alert(
            'Payment Success',
            `It may take sometime for the payment to fully process,\nif you are not able to access your subscription please check back later.\nTo refresh please pull down on the screen, or fully close and reopen the app.`,
          );
        }
        setProcessing(false);
      })
      .catch(() => {
        setProcessing(false);
      });
    // console.log('Subscription response', JSON.stringify(response));
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      {!isprocessing ? (
        <WebView
          style={{flex: 1}}
          source={{uri: propsData?.data?.paymentLink}}
          onNavigationStateChange={_onNavigationStateChange}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          startInLoadingState={true}
          enableApplePay={true}
          incognito={true}
        />
      ) : (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <ActivityIndicator size={'large'} />
          <Text style={{color: 'black', marginTop: 20}}>
            Please wait while we are processing your payment...
          </Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default Paypal;

const styles = StyleSheet.create({
  container: {
    fontSize: fontSize.size_28,
    color: color.mediumGrey,
    fontFamily: fontFamily.SemiBold,
  },
});
