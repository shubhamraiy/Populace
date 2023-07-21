import React from 'react';
import MySafeArea from '@components/MySafeArea';
import {StyleSheet, Text, View} from 'react-native';
import {NavigationComponentProps} from 'react-native-navigation';
import {color, fontFamily, fontSize} from '@styles';

export interface Props extends NavigationComponentProps {}
const FinancialServices: React.FC<Props> = props => {
  return (
    <MySafeArea componentId={props.componentId} padding={0}>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <Text style={styles.tvComingSoon}>
          {
            'Financial services\nare coming soon, please check back at a later date.'
          }
        </Text>
      </View>
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
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});
