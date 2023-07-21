import {ActivityIndicator, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationComponentProps} from 'react-native-navigation';

export interface Props extends NavigationComponentProps {}

const Loader = (props: any) => {
  return (
    <SafeAreaView style={[styles.container, props.style]}>
      <ActivityIndicator size="large" />
    </SafeAreaView>
  );
};

export default Loader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
});
