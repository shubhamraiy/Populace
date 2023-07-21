import {
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
  Alert,
  Pressable,
} from 'react-native';
import {color, fontFamily, fontSize} from '@styles';
import React, {useEffect, useState} from 'react';
import Modal from 'react-native-modal';
import {Utils} from '@Utils';
import {ApiServices} from 'services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';
import {
  initStripe,
  presentPaymentSheet,
  useStripe,
} from '@stripe/stripe-react-native';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import CustomButton from './CustomButton';

export interface Props {
  isVisible?: any;
  setIssVisible?: any;
}

const IncPaymnetModal: React.FC<Props> = (props: any) => {
  const {isVisible, setIssVisible} = props;
  const [isLoading, setLoading] = useState(false);
  const [isLoadingP, setLoadingP] = useState(false);
  const [isLoad, setLoad] = useState(false);
  const [Plan, setPlan] = useState('');
  const [UserD, setuserD] = useState<any>({});
  const [subData, setSubData] = useState<any>({});

  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const toggle = () => setIssVisible(!isVisible);

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    getUser();
  }, [isVisible]);

  const init = async () => {
    await initStripe({
      publishableKey: Utils.STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: Utils.STRIPE_MERCHANT_ID,
      // urlScheme: 'your-url-scheme',
    });
  };

  const getUser = async () => {
    setLoad(true);
    let user = await Utils._getUserData();
    setPlan(
      user.subscription?.productName +
        '  at  $' +
        user?.subscription?.priceValue,
    );
    if (user?.id === undefined) {
      return;
    }
    const json = JSON.stringify({playerId: user.id});
    await ApiServices.post(ApiEndPoint.getPlayerInfo, json)
      .then(async (response: any) => {
        console.log('Inc Resp', JSON.stringify(response.data));

        setuserD(response?.data);
        setSubData(response?.data?.subscription);
        setPlan(
          response?.data?.subscription?.productName +
            '  at  $' +
            response?.data?.subscription?.priceValue,
        );
        await Utils._setUserData(response?.data);
        if (isVisible) {
          if (Object.keys(response?.data?.subscription || {}).length < 1) {
            Navigator.setRoot(screenName.Subscription, {isShow: true});
          }
        }
      })
      .finally(() => {
        setLoad(false);
      });
  };

  const cancelCurrentPlan = async () => {
    setLoading(true);
    const json = JSON.stringify({
      userId: UserD?.id,
      subscriptionId: subData?.subscriptionId,
    });
    await ApiServices.post(ApiEndPoint.cancelStripeSubscription, json)
      .then(() => {
        setTimeout(async () => {
          await getUser().finally(() => {
            setLoading(false);
            setLoadingP(false);
            toggle();
          });
        }, 3000);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const initializePaymentSheet = async () => {
    setLoadingP(true);
    var config: any = {
      merchantDisplayName: 'Populace, Inc.',
      customerId: subData?.customerId,
      customerEphemeralKeySecret: subData?.ephemeralKey,
      paymentIntentClientSecret: subData?.payment_intent,
      googlePay: {merchantCountryCode: 'US', testEnv: true},
      applePay: {merchantCountryCode: 'US', testEnv: true},
      defaultBillingDetails: {
        name: UserD?.firstname,
      },
    };
    const {error} = await initPaymentSheet(config);
    if (!error) {
      console.log('Successfully create Paymentsheet');
      const result = await presentPaymentSheet();
      console.log('Payment log', JSON.stringify(result));
      if (result?.error) {
        setLoadingP(false);
        console.log(result?.error);
        await getUser();
        // Alert.alert(`Error code: ${result?.error?.code}`, result?.error?.message);
      } else {
        setTimeout(async () => {
          await getUser().finally(() => {
            Navigator.setHome();
            Navigator.setPopToRoot(screenName.Home);
            Alert.alert('Success', 'Your Subscription is confirmed!');
            setLoadingP(true);
          });
        }, 3000);
      }
    } else {
      console.log(error);
      Alert.alert('Unable to create Paymentsheet');
      setLoadingP(false);
    }

    // const PaymentStatus = await retrievePaymentIntent(
    //   paymentData?.payment_intent,
    // );
    // console.log('Payment Status', PaymentStatus);
  };

  return (
    <Modal isVisible={isVisible} backdropOpacity={0.5}>
      <View style={styles.container}>
        <View style={{alignSelf: 'center', margin: 10}}>
          <Text
            style={{
              ...styles.Txt,
              color: color.celticBlue,
              fontFamily: fontFamily.SemiBold,
              fontSize: 20,
            }}>
            Incomplete Payment
          </Text>
          {Plan && Plan.split(' ').shift() !== 'undefined' && (
            <Text style={{...styles.Txt}}>
              Plan:{' '}
              <Text style={{fontFamily: fontFamily.SemiBold}}>{Plan}</Text>
            </Text>
          )}
          {isLoad && <ActivityIndicator style={{marginTop: 20}} />}
          <Text style={{...styles.Txt, fontFamily: fontFamily.Medium}}>
            {'Your previous payment is incomplete.\nKindly proceed to pay now.'}
          </Text>
        </View>

        <View style={styles.BtnContent}>
          <CustomButton
            isLoading={isLoading}
            disabled={isLoadingP || isLoad}
            title={'Cancel'}
            width={'45%'}
            backgroundColor={color.danger}
            onPress={cancelCurrentPlan}
          />

          <CustomButton
            isLoading={isLoadingP}
            disabled={isLoading || isLoad}
            title={'Pay now'}
            width={'45%'}
            onPress={initializePaymentSheet}
          />
        </View>
      </View>
    </Modal>
  );
};

export default IncPaymnetModal;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: color.white,
  },
  Txt: {
    marginTop: 20,
    color: color.black,
    fontFamily: fontFamily.Regular,
    textAlign: 'center',
    fontSize: fontSize.size_16,
  },
  BtnContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    margin: 20,
  },
});
