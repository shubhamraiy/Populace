import React, { useState, useEffect } from 'react';
import { NavigationComponentProps, Navigation } from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import { FlatList, StyleSheet, Switch, Text, View } from 'react-native';
import { color, fontFamily, fontSize } from '@styles';
import { Utils } from '@Utils';
import { Navigator } from '@Navigator';
import { screenName } from '@screenName';
import { ApiServices } from '../services/ApiServices';
import { ApiEndPoint } from '../services/ApiEndPoint';

export interface Props extends NavigationComponentProps { }

const ModePickingNumber: React.FC<Props> = props => {
  const [userData, setUserData] = useState<any>()

  const [data, setData] = useState([
    {
      id: 1,
      _id: 'manualPick',
      title: 'Manual Pick',
      subTitle: '',
      isEnabled: false,
    },
    {
      id: 2,
      _id: 'autoRandomPick',
      title: 'Auto Random Pick',
      subTitle: '',
      isEnabled: false,
    },
    {
      id: 3,
      _id: 'autoSpecificPick',
      title: 'Auto Specific Pick',
      subTitle: 'Choose your specific number',
      isEnabled: false,
    },
  ]);

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: () => {
          Utils._getUserData().then(user => {
            let sdata = [...data]
            sdata[0].isEnabled = user?.manualPick
            sdata[1].isEnabled = user?.autoRandomPick
            sdata[2].isEnabled = user?.autoSpecificPick
            setData(sdata)
            setUserData(user)
          })
        }
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, [userData])

  const submitApi = async (v: boolean, id: number) => {
    let _id = await Utils._getUserId()
    let users = { ...userData }

    if (id === 1) {
      await ApiServices.post(ApiEndPoint.manualNumberPick, JSON.stringify({
        id: _id,
        manualPick: true,
      }))
        .then(async (response: any) => {
          if (response?.status) {
            Navigator.showAlert(response.message, 'success');
            users.manualPick = true
            users.autoRandomPick = false
            users.autoSpecificPick = false
            await Utils._setUserData(users);

            await ApiServices.post(ApiEndPoint.autoRandomPick, JSON.stringify({
              id: _id,
              autoRandomPick: false,
            }))
            await ApiServices.post(ApiEndPoint.autoSpecificPick, JSON.stringify({
              id: _id,
              autoSpecificPick: false,
            }))
          }
        })
    } else if (id === 2) {
      await ApiServices.post(ApiEndPoint.autoRandomPick, JSON.stringify({
        id: _id,
        autoRandomPick: true,
      }))
        .then(async (response: any) => {
          if (response?.status) {
            Navigator.showAlert(response.message, 'success');
            users.manualPick = false
            users.autoRandomPick = true
            users.autoSpecificPick = false
            await Utils._setUserData(users);

            await ApiServices.post(ApiEndPoint.manualNumberPick, JSON.stringify({
              id: _id,
              manualPick: false,
            }))
            await ApiServices.post(ApiEndPoint.autoSpecificPick, JSON.stringify({
              id: _id,
              autoSpecificPick: false,
            }))
          }
        })
    } else if (id === 3) {
      await ApiServices.post(ApiEndPoint.autoSpecificPick, JSON.stringify({
        id: _id,
        autoSpecificPick: true,
      }))
        .then(async (response: any) => {
          if (response?.status) {
            Navigator.showAlert(response.message, 'success');
            users.manualPick = false
            users.autoRandomPick = false
            users.autoSpecificPick = true
            await Utils._setUserData(users);

            await ApiServices.post(ApiEndPoint.manualNumberPick, JSON.stringify({
              id: _id,
              manualPick: false,
            }))
            await ApiServices.post(ApiEndPoint.autoRandomPick, JSON.stringify({
              id: _id,
              autoRandomPick: false,
            }))
            if (response?.data?.autoSpecificPick && response?.data?.specificNumberList === null) {
              Navigator.setPush(props.componentId, screenName.SweepTableNumber, {
                isSubmit: true
              })
            }
          }
        })
    }
  };

  const _renderSwitch = (item: any, index: number) => {
    return (
      <View style={styles.rowContainer}>
        <View>
          <Text style={styles.tvTitle}>{item.title}</Text>
          {item.subTitle && (
            <Text
              onPress={() => {
                if (item.id === 3) {
                  Navigator.setPush(
                    props.componentId,
                    screenName.ViewPickNumber,
                  );
                }
              }}
              style={styles.tvSubTitle}>
              {item.subTitle}
            </Text>
          )}
        </View>

        <Switch
          trackColor={{ false: '#B8B8B8', true: color.sapphireBlue }}
          thumbColor={item.isEnabled ? color.white : color.white}
          ios_backgroundColor={'#B8B8B8'}
          onValueChange={async v => {
            var Idd = item?._id
            if (Idd == item?._id) {
              const filterArr = data.map((i, p) => {
                // if (index === p) {
                //   i.isEnabled = !item.isEnable;
                // }
                if (index === p) {
                  i.isEnabled = true;
                } else {
                  i.isEnabled = false
                }
                return i;
              });
              setData(filterArr);
            }
            await submitApi(v, item.id);
            // const filterArr = data.map((i, p) => {
            // if (index === p) {
            //   i.isEnabled = !item.isEnable;
            // }
            // if (index === p) {
            //   i.isEnabled = !item.isEnable;
            // }else{
            //   i.isEnabled = false
            // }
            // return i;
            // });
            // setData(filterArr);

          }}

          value={item.isEnabled}
        />
      </View>
    );
  };

  return (
    <MySafeArea componentId={props.componentId}>
      <Text style={styles.tvModeTitle}>Mode Of Picking Numbers</Text>

      <FlatList
        style={{ marginTop: Utils.calculateHeight(50) }}
        data={data}
        renderItem={({ item, index }) => _renderSwitch(item, index)}
      />
    </MySafeArea>
  );
};

export default ModePickingNumber;

const styles = StyleSheet.create({
  tvModeTitle: {
    marginTop: Utils.calculateHeight(80),
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    color: color.white,
    textAlign: 'center',
  },

  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: Utils.calculateHeight(60),
    borderBottomWidth: 1,
    borderBottomColor: 'white',
  },

  tvTitle: {
    fontSize: fontSize.size_16,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  tvSubTitle: {
    fontSize: fontSize.size_10,
    fontFamily: fontFamily.Medium,
    color: color.sapphireBlue,
  },
});
