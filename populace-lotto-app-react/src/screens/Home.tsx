import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native';
import React, { useState, useEffect } from 'react';
import { Navigation, NavigationComponentProps } from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import { Utils } from '@Utils';
import { fontSize, fontFamily, color, fontWeight } from '@styles';
import { screenName } from '@screenName';
import { Navigator } from '@Navigator';
import { ApiServices } from 'services/ApiServices';
import { ApiEndPoint } from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps { }

const Home: React.FC<Props> = props => {
  const [status, setStatus] = useState(false);
  const [result, setResult] = useState<any>();
  const [numberOne, setNumberOne] = useState([]);
  const [numberTwo, setNumberTwo] = useState([]);
  const [numberThree, setNumberThree] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>()

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: () => {
          Utils._getUserData().then(user => {
            setCurrentUser(user)
          })
          getDrawDetails();
        }
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);


  const getDrawDetails = async () => {
    const json = JSON.stringify({ id: await Utils._getUserId() });
    const response: any = await ApiServices.post(ApiEndPoint.drawDetails, json);
    setStatus(response?.status)
    if (response?.status) {
      setResult(response?.data);
      setNumberOne(response?.data?.numberSelectedByUser[0]?.numbers1);
      setNumberTwo(response?.data?.numberSelectedByUser[1]?.numbers2);
      setNumberThree(response?.data?.numberSelectedByUser[2]?.numbers3);
    }
  };

  const _renderBgBtn = (
    title: string,
    marginTop: any,
    width?: any,
    type?: number,
  ) => {
    return (
      <Pressable
        onPress={() => {
          const name =
            type === 1
              ? screenName.SweepPickNumber
              : type === 2
                ? screenName.SweepPickNumber
                : type === 3
                  ? screenName.FinancialServices
                  : screenName.InsuranceServices;

          if ((type === 1 || type === 2) && status) {
            Navigator.setPush(props.componentId, name, {
              result: result,
              currentUser: currentUser,
              numberOne: numberOne,
              numberTwo: numberTwo,
              numberThree: numberThree
            });
          } else if (type === 3 || type === 4) {
            Navigator.setPush(props.componentId, name)
          }

        }}>
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
    <MySafeArea componentId={props.componentId} isHideBack isScroll={true}>
      {_renderBgBtn(
        'Discount Network',
        Utils.calculateHeight(16),
        undefined,
        1,
      )}

      <Text style={styles.tvSweepstakes}>{'Sweepstakes \nDrawing'}</Text>
      <Text style={styles.tvDate}>{result?.scheduledDate}</Text>
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
