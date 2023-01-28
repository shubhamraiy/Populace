import React, { useEffect, useState } from 'react';
import { NavigationComponentProps } from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import { Alert, FlatList, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { Utils } from '@Utils';
import { color, fontFamily, fontSize } from '@styles';
import CustomButton from '@components/CustomButton';
import CircleView from '@components/CircleView';
import { Navigator } from '@Navigator';
import { ApiServices } from 'services/ApiServices';
import { ApiEndPoint } from 'services/ApiEndPoint';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const SweepTableNumber: React.FC<Props> = props => {
  const { propsData } = props;
  const [mainNumber, setMainNumber] = useState<any>([]);
  const [megaNumber, setMegaNumber] = useState<any>([]);
  const [mNumber, setmNumber] = useState<any>(
    propsData?.list ? propsData?.list[propsData?.list?.length - 1] : '',
  );



  useEffect(() => {
    // console.log(propsData);

    let arrMain: any = [];
    let arrMega: any = [];

    for (let i = 1; i <= 70; i++) {
      arrMain.push({
        title: i,
        isSelected: isSelected(i),
      });
    }
    for (let i = 1; i <= 25; i++) {
      arrMega.push({
        title: i,
        isSelected: mNumber === i,
      });
    }
    setMainNumber(arrMain);
    setMegaNumber(arrMega);
  }, []);


  const onSubmit = async (numArr: any) => {
    const arr = numArr.map((i: any) => i.title)
    if (propsData?.isEdit) {

      const response: any = await ApiServices.post(ApiEndPoint.specificNumberEdit, JSON.stringify({
        playerId: await Utils._getUserId(),
        numberListId: propsData?.numberListId,
        numbers: arr,
      }))

      if (response?.status) {
        Navigator.showAlert(response?.message, 'success')
        Navigator.setPop(props.componentId)
      }
    } else {
      const response: any = await ApiServices.post(ApiEndPoint.submitAutoSpecificNumber, JSON.stringify({
        id: await Utils._getUserId(),
        numbers: arr
      }))

      if (response?.status) {
        Navigator.showAlert(response?.message, 'success')
        Navigator.setPop(props.componentId)
      }
    }

  }

  const _selectedItems = (type: number, item: any, index: number) => {
    const arr = type === 1 ? mainNumber : megaNumber;

    const filterArr: any = arr.map((i: any, position: number) => {
      if (type === 1 && index === position) {
        i.isSelected = !item?.isSelected;
      } else if (type === 2) {
        i.isSelected = index === position;
        if (index === position) {
          setmNumber(i.title);
        }
      }
      return i;
    });

    if (type === 1) {
      setMainNumber(filterArr);
    } else {
      setMegaNumber(filterArr);
    }
  };

  const isSelected = (title: any) => {
    for (let i = 0; i < propsData?.list?.length - 1; i++) {
      if (propsData?.list[i] === title) {
        return true;
      }
    }
    return false;
  };

  const getTitle = (index: number) => {
    const filterData: any = mainNumber.filter(
      (i: any, p: number) => i.isSelected,
    );
    // console.log('filterData',filterData[0].title);
    return filterData[index]?.title;
  };

  const _renderItems = (item: any, index: any, type: number) => {
    return (
      <Pressable
        onPress={() => {
          if (type === 1) {
            const filterMain: any = mainNumber.filter((i: any) => i.isSelected);

            if (
              filterMain.length > 4 &&
              mainNumber[index]?.isSelected === false
            ) {
              if (Platform.OS == 'android') {
                Alert.alert('Maximum 5 number allow');
              } else {
                Navigator.showAlert('Maximum 5 number allow');
              }
            } else {
              _selectedItems(type, item, index);
            }
          } else {
            _selectedItems(type, item, index);
          }
        }}
        style={[styles.renderContainer, {}]}>
        <CircleView
          title={item.title}
          borderWidth={0}
          backgroundColor={item.isSelected ? color.royalBlue : undefined}
        />
      </Pressable>
    );
  };

  const _renderList = (list: any, type: number) => {
    return (
      <FlatList
        style={{ marginTop: Utils.calculateHeight(7), alignSelf:'center'}}
        data={list}
        scrollEnabled={false}
        numColumns={7}
        renderItem={({ item, index }) => _renderItems(item, index, type)}
      />
    );
  };

  return (
    <MySafeArea
      componentId={props.componentId}
      isHideAppBar={true}
      padding={0}
      isScroll={true}>
      <Text style={{...styles.tvPickNumber, marginTop:Utils.calculateWidth(30), marginLeft:Utils.calculateWidth(30)}}>Pick your numbers</Text>

      <CustomButton
        title={'+ Submit'}
        marginTop={Utils.calculateHeight(30)}
        marginHorizontal={Utils.calculateWidth(30)}
        onPress={() => {
          const filterMain = mainNumber.filter((i: any) => i.isSelected);
          const filterMega = megaNumber.filter((i: any) => i.isSelected);

          if (filterMain.length !== 5) {
            Navigator.showAlert('Choose main number');
          } else if (filterMega.length !== 1) {
            Navigator.showAlert('Choose mega number');
          } else {
            if (propsData?.isSubmit) {
              onSubmit([...filterMain, ...filterMega])
            } else {
              propsData?.callBack([...filterMain, ...filterMega]);
              propsData?.fromscreen(true)
              Navigator.setPop(props.componentId);
            }
          }
        }}
      />

      <View style={styles.rowContainer}>
        <CircleView
          marginStart={0}
          title={getTitle(0)}
          backgroundColor={color.royalBlue}
        />
        <CircleView title={getTitle(1)} backgroundColor={color.royalBlue} />
        <CircleView title={getTitle(2)} backgroundColor={color.royalBlue} />
        <CircleView title={getTitle(3)} backgroundColor={color.royalBlue} />
        <CircleView title={getTitle(4)} backgroundColor={color.royalBlue} />
        <CircleView
          titleColor={color.black}
          borderWidth={0}
          title={mNumber}
          backgroundColor={color.ultramarineBlue}
        />
      </View>

      <View style={{...styles.viewDivider, marginHorizontal:Utils.calculateWidth(30)}} />
      <Text
        style={{...styles.tvClear}}
        onPress={() => {
          //To clear all data from array
          // const filterData: any = mainNumber.map((i: any) => {
          //   i.isSelected = false;
          //   return i;
          // });

          //To clear data one by one
          const Data: any = mainNumber.filter((i: any) => {
            return i.isSelected == true;
          });
          const index: any = mainNumber.findIndex((obj: any) => {
            if (Data.length > 0) {
              return obj.title === Data[Data.length - 1].title
            }
          })
          let filterData = [...mainNumber]
          if (index !== -1) {
            filterData[index].isSelected = false;
          }

          setMainNumber(filterData);
        }}>
        Clear
      </Text>

      <Text style={{...styles.tvChoose, marginLeft:Utils.calculateWidth(30)}}>Choose your main numbers</Text>

      {_renderList(mainNumber, 1)}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: Utils.calculateHeight(22),
          // marginBottom:Utils.calculateHeight(7),
          marginHorizontal:Utils.calculateWidth(30)
        }}>
        <Text style={[styles.tvChoose, { marginTop: 0 }]}>
          Choose your mega numbers
        </Text>
        <Text
          style={[styles.tvChoose, { marginTop: 0}]}
          onPress={() => {
            const filterData: any = megaNumber.map((i: any) => {
              i.isSelected = false;
              return i;
            });
            setMegaNumber(filterData);
            setmNumber('');
          }}>
          Clear
        </Text>
      </View>
      {_renderList(megaNumber, 2)}
      <View style={{height:20}} />
    </MySafeArea>
  );
};

export default SweepTableNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.black,
  },
  renderContainer: {
    // flex: 1 / 7,
    paddingHorizontal: 4,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: color.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewDivider: {
    borderWidth: 1,
    borderColor: color.white,
    marginTop: Utils.calculateHeight(28),
  },

  tvPickNumber: {
    fontSize: fontSize.size_16,
    fontFamily: fontFamily.Regular,
    color: color.white,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Utils.calculateHeight(38),
  },
  tvChoose: {
    marginTop: Utils.calculateHeight(48),
    marginBottom: Utils.calculateHeight(7),
    fontSize: fontSize.size_12,
    fontFamily: fontFamily.Medium,
    color: color.white,
  },
  tvClear: {
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Medium,
    color: color.sapphireBlue,
    alignSelf: 'flex-end',
    marginEnd: 30,
    marginTop: Utils.calculateHeight(5),
  },
});
