import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect} from 'react';
import {NavigationComponentProps} from 'react-native-navigation';
import MySafeArea from '@components/MySafeArea';
import {color, fontSize, fontFamily} from '@styles';
import {Utils} from '@Utils';

export interface Props extends NavigationComponentProps {
  propsData: any;
}

const HowItWork: React.FC<Props> = props => {
  const {propsData} = props;

  return (
    <MySafeArea
      componentId={props.componentId}
      isHideBack={!propsData?.isBottomShow}
      isScroll
      isBottomBgShow={propsData?.isBottomShow}>
      <Text style={styles.tvTitle}>How It Works</Text>

      <Text style={styles.tvSubTitle}>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book. It has survived not only five centuries, but
        also the leap into electronic typesetting, remaining essentially
        unchanged. It was popularised in the 1960s with the release of Letraset
        sheets containing Lorem Ipsum passages, and more recently with desktop
        publishing software like Aldus PageMaker including versions of Lorem
        Ipsum.
      </Text>
      <Text style={styles.tvSubTitle}>
        Lorem Ipsum has been the industry's standard dummy text ever since the
        1500s, when an unknown printer took a galley of type and scrambled it to
        make a type specimen book.
      </Text>
    </MySafeArea>
  );
};

export default HowItWork;

const styles = StyleSheet.create({
  tvTitle: {
    color: color.white,
    fontSize: fontSize.size_18,
    fontFamily: fontFamily.SemiBold,
    textAlign: 'center',
    marginTop: Utils.calculateHeight(80),
  },

  tvSubTitle: {
    textAlign:'justify',
    color: color.white,
    fontSize: fontSize.size_14,
    fontFamily: fontFamily.Regular,
    marginTop: Utils.calculateHeight(56),
  },
});
