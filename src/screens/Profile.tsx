import {Image, Pressable, StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';
import {Navigator} from '@Navigator';
import {screenName} from '@screenName';

export interface Props extends NavigationComponentProps {}

const Profile: React.FC<Props> = props => {
  const _renderView = (title: string, isMargin?: boolean) => {
    return (
      <Pressable
        onPress={() =>
          Navigator.setPush(
            props.componentId,
            !isMargin ? screenName.EditProfile : screenName.EditAddress,
          )
        }
        style={[
          styles.renderContainer,
          {marginTop: isMargin ? Utils.calculateHeight(48) : 0},
        ]}>
        <Text style={styles.tvTitle}>{title}</Text>

        <Image
          resizeMode={'contain'}
          style={styles.ivArrowNext}
          source={require('@images/ic_back.png')}
        />
      </Pressable>
    );
  };

  return (
    <MySafeArea componentId={props.componentId} isHideBack>
      <View style={styles.container}>
        {_renderView('Profile')}
        {_renderView('Address Info', true)}
      </View>
    </MySafeArea>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  renderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: color.royalBlue,
    borderRadius: 5,
    alignItems: 'center',
    height: Utils.calculateHeight(52),
    paddingHorizontal: Utils.calculateWidth(11),
  },

  ivArrowNext: {
    height: 18,
    width: 12,
    transform: [
      {
        rotate: '180deg',
      },
    ],
  },
  tvTitle: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
  },
});
