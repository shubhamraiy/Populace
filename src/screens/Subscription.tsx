import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Navigation, NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import CustomButton from '@components/CustomButton';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import TextWithIcon from '@components/TextWithIcon';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from '../services/ApiEndPoint';
import Loader from '@components/Loader';
import {MyAsyncStorage} from '@MyAsyncStorage';

import {useStripe, initStripe} from '@stripe/stripe-react-native';
import moment from 'moment';
import LoaderModal from '@components/LoaderModal';
import IncPaymnetModal from '@components/IncompletePayment';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const Subscription: React.FC<Props> = props => {
  const {propsData} = props;
  const {initPaymentSheet, presentPaymentSheet, isGooglePaySupported} =
    useStripe();

  const [data1, setData] = useState([]);
  const [saveItems, setSaveItems] = useState<any>();
  const [selectedPlan, setSelectedPlan] = useState<any>('');
  const [PreselectedPlan, setPreSelectedPlan] = useState<any>('');
  const [NextselectedPlan, setNextSelectedPlan] = useState<any>('');
  const [RefreshCancel, setRefreshCancel] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [ispurchasing, setPurchasing] = useState(false);
  const [refresh, setrefresh] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [isbottomtab, setBottomtab] = useState(false);
  const [isIncPay, setisIncPay] = useState(false);
  const [type, setType] = useState<any>();
  const [currentPlan, setCurrentPlan] = useState<any>();

  // console.log('useData: ', JSON.stringify(currentPlan));
  // console.log('saveItems: ', JSON.stringify(saveItems));

  const init = async () => {
    await initStripe({
      publishableKey: Utils.STRIPE_PUBLISHABLE_KEY,
      merchantIdentifier: Utils.STRIPE_MERCHANT_ID,
      // urlScheme: 'your-url-scheme',
    });
  };

  useEffect(() => {
    init();
  }, []);

  const Logout = async () => {
    setExiting(true);
    await ApiServices.post(
      ApiEndPoint.playerLogout,
      JSON.stringify({email: await Utils.getEmail()}),
    ).finally(() => {
      MyAsyncStorage.logOut();
      setExiting(false);
    });
  };

  const getUser = async () => {
    setisIncPay(false);
    let user = await Utils._getUserData();
    if (Object.keys(user?.subscription || {}).length < 1) {
      SubscriptionCheck(user);
      setBottomtab(true);
    }
    isPaymentIncomplete(user);
    setCurrentPlan(user);
    getPlanDetails(user);
  };

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: async () => {
          getUser();
        },
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);
  useEffect(() => {
    getUser();
  }, []);

  // useEffect(() => {
  //   if (!isIncPay) {
  //     AgainRefresh();
  //   }
  // }, [isIncPay]);

  useEffect(() => {
    if (RefreshCancel) {
      AgainRefresh();
    }
  }, [RefreshCancel]);

  const AgainRefresh = async () => {
    await getPlanDetails(currentPlan);
    await SubscriptionCheck(currentPlan);
    setRefreshCancel(false);
  };

  const SubscriptionCheck = async (user: any) => {
    setrefresh(true);
    const json = JSON.stringify({
      playerId: user.id,
    });
    await ApiServices.post(ApiEndPoint.getPlayerInfo, json)
      .then(async (response: any) => {
        setrefresh(false);
        console.log('Subscription check', JSON.stringify(response));
        if (response?.status) {
          await Utils._setUserData(response?.data);
          setCurrentPlan(response?.data);
          data1.map((item: any) => {
            item?.prices.map((i: any) => {
              if (i?.priceId === response?.data?.subscription?.priceId) {
                setPreSelectedPlan(i?.priceId);
              }
              if (
                i?.priceId ===
                response?.data?.subscription?.upcomingPlan?.priceId
              ) {
                setNextSelectedPlan(i?.priceId);
              }
            });
          });
          if (
            propsData?.isShow === true &&
            (response?.data?.subscription?.status === 'active' ||
              response?.data?.subscription?.status === 'canceled')
          ) {
            Navigator.setHome();
          }
        }
      })
      .catch(errr => {
        setrefresh(false);
      });
  };

  const ChangePlanHandle = async (type: any) => {
    setPurchasing(true);
    setType(type);
    const userdata = await Utils._getUserData();
    const json = JSON.stringify({
      userId: userdata.id,
      subscriptionId: userdata?.subscription?.subscriptionId || '',
      priceId: saveItems?.priceId,
    });
    await ApiServices.post(ApiEndPoint.changeSubscription, json)
      .then(async (response: any) => {
        setTimeout(async () => {
          await SubscriptionCheck(currentPlan);
          if (type === 1) {
            Alert.alert('Success', 'Your Subscription will Downgrade!');
          } else {
            Alert.alert('Success', 'Your Subscription will Upgrade!');
          }
          setPurchasing(false);
          setSaveItems({});
          setSelectedPlan('');
        }, 3000);
      })
      .catch(errr => {
        setPurchasing(false);
      });
  };

  const getPlanDetails = async (user: any) => {
    const userdata = await Utils._getUserData();

    const body = JSON.stringify({
      id: userdata?.id,
    });

    if (data1.length < 1) {
      setLoading(true);
    }
    await ApiServices.post(ApiEndPoint.getProductList, body)
      .then(async (response: any) => {
        setLoading(false);
        console.log('Plan Details...', JSON.stringify(response));
        if (response?.status) {
          setData(response?.data);
          // const filterData: any = [];
          response?.data.map((item: any) => {
            item?.prices.map((i: any) => {
              if (i?.priceId === user?.subscription?.priceId) {
                setPreSelectedPlan(i?.priceId);
              }
              if (i?.priceId === user?.subscription?.upcomingPlan?.priceId) {
                setNextSelectedPlan(i?.priceId);
              }
            });
          });
          setData(response?.data);
          // await Utils._setPlanData(filterData);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const isPaymentIncomplete = async (user: any) => {
    if (user?.id === undefined) {
      MyAsyncStorage.logOut();
    }
    const json = JSON.stringify({
      playerId: user.id,
    });
    await ApiServices.post(ApiEndPoint.getPlayerInfo, json).then(
      async (response: any) => {
        if (response?.status) {
          if (Object.keys(response?.data?.subscription || {}).length > 0) {
            console.log('isPaymentIncomplete', response?.data?.subscription);
            if (response?.data?.subscription?.status === 'incomplete') {
              setisIncPay(true);
            }
          }
        }
      },
    );
  };

  const initializePaymentSheet = async (type: any) => {
    setPurchasing(true);
    setType(type);
    const userdata = await Utils._getUserData();
    const token = (await Utils?._getToken()) || '';
    var myHeaders = new Headers();
    myHeaders.append('jwtToken', token);
    myHeaders.append('Content-Type', 'application/json');
    if (saveItems?.priceId === undefined) {
      Alert.alert('Please select any plan');
      return;
    } else {
      const json = {
        id: userdata?.id,
        price: saveItems?.priceId,
      };
      const response = await fetch(
        Utils.API_BASE_URL + ApiEndPoint.createPaymentLink,
        {
          body: JSON.stringify(json),
          method: 'POST',
          headers: myHeaders,
        },
      );
      const {data} = await response.json();
      console.log('createPaymentLink Data: ', data);
      var config: any = {
        merchantDisplayName: 'Populace, Inc.',
        customerId: data?.customerId,
        customerEphemeralKeySecret: data?.ephemeralKey,
        paymentIntentClientSecret: data?.payment_intent,
        googlePay: {merchantCountryCode: 'US', testEnv: true},
        applePay: {merchantCountryCode: 'US', testEnv: true},
        defaultBillingDetails: {
          name: currentPlan?.firstname,
        },
      };
      const {error} = await initPaymentSheet(config);
      if (!error) {
        console.log('Successfully create Paymentsheet');
        await openPaymentSheet();
      } else {
        console.log(error);
        setSaveItems({});
        setSelectedPlan('');
        Alert.alert('Unable to create Paymentsheet');
      }
    }
  };

  const openPaymentSheet = async () => {
    setPurchasing(true);
    const result = await presentPaymentSheet();
    console.log('Payment log', JSON.stringify(result));
    if (result?.error) {
      // Alert.alert(`Error code: ${result?.error?.code}`, result?.error?.message);
      isPaymentIncomplete(currentPlan);
      setPurchasing(false);
    } else {
      setTimeout(async () => {
        await SubscriptionCheck(currentPlan);
        Alert.alert('Success', 'Your Subscription is confirmed!');
        setSaveItems({});
        setSelectedPlan('');
        setPurchasing(false);
      }, 3000);
    }
  };

  const setBtnBgCol = (item: any) => {
    if (
      Object.keys(currentPlan.subscription?.upcomingPlan || {}).length > 0 &&
      NextselectedPlan === item?.priceId
    ) {
      return color.info;
    }
    if (
      currentPlan?.subscription?.status === 'active' &&
      PreselectedPlan === item?.priceId
    ) {
      return color.default;
    }
    if (selectedPlan === item?.priceId) {
      return color.royalBlue;
    }
    if (
      currentPlan?.subscription?.status !== 'active' &&
      PreselectedPlan === item?.priceId
    ) {
      return color.white;
    }
    return color.white;
  };

  const setBtnTitleCol = (item: any) => {
    if (
      Object.keys(currentPlan?.subscription?.upcomingPlan || {}).length > 0 &&
      NextselectedPlan === item?.priceId
    ) {
      return color.white;
    }
    if (
      (currentPlan?.subscription?.status === 'active' &&
        PreselectedPlan === item?.priceId) ||
      selectedPlan === item?.priceId
    ) {
      return color.white;
    }
    return color.sapphireBlue;
  };

  const _renderItems = (item: any, index: any) => {
    return (
      <View>
        <Text style={styles.tvItemTitle}>{item?.name}</Text>
        <View style={[styles.rowContainer, {flexWrap: 'wrap'}]}>
          {item?.prices?.map((elem: any, indx: any) => {
            return (
              <>
                <CustomButton
                  disabled={
                    (elem.priceId === currentPlan?.subscription?.priceId &&
                      currentPlan?.subscription?.status === 'active') ||
                    Object.keys(currentPlan.subscription?.upcomingPlan || {})
                      .length > 0
                  }
                  marginBottom={Utils.calculateHeight(13)}
                  marginTop={Utils.calculateHeight(13)}
                  title={'$' + elem?.price + ' per ' + elem?.recurring}
                  FontSize={fontSize.size_12}
                  titleColor={setBtnTitleCol(elem)}
                  backgroundColor={setBtnBgCol(elem)}
                  FontFamily={fontFamily.Medium}
                  height={Utils.calculateHeight(39)}
                  width={'45%'}
                  onPress={() => {
                    if (currentPlan?.subscription.length > 0) {
                      if (elem.priceId !== currentPlan?.subscription?.priceId) {
                        Alert.alert(
                          'Plan Change',
                          'Do you want to change your plan?',
                          [
                            {
                              text: 'Cancel',
                              style: 'cancel',
                            },
                            {
                              text: 'Yes',
                              onPress: () => {
                                setSelectedPlan(elem?.priceId);
                                setSaveItems(elem);
                              },
                            },
                          ],
                        );
                      } else {
                        setSelectedPlan(elem?.priceId);
                        setSaveItems(elem);
                      }
                    } else {
                      setSelectedPlan(elem?.priceId);
                      setSaveItems(elem);
                    }
                  }}
                />
              </>
            );
          })}
        </View>
        {item?.prices?.map((elem: any, indx: any) => {
          return (
            <>
              {elem?.priceId === currentPlan?.subscription?.priceId &&
                currentPlan?.subscription?.status === 'active' && (
                  <View
                    style={{
                      marginVertical: index === data1.length - 1 ? 0 : -8,
                      marginTop: index === data1.length - 1 ? -8 : undefined,
                      alignSelf: indx % 2 ? 'flex-end' : 'flex-start',
                    }}>
                    <Text style={styles.tvItemTitle}>
                      Renew on:{' '}
                      {moment(
                        currentPlan?.subscription?.current_period_end * 1000,
                      ).format('DD/MM/YYYY hh:mm A')}
                    </Text>
                  </View>
                )}
            </>
          );
        })}
      </View>
    );
  };

  const upgradeBtnColor = () => {
    if (
      saveItems?.priceId !== undefined &&
      currentPlan?.subscription?.status === 'active' &&
      Object.keys(currentPlan.subscription?.upcomingPlan || {}).length < 1
    ) {
      return color.royalBlue;
    } else {
      return color.default;
    }
  };

  const downgradeBtnColor = () => {
    if (
      saveItems?.priceId !== undefined &&
      currentPlan?.subscription?.status === 'active' &&
      Object.keys(currentPlan.subscription?.upcomingPlan || {}).length < 1
    ) {
      return color.denim;
    } else {
      return color.default;
    }
  };

  const _btnDownUpGrade = () => {
    return (
      <View style={{marginTop: Utils.calculateHeight(30)}}>
        <View style={styles.rowContainerSpaceBetween}>
          <CustomButton
            isLoading={type === 2 && ispurchasing}
            disabled={
              saveItems?.priceId == undefined ||
              ispurchasing ||
              currentPlan?.subscription?.status !== 'active' ||
              Object.keys(currentPlan.subscription?.upcomingPlan || {}).length >
                0
            }
            backgroundColor={upgradeBtnColor()}
            title={'Upgrade'}
            width={'47%'}
            onPress={() => {
              if (currentPlan?.subscription?.priceValue > saveItems?.price) {
                Navigator.showAlert('Selected plan downgradeable');
              } else {
                ChangePlanHandle(2);
              }
            }}
          />

          <CustomButton
            isLoading={type === 1 && ispurchasing}
            disabled={
              saveItems?.priceId == undefined ||
              ispurchasing ||
              currentPlan?.subscription?.status !== 'active' ||
              Object.keys(currentPlan.subscription?.upcomingPlan || {}).length >
                0
            }
            title={'Downgrade'}
            width={'47%'}
            backgroundColor={downgradeBtnColor()}
            onPress={() => {
              if (currentPlan?.subscription?.priceValue < saveItems?.price) {
                Navigator.showAlert('Selected plan upgradeable');
              } else {
                // Navigator.showAlert('Success', 'success');
                // subscriptionPost(1);
                ChangePlanHandle(1);
              }
            }}
          />
        </View>
      </View>
    );
  };

  return (
    <MySafeArea
      componentId={props.componentId}
      isHideBack
      isBottomSubShow={isbottomtab}
      isScroll={true}
      IsRefresh={isIncPay || refresh}
      refreshControl={
        <RefreshControl
          refreshing={refresh}
          tintColor="#fff"
          onRefresh={() => {
            getPlanDetails(currentPlan);
            SubscriptionCheck(currentPlan);
            isPaymentIncomplete(currentPlan);
          }}
        />
      }>
      {data1.length > 0 && (
        <Text style={styles.tvTitle}>Subscription Payment</Text>
      )}

      {data1.length < 1 && isLoading ? (
        <Loader style={{height: 400}} />
      ) : (
        <FlatList
          style={{marginTop: Utils.calculateHeight(24)}}
          data={data1}
          scrollEnabled={false}
          renderItem={({item, index}) => _renderItems(item, index)}
        />
      )}

      {data1.length > 0 && (
        <View>
          <CustomButton
            isLoading={type === 0 && ispurchasing}
            disabled={
              saveItems?.priceId == undefined ||
              currentPlan?.subscription?.status === 'active' ||
              ispurchasing ||
              Object.keys(currentPlan.subscription?.upcomingPlan || {}).length >
                0
            }
            backgroundColor={
              saveItems?.priceId !== undefined &&
              currentPlan?.subscription?.status !== 'active'
                ? color.royalBlue
                : color.default
            }
            title={'Pay now'}
            marginTop={Utils.calculateHeight(30)}
            onPress={() => initializePaymentSheet(0)}
          />
          {_btnDownUpGrade()}
        </View>
      )}

      {!isLoading &&
        Object.keys(currentPlan?.subscription || {}).length < 1 && (
          <Pressable
            disabled={exiting}
            onPress={Logout}
            style={{alignSelf: 'flex-end', margin: 10}}>
            {exiting ? (
              <ActivityIndicator color={color.venetianRed} />
            ) : (
              <Text style={styles.Exit}>Exit</Text>
            )}
          </Pressable>
        )}

      {data1.length > 0 && currentPlan?.subscription?.status === 'active' && (
        <Text
          onPress={() => {
            Navigator.showOverlay(screenName.PopUpCancelPlan, {
              message: ' cancel ',
              callback: (item: any) => {
                setCurrentPlan(item);
              },
              refresh: (item: any) => {
                setRefreshCancel(item || false);
              },
            });
          }}
          style={styles.tvCancel}>
          Cancel Subscription
        </Text>
      )}
      <View style={{height: Utils.calculateHeight(120)}} />
      <LoaderModal isVisible={ispurchasing} />
      <IncPaymnetModal isVisible={isIncPay} setIssVisible={setisIncPay} />
    </MySafeArea>
  );
};

export default Subscription;

const styles = StyleSheet.create({
  tvTitle: {
    // marginTop: Utils.calculateHeight(57),
    marginTop: Utils.calculateHeight(20),
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    color: color.white,
    textAlign: 'center',
  },

  rowContainer: {
    marginTop: Utils.calculateHeight(3),
    flexDirection: 'row',
    // paddingVertical: Utils.calculateHeight(13),
    paddingHorizontal: Utils.calculateWidth(10),
    justifyContent: 'space-between',
    backgroundColor: '#0C2271',
    borderRadius: 5,
  },
  rowContainerSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tvItemTitle: {
    marginTop: Utils.calculateHeight(10),
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  ivSocialIcon: {
    height: 20,
    width: 20,
  },
  btnAndroidIosPay: {
    backgroundColor: color.white,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: Utils.calculateHeight(52),
    marginTop: Utils.calculateHeight(67),
    borderRadius: 5,
  },
  tvCancel: {
    color: color.danger,
    alignSelf: 'flex-end',
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.SemiBold,
    marginTop: Utils.calculateHeight(10),
    marginBottom: Utils.calculateHeight(20),
  },
  Exit: {
    color: color.venetianRed,
    fontFamily: fontFamily.Medium,
  },
});
