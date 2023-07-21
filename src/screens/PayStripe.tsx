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

import {StripeProvider, useStripe} from '@stripe/stripe-react-native';
import CustomButton from '@components/CustomButton';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const StripePaymentScreen: React.FC<Props> = props => {
  const {initPaymentSheet, presentPaymentSheet} = useStripe();

  const API_URL = 'https://api.stripe.com/';
  const publishKey =
    'pk_test_51N0W26EMXPG2wvA7EM6kOfxYMZOAfzZN9O0VQ0qai45XbyQSU47U0e8S1RMo6fuQLsQeyvzCV5volcwit91AORdw00zmZNIB5B';

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(`${API_URL}/payment-sheet`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const {paymentIntent, ephemeralKey, customer} = await response.json();
    return {
      paymentIntent,
      ephemeralKey,
      customer,
    };
  };

  const initializePaymentSheet = async () => {
    const {paymentIntent, ephemeralKey, customer} =
      await fetchPaymentSheetParams();

    const {error} = await initPaymentSheet({
      merchantDisplayName: 'Example, Inc.',
      customerId: customer || '1243',
      customerEphemeralKeySecret: ephemeralKey || 'dsfd1234sdfg',
      paymentIntentClientSecret: paymentIntent || '34rfsdgdh',
      // Set `allowsDelayedPaymentMethods` to true if your business can handle payment
      //methods that complete payment after a delay, like SEPA Debit and Sofort.
      allowsDelayedPaymentMethods: true,
      defaultBillingDetails: {
        name: 'Jane Doe',
      },
    });

    if (!error) {
      console.log('success');
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert('Success', 'Your order is confirmed!');
    }
  };

  return (
    <SafeAreaView style={{flex: 1, paddingHorizontal: 50}}>
      <StripeProvider
        publishableKey={publishKey}
        merchantIdentifier="merchant.com.populace-sweepstake.app" // required for Apple Pay
        // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
      >
        <CustomButton title={'Pay Now'} onPress={openPaymentSheet} />
      </StripeProvider>
    </SafeAreaView>
  );
};

export default StripePaymentScreen;

const styles = StyleSheet.create({
  container: {
    fontSize: fontSize.size_28,
  },
});
