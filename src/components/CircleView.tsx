import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {color, fontFamily, fontSize} from '@styles';

export interface Props {
  height?: any;
  width?: any;
  title?: any;
  titleColor?: string;
  backgroundColor?: any;
  borderRadius?: any;
  borderColor?: any;
  borderWidth?: any;
  marginStart?: any;
}

const CircleView: React.FC<Props> = props => {
  const {
    height,
    width,
    title,
    titleColor,
    backgroundColor,
    borderRadius,
    borderColor,
    borderWidth,
    marginStart,
  } = props;
  return (
    <View
      style={{
        height: height ?? 35,
        width: width ?? 35,
        backgroundColor: backgroundColor,
        borderRadius: borderRadius ?? 35,
        borderColor: borderColor ?? color.celticBlue,
        borderWidth: borderWidth ?? 1,
        marginStart: marginStart ?? 3,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Text style={[styles.tvTitle, {color: titleColor ?? color.white}]}>
        {title}
      </Text>
    </View>
  );
};

export default CircleView;

const styles = StyleSheet.create({
  tvTitle: {
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.SemiBold,
  },
});
