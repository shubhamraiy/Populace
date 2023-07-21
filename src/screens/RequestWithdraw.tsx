import React from 'react';
import MySafeArea from '@components/MySafeArea';
import {NavigationComponentProps, Navigation} from 'react-native-navigation';
import {
  Keyboard,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import MyTextInput from '@components/MyTextInput';
import CustomButton from '@components/CustomButton';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from 'services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps {}

const RequestWithdraw: React.FC<Props> = props => {
  const [amount, setAmount] = React.useState('');
  const [balance, setBalance] = React.useState('');
  const [isLoading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: async () => {
          getAccountDetails();
        },
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);

  const getAccountDetails = async () => {
    setLoading(true);
    const response: any = await ApiServices.post(
      ApiEndPoint.accountDetails,
      JSON.stringify({
        id: await Utils._getUserId(),
      }),
    ).finally(() => {
      setLoading(false);
    });
    if (response?.status) {
      setBalance(response?.data?.remainingWithdrawAmount);
    }
  };

  const isValidate = () => {
    if (amount == '') {
      Navigator.showAlert('Please enter amount to withdraw');
      return false;
    }
    // else if (parseFloat(amount) > parseFloat(balance)) {
    //   Navigator.showAlert('You have low balance to withdraw this amount');
    //   return false;
    // }
    else {
      return true;
    }
  };

  const onNext = () => {
    if (isValidate()) {
      const sendData = {
        amount: amount,
        balance: balance,
      };
      Navigator.setPush(
        props.componentId,
        screenName.RequestWithdrawDetails,
        sendData,
      );
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <MySafeArea
          isScroll={true}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              tintColor="#fff"
              onRefresh={() => getAccountDetails()}
            />
          }
          componentId={props.componentId}>
          <Text style={styles.tvTitle}>Request to withdraw funds</Text>

          <View style={styles.rowContainer}>
            <MyTextInput
              editable={false}
              textAlign={'center'}
              FontSize={fontSize.size_12}
              value={'Account balance'}
              width={Utils.calculateWidth(212)}
            />
            <MyTextInput
              FontSize={fontSize.size_12}
              value={balance}
              editable={false}
              textAlign={'center'}
              marginStart={Utils.calculateWidth(6)}
              width={Utils.calculateWidth(112)}
            />
          </View>
          <MyTextInput
            marginTop={Utils.calculateHeight(10)}
            FontSize={fontSize.size_10}
            editable={!isLoading}
            textAlign={'center'}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            innerplaceholder={
              'Enter the amount you are requesting to with draw.'
            }
          />

          <CustomButton
            disabled={isLoading}
            title={'Submit Request'}
            marginTop={Utils.calculateHeight(60)}
            onPress={() => onNext()}
          />
        </MySafeArea>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RequestWithdraw;

const styles = StyleSheet.create({
  tvTitle: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(60),
  },

  rowContainer: {
    marginTop: Utils.calculateHeight(25),
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
