import React, { useEffect, useState } from 'react';
import MySafeArea from '@components/MySafeArea';
import { StyleSheet, Text, View } from 'react-native';
import { Navigation, NavigationComponentProps } from 'react-native-navigation';
import CustomButton from '@components/CustomButton';
import CircleView from '@components/CircleView';
import { color, fontFamily, fontSize } from '@styles';
import { Utils } from '@Utils';
import { Navigator } from '@Navigator';
import { screenName } from '@screenName';
import { ApiServices } from 'services/ApiServices';
import { ApiEndPoint } from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps { }

const ViewPickNumber: React.FC<Props> = props => {

  const [result, setResult] = useState<any>([])

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: () => {
          getSpecificPickNumbersList()
        }
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);


  const getSpecificPickNumbersList = async () => {
    const response: any = await ApiServices.post(ApiEndPoint.specificPickNumbersList, JSON.stringify({
      id: await Utils._getUserId()
    }))
    if (response?.status) {
      console.log("dddd", response?.data?.autoSpecificPickNumbers);
      setResult(response?.data?.autoSpecificPickNumbers)
    } else {
      setResult([])
    }
  }

  const onDelete = async (id: any) => {

    const response: any = await ApiServices.post(ApiEndPoint.specificNumberDelete, JSON.stringify({
      playerId: await Utils._getUserId(),
      numberListId: id
    }))
    if (response?.status) {
      getSpecificPickNumbersList()
      Navigator.showAlert(response?.message, 'success')
    }
  }


  const _renderRoundBtn = (isMargin: boolean, list: any, id: any) => {

    return (
      <View
        style={{
          backgroundColor: 'rgba(10, 27, 90, 0.7)',
          paddingVertical: Utils.calculateHeight(10),
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 5,
          marginTop: Utils.calculateHeight(isMargin ? 67 : 30),
        }}>
        <View style={styles.rowContainer}>
          <CircleView
            marginStart={0}
            title={list[0]}
            borderWidth={0}
            backgroundColor={color.greenCyan}
          />
          <CircleView
            borderWidth={0}
            title={list[1]}
            backgroundColor={color.greenCyan}
          />
          <CircleView
            title={list[2]}
            borderWidth={0}
            backgroundColor={color.greenCyan}
          />
          <CircleView
            title={list[3]}
            borderWidth={0}
            backgroundColor={color.greenCyan}
          />
          <CircleView
            title={list[4]}
            borderWidth={0}
            backgroundColor={color.greenCyan}
          />
          <CircleView
            titleColor={color.black}
            borderWidth={0}
            title={list[5]}
            backgroundColor={color.caribbeanGreen}
          />
        </View>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: Utils.calculateHeight(23),
          }}>

          <CustomButton
            marginEnd={Utils.calculateWidth(10)}
            title={'Edit'}
            height={Utils.calculateHeight(42)}
            width={Utils.calculateWidth(85)}
            FontSize={fontSize.size_12}
            onPress={() => {

              Navigator.setPush(props.componentId, screenName.SweepTableNumber, {
                list: list,
                isSubmit: true,
                isEdit: true,
                numberListId: id
              })
            }}
          />

          <CustomButton
            title={'Delete'}
            height={Utils.calculateHeight(42)}
            marginStart={Utils.calculateWidth(10)}
            width={Utils.calculateWidth(85)}
            FontSize={fontSize.size_12}
            onPress={() => onDelete(id)}
          />

        </View>
      </View>
    );
  };

  return (
    <MySafeArea componentId={props.componentId} isScroll={true}>
      <Text style={styles.tvViewPick}>View Picked Numbers</Text>
      <CustomButton title={'+ Add New'}
        marginTop={Utils.calculateHeight(47)}
        onPress={() => Navigator.setPush(props.componentId, screenName.SweepTableNumber, {
          isSubmit: true
        })}
      />
      {console.log("result?.length", result?.length)}
      {result?.length > 0 && _renderRoundBtn(true, result[0]?.number, result[0]?._id)}
      {result?.length > 1 && _renderRoundBtn(false, result[1]?.number, result[1]?._id)}
      {result?.length > 2 && _renderRoundBtn(false, result[2]?.number, result[2]?._id)}

    </MySafeArea>
  );
};

export default ViewPickNumber;
const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: Utils.calculateHeight(40),
  },
  tvViewPick: {
    marginTop: Utils.calculateHeight(78),
    color: color.white,
    fontFamily: fontFamily.SemiBold,
    fontSize: fontSize.size_18,
    textAlign: 'center',
  },
});
