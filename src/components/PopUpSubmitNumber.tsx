import {StyleSheet, Text, View} from 'react-native';
import CustomButton from '@components/CustomButton';
import {color, fontFamily, fontSize} from '@styles';
import {Navigator} from '@Navigator';
import React, {useState} from 'react';
import {Utils} from '@Utils';
import {NavigationComponentProps} from 'react-native-navigation';
import {ApiServices} from '../services/ApiServices';
import {ApiEndPoint} from '../services/ApiEndPoint';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const PopUpSubmitNumber: React.FC<Props> = props => {
  const [isLoading, setLoading] = useState(false);
  const {propsData} = props;
  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.tvRegister}>
          Are you sure you want to submit the numbers?
        </Text>
        <Text style={styles.tvTitle}>
          Note: You will be able to download the pdf of the submitted numbers
          from your email
        </Text>

        <CustomButton
          isLoading={isLoading}
          marginTop={Utils.calculateHeight(45)}
          backgroundColor={color.white}
          titleColor={color.black}
          title={'Yes'}
          onPress={async () => {
            setLoading(true);

            // const arr = propsData.selectedData.map((i: any) => i.title);
            const json = JSON.stringify({
              id: await Utils._getUserId(),
              drawId: propsData?.result?._id,
              numbers1: propsData?.numberOne,
              numbers2: propsData?.numberTwo,
              numbers3: propsData?.numberThree,
            });
            const response: any = await ApiServices.post(
              ApiEndPoint.getSelectedNumber,
              json,
            )
              .then((response: any) => {
                setLoading(false);
                Navigator.dismissOverlay();
                if (response?.status) {
                  Navigator.showAlert(response?.message, 'success');
                }
              })
              .catch(() => {
                setLoading(false);
                Navigator.dismissOverlay();
              });
          }}
        />
        <CustomButton
          marginTop={Utils.calculateHeight(30)}
          backgroundColor={color.black}
          titleColor={color.white}
          title={'No'}
          onPress={() => Navigator.dismissOverlay()}
        />
      </View>
    </View>
  );
};

export default PopUpSubmitNumber;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerContainer: {
    marginTop: Utils.calculateHeight(110),
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
