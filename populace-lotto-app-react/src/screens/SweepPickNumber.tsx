import React, { useEffect, useState } from 'react';
import { Navigation, NavigationComponentProps } from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import { ImageBackground, StyleSheet, Text, View } from 'react-native';
import { Utils } from '@Utils';
import { color, fontFamily, fontSize } from '@styles';
import CircleView from '@components/CircleView';
import CustomButton from '@components/CustomButton';
import { Navigator } from '@Navigator';
import { screenName } from '@screenName';
import { ApiServices } from '../services/ApiServices';
import { ApiEndPoint } from '../services/ApiEndPoint';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const SweepPickNumber: React.FC<Props> = props => {
  const { propsData } = props;
  const fromHome = props?.propsData?.fromHome ?? false;
  const [result, setResult] = useState<any>();
  const [fromTable, setfromTable] = useState(false);
  const [numberOne, setNumberOne] = useState([]);
  const [numberTwo, setNumberTwo] = useState([]);
  const [numberThree, setNumberThree] = useState([]);
  const [lnumberOne, setlNumberOne] = useState([]);
  const [lnumberTwo, setlNumberTwo] = useState([]);
  const [lnumberThree, setlNumberThree] = useState([]);
  const [selectedData, setselectedData] = useState([]);
  const [currentUser, setCurrentUser] = useState<any>()
  const [day, setDay] = useState<any>()
  const [hour, setHour] = useState<any>()
  const [minute, setMinute] = useState<any>()
  const [second, setSecond] = useState<any>()
  const [day1, setDay1] = useState<any>()
  const [hour1, setHour1] = useState<any>()
  const [minute1, setMinute1] = useState<any>()
  const [second1, setSecond1] = useState<any>()
  const checkDate: any = new Date().getTime();

  useEffect(() => {
    if (!fromTable) {
      if (fromHome) {
        getDrawDetailsfromHome();
      } else {
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
      }
    }
  }, []);



  const getDrawDetailsfromHome = () => {
    setCurrentUser(propsData?.currentUser)
    setResult(propsData?.result);
    setNumberOne(propsData?.numberOne);
    setNumberTwo(propsData?.numberTwo);
    setNumberThree(propsData?.numberThree);
    setlNumberOne(propsData?.lnumberOne);
    setlNumberTwo(propsData?.lnumberTwo);
    setlNumberThree(propsData?.lnumberThree);
    setselectedData(propsData?.selctednumber)
  }

  const getDrawDetails = async () => {
    const json = JSON.stringify({ id: await Utils._getUserId() });
    const response: any = await ApiServices.post(ApiEndPoint.drawDetails, json);
    var lotteryDate0 = new Date(response?.data?.lotteryDraw[0]?.timerDate).getTime()
    var lotteryDate1 = new Date(response?.data?.lotteryDraw[1]?.timerDate).getTime()

    if (response?.status) {
      if (checkDate < lotteryDate0) {
        setResult(response?.data?.lotteryDraw[0]);
      } else {
        setResult(response?.data?.lotteryDraw[1]);
      }
      setNumberOne(response?.data?.numberSelectedByUser[0]?.numbers1);
      setNumberTwo(response?.data?.numberSelectedByUser[1]?.numbers2);
      setNumberThree(response?.data?.numberSelectedByUser[2]?.numbers3);
      setlNumberOne(response?.data?.lastDrawnumberSelectedByUser[0]?.numbers1);
      setlNumberTwo(response?.data?.lastDrawnumberSelectedByUser[1]?.numbers2);
      setlNumberThree(response?.data?.lastDrawnumberSelectedByUser[2]?.numbers3);
      setselectedData(response?.data?.lastDrawnumberSelectedByUser)
    }
  };

  useEffect(() => {
    if (result) {
      countDown(result?.timerDate);
    }
  }, [result, second]);

  useEffect(() => {
    if (selectedData.length > 0) {
      if (result) {
        countDown1(result?.timerDate);
      }
    }
  }, [result, second1]);



  // var get = Utils.getSeconds("2023-02-21T15:30:00.000Z");
  // var getH = Utils.toHHMMSS(get);
  // console.log("getH", getH);

  const countDown = (timerDate: any) => {
    var countDownDate = new Date(timerDate).getTime();
    // var countDownDate = new Date("2023-02-21T15:30:00.000Z").getTime();
    var checknow = new Date().getTime();
    if (countDownDate > checknow) {
      var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        days = Utils.addZero(days);
        setDay(days);
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        hours = Utils.addZero(hours);
        setHour(hours);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        minutes = Utils.addZero(minutes);
        setMinute(minutes);
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        seconds = Utils.addZero(seconds);
        setSecond(seconds);
        if (distance < 0) {
          clearInterval(x);
        }
      }, 1000);
    } else {
      setDay('00')
      setHour('00')
      setMinute('00')
      setSecond('00')
    }
  }

  const countDown1 = (timerDate: any) => {
    const newtimerDate = Utils.addHours(timerDate, 1);
    // const newtimerDate = Utils.addHours("2023-02-21T15:30:00.000Z", 1);
    var countDownDate = new Date(newtimerDate).getTime();
    var checknow = new Date().getTime();
    if (countDownDate > checknow) {
      var x = setInterval(function () {
        var now = new Date().getTime();
        var distance = countDownDate - now;
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        days = Utils.addZero(days);
        setDay1(days);
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        hours = Utils.addZero(hours);
        setHour1(hours);
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        minutes = Utils.addZero(minutes);
        setMinute1(minutes);
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        seconds = Utils.addZero(seconds);
        setSecond1(seconds);
        if (distance < 0) {
          clearInterval(x);
        }
      }, 1000);
    } else {
      setDay1('00')
      setHour1('00')
      setMinute1('00')
      setSecond1('00')
    }
  }


  const _renderNumbers = (list: any, type: number) => {
    return (
      <View style={styles.rowContainer}>
        <CircleView title={list?.length > 0 ? list[0] : ''} marginStart={0} />
        <CircleView title={list?.length > 1 ? list[1] : ''} />
        <CircleView title={list?.length > 2 ? list[2] : ''} />
        <CircleView title={list?.length > 3 ? list[3] : ''} />
        <CircleView title={list?.length > 4 ? list[4] : ''} />
        <CircleView title={list?.length > 5 ? list[5] : ''} borderWidth={2} />

        <CustomButton
          marginStart={8}
          title={list?.length > 0 ? 'Edit' : 'Pick your\nnumbers'}
          paddingHorizontal={12}
          FontSize={fontSize.size_12}
          width={list?.length > 0 ? Utils.calculateWidth(85) : undefined}
          height={42}
          onPress={() =>
            Navigator.setPush(props.componentId, screenName.SweepTableNumber, {
              list,
              callBack: (item: any) => {
                const arr = item?.map((i: any) => i.title);
                if (type === 1) {
                  setNumberOne(arr);
                } else if (type === 2) {
                  setNumberTwo(arr);
                } else {
                  setNumberThree(arr);
                }
              },
              fromscreen: (data: any) => { setfromTable(data) }
            })
          }
        />
      </View>
    );
  };

  const _renderNumbersLast = (list: any, type: number) => {
    return (
      <View style={styles.rowContainer}>
        <CircleView marginStart={0} title={list?.length > 0 ? list[0] : ''} backgroundColor={color.royalBlue} />
        <CircleView title={list?.length > 1 ? list[1] : ''} backgroundColor={color.royalBlue} />
        <CircleView title={list?.length > 2 ? list[2] : ''} backgroundColor={color.royalBlue} />
        <CircleView title={list?.length > 3 ? list[3] : ''} backgroundColor={color.royalBlue} />
        <CircleView title={list?.length > 4 ? list[4] : ''} backgroundColor={color.royalBlue} />
        <CircleView title={list?.length > 4 ? list[4] : ''} backgroundColor={color.ultramarineBlue} titleColor={color.black} borderWidth={0} />
      </View>
    );
  };

  return (
    <MySafeArea componentId={props.componentId} isScroll={true} padding={20}>
      <ImageBackground
        resizeMode="stretch"
        source={require('@images/btn_bg.png')}
        style={styles.container}>
        <Text style={styles.tvSweep}>
          {`Sweep stakes drawing is scheduled for\n${result?.scheduledDate} - ${result?.scheduledDay}`}
        </Text>
      </ImageBackground>

      <Text
        style={
          styles.tvDrewCut
        }>{`Draw cut -off time : ${result?.cutOffTime}`}</Text>
      <Text style={styles.tvRemaining}>Remaining Time</Text>
      <Text style={styles.tvTime}>{day > 0 ? day ?? '00' + "h : " : ""}{hour ?? '00'}h : {minute ?? '00'}m : {second ?? '00'}s</Text>

      {currentUser?.subscription?.tier >= 'tier1' && _renderNumbers(numberOne, 1)}
      {currentUser?.subscription?.tier >= 'tier2' && _renderNumbers(numberTwo, 2)}
      {currentUser?.subscription?.tier >= 'tier3' && _renderNumbers(numberThree, 3)}
      {/*{result?.numberSelectedByUser.map((i: any) => _renderNumbers(i))}*/}
      <CustomButton
        marginTop={Utils.calculateHeight(50)}
        title={'+ Submit'}
        marginHorizontal={Utils.calculateWidth(30)}
        onPress={() => {
          if (
            numberOne?.length > 0 ||
            numberTwo?.length > 0 ||
            numberThree?.length > 0
          ) {
            Navigator.showOverlay(screenName.PopUpSubmitNumber, {
              numberOne,
              numberTwo,
              numberThree,
              result,
            });
          } else {
            Navigator.showAlert('Please pick number');
          }
        }}
      />

      <Text style={styles.tvResult}>Results will be out in</Text>
      <Text style={styles.tvTimeOut}>{selectedData.length > 0 ? day1 > 0 ? day1 ?? "00" + ":" : "" + hour1 ?? "00" + ":" + minute1 ?? "00" + ":" + second : result?.scheduledTime}</Text>
      <Text style={styles.tvPickNumber}>Picked Numbers</Text>
      {selectedData.length > 0 &&
        <>
          {currentUser?.subscription?.tier >= 'tier1' && _renderNumbersLast(lnumberOne, 1)}
          {currentUser?.subscription?.tier >= 'tier2' && _renderNumbersLast(lnumberTwo, 2)}
          {currentUser?.subscription?.tier >= 'tier3' && _renderNumbersLast(lnumberThree, 3)}
        </>
      }
    </MySafeArea>
  );
};

export default SweepPickNumber;

const styles = StyleSheet.create({
  container: {
    height: 58,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },

  tvSweep: {
    fontSize: fontSize.size_13,
    fontFamily: fontFamily.Bold,
    color: color.white,
    textAlign: 'center',
  },

  tvDrewCut: {
    marginTop: 20,
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Medium,
    color: color.white,
    textAlign: 'center',
  },
  tvRemaining: {
    marginTop: 15,
    fontSize: fontSize.size_13,
    fontFamily: fontFamily.Medium,
    color: color.white,
    textAlign: 'center',
  },
  tvTime: {
    marginTop: Utils.calculateHeight(3),
    fontSize: fontSize.size_13,
    fontFamily: fontFamily.SemiBold,
    color: color.royalBlue,
    textAlign: 'center',
  },

  tvResult: {
    marginTop: Utils.calculateHeight(45),
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Bold,
    color: color.white,
    textAlign: 'center',
  },
  tvTimeOut: {
    marginTop: Utils.calculateHeight(3),
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.Bold,
    color: color.royalBlue,
    textAlign: 'center',
  },
  tvPickNumber: {
    marginTop: Utils.calculateHeight(10),
    fontSize: fontSize.size_12,
    fontFamily: fontFamily.SemiBold,
    color: color.white,
    textAlign: 'center',
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Utils.calculateHeight(35),
  },
  rowContainerBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Utils.calculateHeight(16),
    marginBottom: Utils.calculateHeight(16),
  },
});
