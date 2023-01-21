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

export interface Props extends NavigationComponentProps { }

const SweepPickNumber: React.FC<Props> = props => {
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

    if (response?.status) {
      setResult(response?.data);
      setNumberOne(response?.data?.numberSelectedByUser[0]?.numbers1);
      setNumberTwo(response?.data?.numberSelectedByUser[1]?.numbers2);
      setNumberThree(response?.data?.numberSelectedByUser[2]?.numbers3);
    }
  };

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
            })
          }
        />
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
      <Text style={styles.tvTime}>30h : 20m : 22s</Text>

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
      <Text style={styles.tvTimeOut}>{result?.scheduledTime}</Text>
      <Text style={styles.tvPickNumber}>Picked Numbers</Text>

      {/*<View style={styles.rowContainerBottom}>*/}
      {/*  <CircleView*/}
      {/*    marginStart={0}*/}
      {/*    title={2}*/}
      {/*    backgroundColor={color.royalBlue}*/}
      {/*  />*/}
      {/*  <CircleView*/}
      {/*    title={selectedData[0]?.title}*/}
      {/*    backgroundColor={color.royalBlue}*/}
      {/*  />*/}
      {/*  <CircleView*/}
      {/*    title={selectedData[0]?.title}*/}
      {/*    backgroundColor={color.royalBlue}*/}
      {/*  />*/}
      {/*  <CircleView*/}
      {/*    title={selectedData[0]?.title}*/}
      {/*    backgroundColor={color.royalBlue}*/}
      {/*  />*/}
      {/*  <CircleView*/}
      {/*    title={selectedData[0]?.title}*/}
      {/*    backgroundColor={color.royalBlue}*/}
      {/*  />*/}

      {/*  <CircleView*/}
      {/*    titleColor={color.black}*/}
      {/*    borderWidth={0}*/}
      {/*    title={24}*/}
      {/*    backgroundColor={color.ultramarineBlue}*/}
      {/*  />*/}
      {/*</View>*/}
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
