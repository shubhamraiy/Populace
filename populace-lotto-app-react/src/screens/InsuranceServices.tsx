import React from 'react';
import MySafeArea from '@components/MySafeArea';
import { StyleSheet, Text } from 'react-native';
import { NavigationComponentProps } from 'react-native-navigation';
import { fontSize, color, fontFamily } from '@styles';

export interface Props extends NavigationComponentProps { }
const InsuranceServices: React.FC<Props> = props => {
  return (
    <MySafeArea componentId={props.componentId}>
      <Text style={styles.tvComingSoon}>{`These services are
Coming Soon, please
check back at a
later date.`}</Text>

    </MySafeArea>
  );
};

export default InsuranceServices;

const styles = StyleSheet.create({
  tvComingSoon: {
    fontSize: fontSize.size_28,
    color: color.mediumGrey,
    fontFamily: fontFamily.SemiBold,
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center'
  },
});