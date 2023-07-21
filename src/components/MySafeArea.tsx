import {
  GestureResponderEvent,
  Image,
  ImageBackground,
  ImageSourcePropType,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, {useEffect, useRef, useState} from 'react';
import AppBar from '@components/AppBar';
import {color, fontFamily} from '@styles';
import {Utils} from '@Utils';
import {Navigation} from 'react-native-navigation';
import {ApiServices} from 'services/ApiServices';
import {ApiEndPoint} from 'services/ApiEndPoint';

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
  refreshControl?: any;
  isBottomSubShow?: any;
  IsRefresh?: any;
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
    refreshControl,
    padding,
    leftIconPress,
    rightIconPress,
    sourceBg,
    centerIcon,
    isBottomBgShow,
    isBottomSubShow,
    IsRefresh,
  } = props;

  const [isActive, setActive] = useState('');

  useEffect(() => {
    const unsubscribe = Navigation.events().registerComponentListener(
      {
        componentDidAppear: () => {
          getUser();
        },
      },
      props.componentId,
    );
    return () => unsubscribe.remove();
  }, []);

  useEffect(() => {
    getUser();
  }, [IsRefresh, componentId]);

  const getUser = async () => {
    let user = await Utils._getUserData();
    if (user?.subscription?.status !== undefined) {
      setActive(user?.subscription?.status);
    }
    if (user?.id !== undefined) {
      const json = JSON.stringify({playerId: user?.id});
      await ApiServices.post(ApiEndPoint.getPlayerInfo, json).then(
        async (response: any) => {
          if (response?.data?.subscription?.status !== undefined) {
            setActive(response?.data?.subscription?.status);
          }
        },
      );
    }
  };

  const _bgImage = () => {
    return (
      <ImageBackground
        style={[styles.bgImage, {paddingHorizontal: padding ?? 30}]}
        resizeMode="cover"
        source={sourceBg ?? require('@images/bg_main.png')}>
        {isScroll ? _scrollRender() : _viewRender()}
        {(isBottomBgShow || isBottomSubShow) && (
          <View
            style={{
              marginHorizontal: -30,
              marginBottom:
                isBottomSubShow && Platform.OS === 'ios' ? -35 : undefined,
            }}>
            <Image
              style={isBottomBgShow ? styles.bgBottom : styles.bgBottomSub}
              resizeMode="stretch"
              source={require('@images/bg_bottom.png')}
            />
          </View>
        )}
      </ImageBackground>
    );
  };

  const _scrollRender = () => {
    return isScroll === true ? (
      <View style={{zIndex: 1, flex: 1}}>
        <ScrollView
          scrollEnabled={isScroll}
          refreshControl={refreshControl}
          showsVerticalScrollIndicator={false}>
          {props?.children}
        </ScrollView>
      </View>
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
      {isActive.trim().length > 0 &&
        isActive !== 'active' &&
        isActive !== 'incomplete' &&
        isActive !== 'incomplete_expired' &&
        isActive !== undefined &&
        isActive !== '' &&
        isActive !== null && (
          <View
            style={{
              backgroundColor: color.black,
              padding: 7,
              alignItems: 'center',
            }}>
            <Text
              style={{
                fontFamily: fontFamily.SemiBold,
                color: color.danger,
                fontSize: 12,
              }}>
              {`Your membership has ${isActive}!\nTo play, you'll need to purchase the subscription plan.`}
            </Text>
          </View>
        )}

      {_bgImage()}
      {/* {sourceBg ? _bgImage() : _scrollRender()} */}
    </SafeAreaView>
  );
};

export default MySafeArea;

const styles = StyleSheet.create({
  bgImage: {
    flex: 1,
  },
  bgBottom: {
    width: '100%',
    height: 133,
    backgroundColor: color.black,
  },
  bgBottomSub: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: Platform.OS == 'ios' ? Utils.calculateHeight(32) : 0,
    width: '100%',
    height: 133,
    zIndex: 0,
  },
});
