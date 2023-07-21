import {
  Image,
  ImageSourcePropType,
  KeyboardTypeOptions,
  StyleSheet,
  Text,
  TextInput,
  View,
  Platform,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';

export interface Props {
  placeholder?: any;
  value: any | undefined;
  height?: any;
  multiline?: boolean | undefined;
  editable?: boolean | undefined;
  maxLength?: number | undefined;
  marginTop?: any;
  marginStart?: any;
  keyboardType?: KeyboardTypeOptions | undefined;
  numberOfLines?: number | undefined;
  onChangeText?: ((text: string) => void) | undefined;
  rightIcon?: ImageSourcePropType;
  iconWidth?: any;
  iconHeight?: any;
  iconColor?: any;
  secureTextEntry?: any;
  width?: any;
  paddingHorizontal?: any;
  textAlign?: any;
  FontSize?: any;
  innerplaceholder?: any;
  children?: any;
  onPressIn?: any;
  style?: any;
  onPressIcon?: any;
  IconStyle?: any;
  textInpStyle?: any;
}

const MyTextInput: React.FC<Props> = props => {
  let {
    placeholder,
    value,
    onChangeText,
    multiline,
    numberOfLines,
    editable,
    maxLength,
    keyboardType,
    height,
    marginTop,
    marginStart,
    rightIcon,
    iconWidth,
    iconHeight,
    iconColor,
    secureTextEntry,
    paddingHorizontal,
    textAlign,
    width,
    FontSize,
    innerplaceholder,
    children,
    onPressIn,
    style,
    onPressIcon,
    IconStyle,
    textInpStyle,
  } = props;

  return (
    <View
      style={{
        marginTop: marginTop,
        minHeight: height ?? Utils.calculateHeight(52),
        width: width ?? undefined,
        marginStart: marginStart,
      }}>
      <Text style={styles.tvLabel}>{placeholder}</Text>
      {children ? (
        children
      ) : (
        <View style={style}>
          <TextInput
            style={[
              styles.inputContainer,
              {
                textAlignVertical: multiline === true ? 'top' : 'auto',
                textAlign: textAlign,
                fontSize: FontSize ?? fontSize.size_14,
                paddingHorizontal:
                  paddingHorizontal ?? Utils.calculateHeight(15),
                flex: rightIcon ? 1 : undefined,
              },
              textInpStyle,
            ]}
            placeholderTextColor={color.white}
            multiline={multiline}
            numberOfLines={numberOfLines ?? 1}
            maxLength={maxLength}
            editable={editable}
            secureTextEntry={secureTextEntry}
            placeholder={innerplaceholder}
            value={value}
            keyboardType={keyboardType}
            onChangeText={onChangeText}
            onPressIn={onPressIn}
          />
          {rightIcon && (
            <TouchableOpacity onPress={onPressIcon}>
              <Image
                source={rightIcon}
                resizeMode="contain"
                style={IconStyle}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

export default MyTextInput;

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#0C2271',
    height: Platform.OS == 'ios' ? Utils.calculateHeight(52) : undefined,
    marginTop: Utils.calculateHeight(5),
    borderRadius: Utils.calculateHeight(5),
    color: color.white,
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Regular,
    paddingHorizontal: Utils.calculateHeight(15),
  },
  tvLabel: {
    fontSize: fontSize.size_14,
    color: color.white,
    fontFamily: fontFamily.Medium,
  },
  ivLeftIcon: {
    marginStart: Utils.calculateWidth(7),
  },
});
