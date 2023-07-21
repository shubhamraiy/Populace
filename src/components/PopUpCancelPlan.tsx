import {Alert, StyleSheet, Text, View} from 'react-native';
import CustomButton from '@components/CustomButton';
import {color, fontFamily, fontSize} from '@styles';
import {Navigator} from '@Navigator';
import {Navigation, NavigationComponentProps} from 'react-native-navigation';
import React, {useEffect, useState} from 'react';
import {Utils} from '@Utils';
import {ApiEndPoint} from 'services/ApiEndPoint';
import {ApiServices} from 'services/ApiServices';
import {screenName} from '@screenName';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const PopUpCancelPlan: React.FC<Props> = props => {
  var UserData: any = {};
  const [isLoading, setLoading] = useState(false);
  const {propsData} = props;

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: () => {
          getData();
        },
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);

  const getData = async () => {
    UserData = await Utils._getUserData();
  };

  const SubscriptionCheck = async (user: any) => {
    const json = JSON.stringify({
      playerId: user.id,
    });
    await ApiServices.post(ApiEndPoint.getPlayerInfo, json)
      .then(async (response: any) => {
        console.log('akjhfvdgsh', response);
        if (response?.status) {
          await Utils._setUserData(response?.data);
          propsData?.callback(response?.data);
          propsData?.refresh(true);
        }
        Navigator.dismissOverlay();
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        Navigator.dismissOverlay();
      });
  };

  const cancelCurrentPlan = async () => {
    setLoading(true);
    const data = await Utils._getUserData();
    const json = JSON.stringify({
      userId: data?.id,
      subscriptionId: data?.subscription?.subscriptionId,
      // autoRenew: data?.autoRenew ? false : true,
    });

    await ApiServices.post(ApiEndPoint.cancelStripeSubscription, json)
      .then(async (response: any) => {
        console.log('cancelCurrentPlan', response);
        if (response?.status) {
          setTimeout(async () => {
            await SubscriptionCheck(data);
            if (propsData?.isShow) {
              Navigator.setHome();
              Alert.alert(
                response?.message || 'Your subscription has cancelled',
              );
            }
          }, 3000);
        } else {
          Alert.alert(response?.message || 'Your subscription has cancelled');
          Navigator.dismissOverlay();
        }
      })
      .catch((error: any) => {
        console.log('cancelCurrentPlanerror', error);
        setLoading(false);
        Alert.alert(error?.message || 'Your subscription has cancelled');
        Navigator.dismissOverlay();
      });
  };

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.tvRegister}>
          Are you sure you want to
          {propsData?.message}
          the current plan?
        </Text>

        <CustomButton
          isLoading={isLoading}
          marginTop={Utils.calculateHeight(45)}
          backgroundColor={color.white}
          titleColor={color.black}
          title={'Yes'}
          onPress={cancelCurrentPlan}
        />
        <CustomButton
          disabled={isLoading}
          marginTop={Utils.calculateHeight(30)}
          backgroundColor={color.black}
          titleColor={color.white}
          title={'No'}
          onPress={() => Navigator.dismissOverlay()}
        />
        {isLoading && (
          <Text style={{paddingTop: 20, textAlign: 'center', color: 'white'}}>
            Please wait while we are processing...
          </Text>
        )}
      </View>
    </View>
  );
};

export default PopUpCancelPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerContainer: {
    padding: 30,
    borderColor: color.white,
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: color.sapphireBlue,
  },
  tvRegister: {
    marginTop: Utils.calculateHeight(7),
    color: color.white,
    fontSize: fontSize.size_16,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
  },
  tvTitle: {
    marginTop: Utils.calculateHeight(25),
    color: color.white,
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Regular,
    lineHeight: 17.07,
    // textAlign: 'center',
  },
});
