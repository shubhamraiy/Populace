import {FlatList, StyleSheet, Text, View, Pressable} from 'react-native';
import CustomButton from '@components/CustomButton';
import {color, fontFamily, fontSize} from '@styles';
import {Navigator} from '@Navigator';
import React, {useState} from 'react';
import Modal from 'react-native-modal';
import MyTextInput from './MyTextInput';
import {USstates, Utils} from '@Utils';

export interface Props {
  isVisible?: any;
  toggleModal?: any;
  onClose?: any;
  onPress?: any;
}

const PopUpStates: React.FC<Props> = props => {
  const [search, setSearch] = useState('');
  const [feedItems, setfeedItems] = useState(USstates);
  let {isVisible, toggleModal, onClose, onPress} = props;

  const search_data = (text: string) => {
    setSearch(text);
    let state_search = USstates?.filter(function (item) {
      const item_data = `${item.name} ${item.abbreviation}`.toUpperCase();
      const text_data = text.toUpperCase();
      return item_data.indexOf(text_data) > -1;
    });

    setfeedItems(state_search);
  };

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isVisible}
        onSwipeComplete={toggleModal}
        style={{
          borderRadius: 20,
          backgroundColor: color.black,
          marginTop: 150,
        }}
        onBackdropPress={onClose}
        backdropOpacity={0.5}>
        <View style={{}}>
          <View style={{paddingHorizontal: 10, marginTop: -20}}>
            <MyTextInput
              value={search}
              innerplaceholder="Search..."
              onChangeText={search_data}
            />
          </View>

          <FlatList
            data={feedItems}
            style={{overflow: 'hidden', height: 550}}
            renderItem={({item, index}) => {
              return (
                <Pressable
                  onPress={() => onPress(item)}
                  style={{
                    borderTopWidth: 1,
                    borderColor: color.white,
                    padding: 10,
                  }}>
                  <Text
                    style={{
                      fontFamily: fontFamily.SemiBold,
                      color: color.white,
                    }}>
                    {item?.name}
                  </Text>
                </Pressable>
              );
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

export default PopUpStates;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: 200,
  },
});
