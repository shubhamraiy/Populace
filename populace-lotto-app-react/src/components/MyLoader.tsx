import {ActivityIndicator, SafeAreaView, StyleSheet} from 'react-native';
import React from 'react';
import {NavigationComponentProps} from 'react-native-navigation';

export interface Props extends NavigationComponentProps {}

const MyLoader: React.FC<Props> = props => {
  return (
    <SafeAreaView style={styles.container}>
      <ActivityIndicator size="large" />
      {/* <Text>{loadingTitle??'Loading'}</Text> */}
    </SafeAreaView>
  );
};

export default MyLoader;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
