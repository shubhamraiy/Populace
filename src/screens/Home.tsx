import {
  RefreshControl,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  View,
  Alert,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Navigation, NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {Utils} from '@Utils';
import {fontSize, fontFamily, color, fontWeight} from '@styles';
import {screenName} from '@screenName';
import {Navigator} from '@Navigator';
import {ApiServices} from 'services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';
import Loader from '@components/Loader';
import IncPaymnetModal from '@components/IncompletePayment';

export interface Props extends NavigationComponentProps {}

const Home: React.FC<Props> = props => {
  const [status, setStatus] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [result, setResult] = useState<any>();
  const [numberOne, setNumberOne] = useState([]);
  const [numberTwo, setNumberTwo] = useState([]);
  const [numberThree, setNumberThree] = useState([]);
  const [lnumberOne, setlNumberOne] = useState([]);
  const [lnumberTwo, setlNumberTwo] = useState([]);
  const [lnumberThree, setlNumberThree] = useState([]);
  const [selctednumber, setselctednumber] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>();
  const [isIncPay, setisIncPay] = useState(false);

  const checkDate: any = new Date().getTime();

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: () => {
          getUser();
        },
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);

  const getUser = async () => {
    await Utils._getUserData().then(async user => {
      setLoading(true);
      setCurrentUser(user);
      await SubscriptionCheck(user);
    });
    await getDrawDetails();
  };

  useEffect(() => {
    getUser();
  }, [isIncPay]);

  const SubscriptionCheck = async (user: any) => {
    setLoading(true);
    const json = JSON.stringify({
      playerId: user.id,
    });
    await ApiServices.post(ApiEndPoint.getPlayerInfo, json)
      .then(async (response: any) => {
        setLoading(false);
        console.log('Subscription check', JSON.stringify(response));
        if (response?.status) {
          await Utils._setUserData(response?.data);
          setCurrentUser(response?.data);
          if (Object.keys(response?.data?.subscription || {}).length > 0) {
            // console.log('isPaymentIncomplete', response?.data?.subscription);
            if (response?.data?.subscription?.status === 'incomplete') {
              setisIncPay(true);
            }
          } else {
            Navigator.setRoot(screenName.Subscription, {isShow: true});
          }
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const getDrawDetails = async () => {
    setLoading(true);
    const json = JSON.stringify({id: await Utils._getUserId()});
    console.log(json);

    await ApiServices.post(ApiEndPoint.drawDetails, json)
      .then((response: any) => {
        // console.log('getDrawDetails------', JSON.stringify(response));

        setLoading(false);
        setStatus(response?.status);
        var lotteryDate0 = new Date(
          response?.data?.lotteryDraw[0]?.timerDate,
        ).getTime();
        var lotteryDate1 = new Date(
          response?.data?.lotteryDraw[1]?.timerDate,
        ).getTime();
        console.log(checkDate, lotteryDate0);

        if (response?.status) {
          if (checkDate < lotteryDate0) {
            setResult(response?.data?.lotteryDraw[0]);
          } else {
            if (response?.data?.lotteryDraw[1] !== undefined) {
              setResult(response?.data?.lotteryDraw[1]);
            } else {
              setResult(response?.data?.lotteryDraw[0]);
            }
          }
          setNumberOne(response?.data?.numberSelectedByUser[0]?.numbers1);
          setNumberTwo(response?.data?.numberSelectedByUser[1]?.numbers2);
          setNumberThree(response?.data?.numberSelectedByUser[2]?.numbers3);
          setlNumberOne(
            response?.data?.lastDrawnumberSelectedByUser[0]?.numbers1,
          );
          setlNumberTwo(
            response?.data?.lastDrawnumberSelectedByUser[1]?.numbers2,
          );
          setlNumberThree(
            response?.data?.lastDrawnumberSelectedByUser[2]?.numbers3,
          );
          setselctednumber(response?.data?.lastDrawnumberSelectedByUser);
        }
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const gotoScreen = (type?: number) => {
    let name = '';
    if (type === 1) {
      name = screenName.DiscountServices;
    } else if (type === 2) {
      name = screenName.SweepPickNumber;
    } else if (type === 3) {
      name = screenName.FinancialServices;
    } else if (type === 4) {
      name = screenName.InsuranceServices;
    }

    if (type === 2 && status) {
      if (currentUser.subscription?.status === 'active') {
        Navigator.setPush(props.componentId, name, {
          result: result,
          currentUser: currentUser,
          numberOne: numberOne,
          numberTwo: numberTwo,
          numberThree: numberThree,
          lnumberOne: lnumberOne,
          lnumberTwo: lnumberTwo,
          lnumberThree: lnumberThree,
          selctednumber: selctednumber,
          fromHome: true,
        });
      } else {
        Alert.alert(
          `Your membership has ${
            currentUser?.subscription?.status || 'inactive'
          }!`,
          "To play, you'll need to purchase the subscription plan.",
        );
      }
    } else if (type === 1 || type === 3 || type === 4) {
      Navigator.setPush(props.componentId, name);
    }
  };

  const _renderBgBtn = (
    title: string,
    marginTop: any,
    width?: any,
    type?: number,
  ) => {
    return (
      <Pressable disabled={isLoading} onPress={() => gotoScreen(type)}>
        <ImageBackground
          resizeMode="stretch"
          source={require('@images/btn_bg.png')}
          style={{
            height: Utils.calculateHeight(66),
            width: width ?? '100%',
            justifyContent: 'center',
            marginTop: marginTop,
            alignItems: 'center',
            alignSelf: 'center',
            // marginTop: Utils.calculateHeight(70),
          }}>
          <Text style={width ? styles.tvPlayNow : styles.tvBtnTitle}>
            {title}
          </Text>
        </ImageBackground>
      </Pressable>
    );
  };

  return (
    <MySafeArea
      IsRefresh={isIncPay || currentUser}
      refreshControl={
        <RefreshControl
          refreshing={isLoading}
          tintColor="#fff"
          onRefresh={() => {
            if (currentUser?.email !== undefined) {
              SubscriptionCheck(currentUser);
            }
            getDrawDetails();
          }}
        />
      }
      componentId={props.componentId}
      isHideBack
      isScroll={true}>
      {_renderBgBtn(
        'Discount Network',
        Utils.calculateHeight(16),
        undefined,
        1,
      )}

      <Text style={styles.tvSweepstakes}>{'Sweepstakes \nDrawing'}</Text>
      <Text style={styles.tvDate}>{result?.scheduledDate || 'N/A'}</Text>
      {/* {isLoading && <Loader />} */}
      <Text style={styles.tvMillion}>$5 Million</Text>
      {_renderBgBtn(
        'Play Now',
        Utils.calculateHeight(8),
        Utils.calculateWidth(230),
        2,
      )}
      {_renderBgBtn(
        'Financial Services',
        Utils.calculateHeight(42),
        undefined,
        3,
      )}
      {_renderBgBtn(
        'Insurance Services',
        Utils.calculateHeight(34),
        undefined,
        4,
      )}
      <IncPaymnetModal isVisible={isIncPay} setIssVisible={setisIncPay} />
    </MySafeArea>
  );
};

export default Home;

const styles = StyleSheet.create({
  tvBtnTitle: {
    fontSize: fontSize.size_28,
    fontFamily: fontFamily.SairaSemiCondensedSemiBold,
    color: color.white,
    textAlign: 'center',
    fontWeight: '700',
  },
  tvPlayNow: {
    fontSize: fontSize.size_20,
    fontFamily: fontFamily.SemiBold,
    color: color.white,
    textAlign: 'center',
  },
  tvSweepstakes: {
    marginTop: Utils.calculateHeight(22),
    fontSize: fontSize.size_34,
    fontFamily: fontFamily.SairaSemiCondensedSemiBold,
    color: color.white,
    fontWeight: '800',
    textAlign: 'center',
    lineHeight: 38.14,
  },
  tvDate: {
    marginTop: Utils.calculateHeight(10),
    fontSize: fontSize.size_22,
    fontFamily: fontFamily.Bold,
    color: color.white,
    textAlign: 'center',
  },
  tvMillion: {
    marginTop: Utils.calculateHeight(20),
    fontSize: fontSize.size_30,
    fontFamily: fontFamily.Bold,
    color: color.vividCerulean,
    textAlign: 'center',
  },
  tvRemaining: {
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Medium,
    color: color.white,
    textAlign: 'center',
  },
});
