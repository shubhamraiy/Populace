import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {fontSize, fontFamily, color} from '@styles';
import {Utils} from '@Utils';
import {Navigator} from '@Navigator';
import {NavigationComponentProps} from 'react-native-navigation';
import {screenName} from '@screenName';

export interface Props {
  marginTop?: any;
  componentId?: string
}
const TermsCondition: React.FC<Props> = props => {
  const {marginTop} = props;
  return (
    <Text
      style={[
        styles.tvSigning,
        {marginTop: marginTop ?? Utils.calculateHeight(60)},
      ]}>
      By signing up, you agree to our{' '}
      <Text
        onPress={() =>
          Navigator.setPush(props.componentId, screenName.TermsPrivacyTab)
        }
        style={styles.tvTermsCondition}>
        Terms & Conditions{' '}
      </Text>
      and{' '}
      <Text
        onPress={() =>
          Navigator.setPush(props.componentId, screenName.TermsPrivacyTab)
        }
        style={styles.tvTermsCondition}>
        Privacy Policy
      </Text>
    </Text>
  );
};

export default TermsCondition;

const styles = StyleSheet.create({
  tvSigning: {
    // marginBottom: Utils.calculateHeight(30),
    fontSize: fontSize.size_12,
    fontFamily: fontFamily.Medium,
    color: color.white,
    textAlign: 'center',
  },
  tvTermsCondition: {
    color: color.pictonBlue,
    textDecorationLine: 'underline',
  },
})
