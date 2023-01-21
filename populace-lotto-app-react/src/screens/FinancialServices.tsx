import React from 'react';
import MySafeArea from '@components/MySafeArea';
import {StyleSheet, Text} from 'react-native';
import {NavigationComponentProps} from 'react-native-navigation';
import {color, fontFamily, fontSize} from '@styles';

export interface Props extends NavigationComponentProps {}
const FinancialServices: React.FC<Props> = props => {
  return (
    <MySafeArea componentId={props.componentId} padding={0}>
      <Text style={styles.tvComingSoon}>{'Services\nComing Soon'}</Text>
    </MySafeArea>
  );
};

export default FinancialServices;

const styles = StyleSheet.create({
  tvComingSoon: {
    fontSize: fontSize.size_28,
    color: color.white,
    fontFamily: fontFamily.SemiBold,
    opacity: 0.5,
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
