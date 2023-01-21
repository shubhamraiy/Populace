import React from 'react';
import MySafeArea from '@components/MySafeArea';
import {NavigationComponentProps} from 'react-native-navigation';
import {StyleSheet, Text, View} from 'react-native';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import MyTextInput from '@components/MyTextInput';
import CustomButton from '@components/CustomButton';

export interface Props extends NavigationComponentProps {}

const RequestWithdraw: React.FC<Props> = props => {
  return (
    <MySafeArea componentId={props.componentId}>
      <Text style={styles.tvTitle}>Request to withdraw funds</Text>

      <View style={styles.rowContainer}>
        <MyTextInput
          editable={false}
          textAlign={'center'}
          FontSize={fontSize.size_12}
          value={'Account balance'}
          width={Utils.calculateWidth(212)}
        />
        <MyTextInput
          FontSize={fontSize.size_12}
          value={'$100'}
          editable={false}
          textAlign={'center'}
          marginStart={Utils.calculateWidth(6)}
          width={Utils.calculateWidth(112)}
        />
      </View>
      <MyTextInput
        marginTop={Utils.calculateHeight(10)}
        paddingHorizontal={Utils.calculateWidth(45)}
        FontSize={fontSize.size_12}
        multiline={true}
        textAlign={'center'}
        value={'Enter the amount you are requesting to with draw.'}
        editable={false}
      />

      <CustomButton
        title={'Submit Request'}
        marginTop={Utils.calculateHeight(60)}
      />
    </MySafeArea>
  );
};

export default RequestWithdraw;

const styles = StyleSheet.create({
  tvTitle: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(60),
  },

  rowContainer: {
    marginTop: Utils.calculateHeight(25),
    justifyContent: 'center',
    flexDirection: 'row',
  },
});
