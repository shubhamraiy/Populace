import {
  GestureResponderEvent,
  Image,
  ImageResizeMode,
  ImageSourcePropType,
  ImageStyle,
  Pressable,
  PressableStateCallbackType,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {color, fontFamily, fontSize} from '@styles';
import {Utils} from '@Utils';

export interface Props {
  source: ImageSourcePropType;
  resizeMode?: ImageResizeMode | undefined;
  onPress?: null | ((event: GestureResponderEvent) => void) | undefined;
  style?: StyleProp<ImageStyle> | undefined;
  containerStyle?:
    | StyleProp<ViewStyle>
    | ((state: PressableStateCallbackType) => StyleProp<ViewStyle>)
    | undefined;
  topTitle?: any;
  bottomTitle?: any;
  // startTitle?:any
  // endTitle?:any
}

const MyImage: React.FC<Props> = props => {
  let {
    source,
    resizeMode,
    style,
    topTitle,
    bottomTitle,
    containerStyle,
    onPress,
  } = props;
  return (
    <Pressable style={containerStyle} onPress={onPress}>
      {topTitle && <Text style={styles.tvTitle}>{topTitle}</Text>}

      <Image
        style={style ?? styles.ivImage}
        resizeMode={resizeMode ?? 'contain'}
        source={source}
      />

      {bottomTitle && <Text style={styles.tvTitle}>{bottomTitle}</Text>}
    </Pressable>
  );
};

export default MyImage;

const styles = StyleSheet.create({
  tvTitle: {
    fontSize: fontSize.size_10,
    fontFamily: fontFamily.Medium,
    marginTop: Utils.calculateHeight(5),
  },
  ivImage: {
    alignSelf: 'center',
  },
});
