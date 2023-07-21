import {StyleSheet, Text, View, ActivityIndicator} from 'react-native';
import {color, fontFamily} from '@styles';
import React from 'react';
import Modal from 'react-native-modal';

export interface Props {
  isVisible?: any;
  toggleModal?: any;
  onClose?: any;
}

const LoaderModal: React.FC<Props> = props => {
  let {isVisible, toggleModal, onClose} = props;

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={toggleModal}
      onBackdropPress={onClose}
      backdropOpacity={0.5}>
      <View style={styles.container}>
        <Text style={styles.Txt}>Please wait while we are processing...</Text>
        <ActivityIndicator color={color.denim} size={'large'} />
      </View>
    </Modal>
  );
};

export default LoaderModal;

const styles = StyleSheet.create({
  container: {
    borderRadius: 20,
    backgroundColor: color.white,
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
  },
  Txt: {
    marginBottom: 20,
    color: color.royalBlue,
    fontFamily: fontFamily.SemiBold,
  },
});
