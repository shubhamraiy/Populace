import {Image, ImageSourcePropType, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';

export interface Props {
  title: any;
  icon: ImageSourcePropType;
  imageHeight?: any;
  imageWidth?: any;
  borderRadius?: any;
  backgroundColor?: any;
  marginTop?: any;
  marginBottom?: any;
  marginStart?: any;
  marginEnd?: any;
  marginVertical?: number | string | undefined;
  marginHorizontal?: number | string | undefined;
  textColor?: any;
  fontSizes?: any;
  fontFamilies?: any;
}

const TextWithIcon: React.FC<Props> = props => {
  let {
    title,
    icon,
    marginTop,
    marginBottom,
    marginStart,
    marginEnd,
    marginHorizontal,
    imageHeight,
    imageWidth,
    borderRadius,
    backgroundColor,
    textColor,
    fontSizes,
    fontFamilies,
    marginVertical,
  } = props;

  return (
    <View
      style={[
        styles.container,
        {
          marginTop: marginTop ? marginTop : 0,
          marginBottom: marginBottom ? marginBottom : 0,
          marginStart: marginStart ? marginStart : 0,
          marginEnd: marginEnd ? marginEnd : 0,
          marginVertical: marginVertical ?? 0,
          marginHorizontal: marginHorizontal,
        },
      ]}>
      <Image
        style={{
          height: imageHeight ?? Utils.calculateHeight(20),
          width: imageWidth ?? Utils.calculateWidth(20),
          backgroundColor: backgroundColor,
          borderRadius: borderRadius,
        }}
        resizeMode="contain"
        source={icon}
      />

      <Text
        style={[
          styles.tvTitle,
          {
            color: textColor ?? color.black,
            fontSize: fontSizes ?? fontSize.size_18,
            fontFamily: fontFamilies ?? fontFamily.SemiBold,
          },
        ]}>
        {title}
      </Text>
    </View>
  );
};

export default TextWithIcon;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  tvTitle: {
    marginStart: Utils.calculateHeight(1),
  },
});
