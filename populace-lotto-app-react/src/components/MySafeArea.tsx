import {
  GestureResponderEvent,
  Image,
  ImageBackground,
  ImageSourcePropType,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import React, {useRef} from 'react';
import AppBar from '@components/AppBar';
import {color} from '@styles';
import {Utils} from '@Utils';

export interface Props {
  children?: React.ReactNode;
  isHideAppBar?: boolean;
  appBackgroundColor?: string;
  backgroundColor?: string;
  title?: string;
  isHideBack?: boolean;
  rightIcon?: ImageSourcePropType;
  leftIcon?: any;
  titleColor?: string;
  componentId: any;
  isScroll?: boolean;
  padding?: any;
  leftIconPress?: any;
  sourceBg?: ImageSourcePropType;
  centerIcon?: ImageSourcePropType;
  isBottomBgShow?: boolean;
  rightIconPress?: null | ((event: GestureResponderEvent) => void) | undefined;
}

const MySafeArea: React.FC<Props> = props => {
  let {
    isHideAppBar,
    appBackgroundColor,
    backgroundColor,
    title,
    isHideBack,
    rightIcon,
    leftIcon,
    titleColor,
    componentId,
    isScroll,
    padding,
    leftIconPress,
    rightIconPress,
    sourceBg,
    centerIcon,
    isBottomBgShow,
  } = props;

  const _bgImage = () => {
    return (
      <ImageBackground
        style={[styles.bgImage, {padding: padding ?? 30}]}
        resizeMode="cover"
        source={sourceBg ?? require('@images/bg_main.png')}>
        {isScroll ? _scrollRender() : _viewRender()}
      </ImageBackground>
    );
  };

  const _scrollRender = () => {
    return isScroll === true ? (
      <ScrollView scrollEnabled={isScroll} showsVerticalScrollIndicator={false}>
        {props?.children}
      </ScrollView>
    ) : (
      _viewRender()
    );
  };

  const _viewRender = () => {
    return <View style={{flex: 1}}>{props.children}</View>;
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColor ?? 'transparent',
      }}>
      {!isHideAppBar && (
        <AppBar
          backgroundColor={appBackgroundColor}
          title={title}
          isHideBack={isHideBack}
          rightIcon={rightIcon}
          leftIcon={leftIcon}
          titleColor={titleColor}
          componentId={componentId}
          leftIconPress={leftIconPress}
          rightIconPress={rightIconPress}
          centerIcon={centerIcon}
        />
      )}

      {_bgImage()}
      {isBottomBgShow && (
        <Image
          style={{
            width: '100%',
            height: 133,
            backgroundColor: color.black,
          }}
          resizeMode="stretch"
          source={require('@images/bg_bottom.png')}
        />
      )}
      {/* {sourceBg ? _bgImage() : _scrollRender()} */}
    </SafeAreaView>
  );
};

export default MySafeArea;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
});
