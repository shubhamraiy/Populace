import {
  ActivityIndicator,
  GestureResponderEvent,
  Image,
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
export interface Props {
  width?: any;
  title: string;
  backgroundColor?: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  marginTop?: any;
  marginIconEnd?: any;
  marginBottom?: any;
  marginStart?: any;
  marginEnd?: any;
  iconLeft?: ImageSourcePropType;
  titleColor?: string;
  FontSize?: any;
  marginHorizontal?: any;
  FontFamily?: any;
  height?: any;
  paddingHorizontal?: any;
  isLoading?: boolean;
  disabled?: boolean;
}

const CustomButton: React.FC<Props> = props => {
  const {
    title,
    backgroundColor,
    onPress,
    marginTop,
    marginIconEnd,
    marginBottom,
    marginStart,
    marginEnd,
    iconLeft,
    titleColor,
    width,
    FontSize,
    marginHorizontal,
    FontFamily,
    height,
    paddingHorizontal,
    isLoading,
    disabled,
  } = props;
  return (
    <TouchableOpacity
      disabled={isLoading || disabled}
      activeOpacity={0.7}
      style={[
        styles.btnContainer,
        {
          backgroundColor: backgroundColor ?? color.royalBlue,
          marginTop: marginTop,
          marginBottom: marginBottom,
          marginStart: marginStart,
          marginEnd: marginEnd,
          marginHorizontal: marginHorizontal,
          width: width,
          paddingHorizontal: paddingHorizontal,
          height: height ?? Utils.calculateHeight(52),
        },
      ]}
      onPress={onPress}>
      {iconLeft && (
        <Image
          style={[
            styles.ivImage,
            {
              marginEnd: marginIconEnd
                ? marginIconEnd
                : Utils.calculateWidth(10),
            },
          ]}
          source={iconLeft}
          resizeMode="contain"
        />
      )}
      {isLoading ? (
        <ActivityIndicator color={titleColor ? titleColor : color.white} />
      ) : (
        <Text
          style={[
            styles.tvTitle,
            {
              color: titleColor ? titleColor : color.white,
              fontSize: FontSize ?? fontSize.size_18,
              fontFamily: FontFamily ?? fontFamily.SemiBold,
            },
          ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  tvTitle: {
    textAlign: 'center',
  },
  ivImage: {
    height: 24,
    width: 24,
  },
});
