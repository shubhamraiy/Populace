import {color, fontSize, fontWeight} from '@styles';
import {Utils} from '@Utils';
import React from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

const MyFlash = (props: any) => {
  const {msg, type} = props;
  const bgColor =
    type === 'danger'
      ? color.danger
      : type === 'success'
      ? color.lightGreen
      : type === 'warning'
      ? color.warning
      : type === 'info'
      ? color.info
      : color.danger;
  return (
    <SafeAreaView style={[styles.container, {backgroundColor: bgColor}]}>
      {/*{Platform.OS === 'android' && <StatusBar backgroundColor={bgColor} barStyle='default' hidden={true} />}*/}
      <Text style={styles.tvMsg}>{msg}</Text>
    </SafeAreaView>
  );
};
export default MyFlash;

const styles = StyleSheet.create({
  container: {
    height: Utils.calculateHeight(
      Platform.OS === 'ios'
        ? Utils.calculateHeight(80)
        : Utils.calculateHeight(60),
    ),
    width: '100%',
  },
  tvMsg: {
    padding: 10,
    color: color.white,
    fontSize: fontSize.size_16,
    fontWeight: '400',
  },
});
