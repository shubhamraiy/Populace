import {
  Alert,
  Image,
  Keyboard,
  Pressable,
  StyleSheet,
  Text,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Navigation, NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import MyTextInput from '@components/MyTextInput';
import CustomButton from '@components/CustomButton';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from 'services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const RequestWithdrawDetails: React.FC<Props> = props => {
  const {propsData} = props;
  const [user, setUser] = useState({});
  const [isLoading, setLoading] = useState(false);
  const [amount, setAmount] = useState(propsData?.amount || '');
  const [bankName, setBankName] = useState('');
  const [acHolderName, setAcHolderName] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  //   console.log(propsData);
  //   useEffect(() => {
  //     Utils._getUserData().then(user => {
  //       setUser(user);
  //     });
  //   }, []);

  const isValidate = () => {
    if (Utils.isEmpty(bankName)) {
      Navigator.showAlert('Please enter bank name');
      return false;
    } else if (Utils.isEmpty(acHolderName)) {
      Navigator.showAlert('Please enter account holder name');
      return false;
    } else if (Utils.isEmpty(routingNumber)) {
      Navigator.showAlert('Please enter routing number');
      return false;
    } else if (Utils.isEmpty(accountNumber)) {
      Navigator.showAlert('Please enter valid account number');
      return false;
    } else if (routingNumber.length !== 9) {
      Navigator.showAlert('Routing number should be 9 digits');
      return false;
    } else {
      return true;
    }
  };

  const onSubmit = async (
    withdrawAmount: string,
    backName: string,
    accountHolderName: string,
    routingNumber: string,
    accountNumber: string,
  ) => {
    if (isValidate()) {
      setLoading(true);
      const raw = JSON.stringify({
        playerId: await Utils._getUserId(),
        withdrawAmount: withdrawAmount,
        bankName: backName,
        AccountHolderName: accountHolderName,
        RoutingNumber: routingNumber,
        AccountNumber: accountNumber,
      });
      await ApiServices.post(ApiEndPoint.withdrawRequest, raw)
        .then((result: any) => {
          setLoading(false);
          console.log(result);

          if (result.status) {
            // Navigator.setPop(props.componentId);
            Navigation.popToRoot(screenName.MyAccount);

            Navigator.showAlert(
              result.message ?? 'Successfully sent request withdraw',
              'success',
            );
          } else {
            if (
              parseFloat(amount) < parseFloat(result?.data?.withdrawMinLimit) ||
              parseFloat(amount) > parseFloat(result?.data?.withdrawMaxLimit)
            ) {
              setAmount(result?.data?.withdrawAmount);
              setBankName(result?.data?.bankName);
              setAcHolderName(result?.data?.AccountHolderName);
              setRoutingNumber(result?.data?.RoutingNumber);
              setAccountNumber(result?.data?.AccountNumber);
              Alert.alert(
                'Withdraw Limit',
                `You can withdraw only:\nMinimum: \n${result?.data?.withdrawMinLimit}\nMaximum: ${result?.data?.withdrawMaxLimit}`,
              );
            }
          }
        })
        .catch(() => {
          setLoading(false);
        });
    }
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <View style={{flex: 1}}>
        <MySafeArea componentId={props.componentId} isScroll={true}>
          <View style={styles.container}>
            <Text style={styles.tvProfile}>Enter your Bank Details</Text>

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={styles.tvLabel}>Amount: {amount}</Text>
              <Text style={{...styles.tvLabel, textAlign: 'right'}}>
                Balance: ${propsData?.balance}
              </Text>
            </View>

            <MyTextInput
              value={bankName}
              placeholder="Bank Name"
              marginTop={20}
              onChangeText={setBankName}
            />
            <MyTextInput
              value={acHolderName}
              placeholder="Account Holder Name"
              marginTop={10}
              onChangeText={setAcHolderName}
              maxLength={10}
            />

            <MyTextInput
              value={routingNumber}
              placeholder="Routing Number"
              marginTop={10}
              onChangeText={text => {
                if (text.length < 10) {
                  setRoutingNumber(text.replace(/[^0-9]/g, ''));
                }
              }}
              keyboardType={'number-pad'}
            />
            <MyTextInput
              value={accountNumber}
              placeholder="Account Number"
              marginTop={10}
              onChangeText={text =>
                setAccountNumber(text.replace(/[^0-9]/g, ''))
              }
              maxLength={10}
              keyboardType={'number-pad'}
            />

            <CustomButton
              isLoading={isLoading}
              title={'Submit'}
              marginTop={Utils.calculateHeight(60)}
              onPress={() =>
                onSubmit(
                  amount,
                  bankName,
                  acHolderName,
                  routingNumber,
                  accountNumber,
                )
              }
            />
          </View>
        </MySafeArea>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default RequestWithdrawDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    // marginTop: 36
  },

  tvProfile: {
    marginTop: 30,
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
  },
  tvLabel: {
    fontSize: fontSize.size_14,
    color: color.white,
    fontFamily: fontFamily.Medium,
    marginTop: 40,
    flex: 1,
  },
});
