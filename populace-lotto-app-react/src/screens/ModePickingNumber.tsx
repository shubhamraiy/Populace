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
            setUserData(user)
            // data[0].isEnabled = user?.manualPick
            // data[1].isEnabled = user?.autoRandomPick
            // data[2].isEnabled = user?.autoSpecificPick
            setData([{
              id: 1,
              _id: 'manualPick',
              title: 'Manual Pick',
              subTitle: '',
              isEnabled: user?.manualPick,
            },
            {
              id: 2,
              _id: 'autoRandomPick',
              title: 'Auto Random Pick',
              subTitle: '',
              isEnabled: user?.autoRandomPick,
            },
            {
              id: 3,
              _id: 'autoSpecificPick',
              title: 'Auto Specific Pick',
              subTitle: 'Choose your specific number',
              isEnabled: user?.autoSpecificPick,
            }])
          })
        }
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, [userData])

  // console.log(userData);


  // const getUser = async () => {
  //   await Utils._getUserData().then((user) => {
  //     setUserData(user)
  //     data[0].isEnabled = user?.manualPick
  //     data[1].isEnabled = user?.autoRandomPick
  //     data[2].isEnabled = user?.autoSpecificPick
  //   })
  // }

  const submitApi = async (v: boolean, id: number) => {
    var url = ''
    var _id = await Utils._getUserId()
    var body = {}
    if (id === 1) {
      url = ApiEndPoint.manualNumberPick
      body = {
        id: _id,
        manualPick: v,
      }
    } else if (id === 2) {
      url = ApiEndPoint.autoRandomPick
      body = {
        id: _id,
        autoRandomPick: v,
      }
    } else if (id === 3) {
      url = ApiEndPoint.autoSpecificPick
      body = {
        id: _id,
        autoSpecificPick: v,
      }
    }

    const response: any = await ApiServices.post(url, JSON.stringify(body));
    if (response?.status) {
      Navigator.showAlert(response.message, 'success');
      if (response?.data?.autoSpecificPick && response?.data?.specificNumberList === null) {
        Navigator.setPush(props.componentId, screenName.SweepTableNumber, {
          isSubmit: true
        })
      }

      let users = { ...userData }

      if (id === 1) {
        users.manualPick = response?.data?.manualPick
      } else if (id === 2) {
        users.autoRandomPick = response?.data?.autoRandomPick
      } else if (id === 3) {
        users.autoSpecificPick = response?.data?.autoSpecificPick
      }
      await Utils._setUserData(users);
    }



    // if (id === 1) {
    //   const response: any = await ApiServices.post(
    //     ApiEndPoint.manualNumberPick,
    //     JSON.stringify({
    //       id: await Utils._getUserId(),
    //       manualPick: v,
    //     }),
    //   );
    //   if (response?.status) {
    //     Navigator.showAlert(response.message, 'success');

    //   }
    // }

    // if (id === 2) {
    //   const response: any = await ApiServices.post(
    //     ApiEndPoint.autoRandomPick,
    //     JSON.stringify({
    //       id: await Utils._getUserId(),
    //       autoRandomPick: v,
    //     }),
    //   );
    //   console.log(response);

    //   if (response?.status) {
    //     Navigator.showAlert(response.message, 'success');
    //   }
    // }
    // if (id === 3) {
    //   const response: any = await ApiServices.post(
    //     ApiEndPoint.autoSpecificPick,
    //     JSON.stringify({
    //       id: await Utils._getUserId(),
    //       autoSpecificPick: v,
    //     }),
    //   );
    //   if (response?.status) {
    //     Navigator.showAlert(response.message, 'success');
    //     if (response?.data?.autoSpecificPick && response?.data?.specificNumberList === null) {
    //       Navigator.setPush(props.componentId, screenName.SweepTableNumber, {
    //         isSubmit: true
    //       })
    //     }
    //   }
    // }
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
            await submitApi(v, item.id);
            const filterArr = data.map((i, p) => {
              // if (index === p) {
              //   i.isEnabled = !item.isEnable;
              // }
              if (index === p) {
                i.isEnabled = !item.isEnable;
              }else{
                i.isEnabled = false
              }
              return i;
            });
            setData(filterArr);
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
