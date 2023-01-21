import {
  GestureResponderEvent,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React from 'react';
import {Utils} from '@Utils';
import {color, fontFamily, fontSize} from '@styles';
import {Navigator} from '@Navigator';

export interface Props {
  backgroundColor?: string;
  title?: string;
  isHideBack?: boolean;
  rightIcon?: ImageSourcePropType;
  leftIcon?: any;
  leftIconPress?: any;
  rightIconPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  titleColor?: string;
  componentId: any;
  centerIcon?: ImageSourcePropType;
}

const AppBar: React.FC<Props> = props => {
  let {
    backgroundColor,
    title,
    rightIcon,
    titleColor,
    leftIcon,
    isHideBack,
    componentId,
    leftIconPress,
    rightIconPress,
    centerIcon,
  } = props;
  return (
    <ImageBackground
      source={require('@images/appbar_bg.png')}
      resizeMode="stretch"
      style={{
        height: centerIcon ? undefined : Utils.calculateHeight(123),
        width: '100%',
        backgroundColor: backgroundColor ?? color.black,
      }}>
      <View style={{flex: 1, justifyContent: 'flex-end', padding: 30}}>
        {!isHideBack && (
          <Pressable
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: Utils.calculateHeight(12),
              // marginStart: Utils.calculateWidth(30),
            }}
            onPress={() => {
              leftIcon ? leftIconPress() : Navigator.setPop(componentId);
            }}>
            <Image
              resizeMode="contain"
              source={leftIcon ?? require('@images/ic_back.png')}
              style={{
                height: 13.5,
                width: 9,
                marginEnd: Utils.calculateWidth(5.5),
              }}
            />

            <Text
              style={{
                color: color.white,
                fontFamily: fontFamily.SemiBold,
                fontSize: fontSize.size_16,
              }}>
              Back
            </Text>
          </Pressable>
        )}

        <View
          style={{
            flexDirection: 'row',
            // flex: 1,
            // marginStart: Utils.calculateWidth(30),
            // flexGrow: 0,
            // backgroundColor: 'red',
          }}>
          <Image
            resizeMode="cover"
            style={styles.ivCenter}
            source={centerIcon ?? require('@images/app_logo.png')}
          />
          <Text
            style={{
              color: color.white,
              fontFamily: fontFamily.SemiBold,
              textTransform: 'uppercase',
              marginTop: Utils.calculateHeight(20),
              marginStart: 5,
              letterSpacing: 3,
            }}>
            Equity for the people
          </Text>
        </View>
      </View>
    </ImageBackground>
  );
};

export default AppBar;

const styles = StyleSheet.create({
  ivCenter: {
    height: 36,
    width: 32,
    // backgroundColor: color.textColor,
    // borderRadius: 40,
    // tintColor: color.black,
    // shadowColor: '#63F4F766',
  },
});
