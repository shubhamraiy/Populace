import { StyleSheet, Text, View } from 'react-native';
import CustomButton from '@components/CustomButton';
import { color, fontFamily, fontSize } from '@styles';
import { Navigator } from '@Navigator';
import { Navigation, NavigationComponentProps } from 'react-native-navigation';
import React from 'react';
import { Utils } from '@Utils';
import { ApiEndPoint } from 'services/ApiEndPoint';
import { ApiServices } from 'services/ApiServices';
import { screenName } from '@screenName';

export interface Props extends NavigationComponentProps {
  propsData: any
}

const PopUpCancelPlan: React.FC<Props> = props => {
  const { propsData } = props

  const cancleCurrentPlan = async () => {
    const json = JSON.stringify({
      id: await Utils._getUserId()
    });
    const response: any = await ApiServices.post(ApiEndPoint.cancelSubscription, json);
    if (response?.status) {
      await Utils._setUserData(response?.data);
      if (propsData?.isShow) {
        Navigator.setHome()
      }
      Navigator.dismissOverlay()
      Navigator.setMergeOption(props.componentId, 2);
      Navigator.showAlert(response?.message, 'success')
    }
  }


  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <Text style={styles.tvRegister}>
          Are you sure you want to cancel the current plan?
        </Text>


        <CustomButton
          marginTop={Utils.calculateHeight(45)}
          backgroundColor={color.white}
          titleColor={color.black}
          title={'Yes'}
          onPress={cancleCurrentPlan}
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

export default PopUpCancelPlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  centerContainer: {
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
