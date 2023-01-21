import {StyleSheet, Text, View} from 'react-native';
import CustomButton from '@components/CustomButton';
import {color, fontFamily, fontSize} from '@styles';
import {Navigator} from '@Navigator';
import React from 'react';
import {Utils} from '@Utils';

const PopUpCancelPlan = () => {
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
          onPress={() => Navigator.dismissOverlay()}
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
