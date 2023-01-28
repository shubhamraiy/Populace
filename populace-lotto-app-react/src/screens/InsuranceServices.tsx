import React from 'react';
import MySafeArea from '@components/MySafeArea';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationComponentProps } from 'react-native-navigation';
import { fontSize, color, fontFamily } from '@styles';

export interface Props extends NavigationComponentProps { }
const InsuranceServices: React.FC<Props> = props => {
  return (
    <MySafeArea componentId={props.componentId}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={styles.tvComingSoon}>{`These services are Coming Soon, please check back at a later date.`}</Text>
      </View>
    </MySafeArea>
  );
};

export default InsuranceServices;

const styles = StyleSheet.create({
  tvComingSoon: {
    fontSize: fontSize.size_28,
    color: color.mediumGrey,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
});